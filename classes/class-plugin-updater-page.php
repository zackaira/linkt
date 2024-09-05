<?php
class LinktLemSqPluginLicense {
	private $linkt_settings_options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'linkt_settings_add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'linkt_settings_page_init' ) );
		add_action( "update_option_the_lic_kyfor_pro", array( $this, 'handle_license_activation' ), 10, 3 );
	}

	public function linkt_settings_add_plugin_page() {
		add_submenu_page(
			'edit.php?post_type=linkt', // Parent slug
			'License Key',              // Page title
			'License',                  // Menu title
			'manage_options',           // Capability required
			'linkt-license',            // Menu slug
			array( $this, 'linkt_settings_create_admin_page' )
		);
	}

	public function linkt_settings_create_admin_page() {
		$this->linkt_settings_options = get_option( 'the_lic_kyfor_pro' );
		$current_user = wp_get_current_user(); ?>
		<div class="wrap">
			<h2><?php esc_html__("Linkt Settings", "linkt"); ?></h2>
			<p></p>
			<?php settings_errors(); ?>

			<a href="<?php echo esc_url(admin_url('edit.php?post_type=linkt&page=linkt-settings')); ?>" class="linkt-back">
				<?php esc_html_e("Back to Settings", "linkt"); ?>
			</a>
			<div class="linkt-lic-wrap">
				<p class="linkt-lic-txt">
					<?php esc_html_e("Please enter your license key received after purchase to activate the Linkt Pro.", "linkt"); ?>
				</p>
				<form method="post" action="options.php">
					<?php
						settings_fields( 'linkt_settings_option_group' );
						do_settings_sections( 'linkt-settings-admin' );
						submit_button();
					?>
				</form>
			</div>
		</div><?php
		if (current_user_can( 'manage_options' ) && $current_user->user_email === 'zack@kairaweb.com') {
			var_dump( '<pre>' );
			var_dump( json_decode(get_option( 'linkt_license_message' )) );
			var_dump( '</pre>' );
		}
	}

	public function linkt_settings_page_init() {
		register_setting(
			'linkt_settings_option_group', // option_group
			'the_lic_kyfor_pro', // option_name
			array( $this, 'linkt_settings_sanitize' ) // sanitize_callback
		);

		add_settings_section(
			'linkt_settings_setting_section', // id
			'', // title
			array( $this, 'linkt_settings_section_info' ), // callback
			'linkt-settings-admin' // page
		);

		add_settings_field(
			'api_key_0', // id
			'License Key', // title
			array( $this, 'api_key_0_callback' ), // callback
			'linkt-settings-admin', // page
			'linkt_settings_setting_section' // section
		);
	}

	public function linkt_settings_sanitize( $input ) {
		$sanitary_values = array();
		if ( isset( $input['api_key_0'] ) ) {
			$sanitary_values['api_key_0'] = sanitize_text_field( $input['api_key_0'] );
		}

		return $sanitary_values;
	}

	public function linkt_settings_section_info() {}

	public function api_key_0_callback() {
		printf(
			'<input class="regular-text" type="text" name="the_lic_kyfor_pro[api_key_0]" id="api_key_0" value="%s">',
			isset( $this->linkt_settings_options['api_key_0'] ) ? esc_attr( $this->linkt_settings_options['api_key_0'] ) : ''
		);

		$license_message = json_decode(get_option( 'linkt_license_message' ));
		$message = false;

		if ( isset( $license_message->data->activated ) ) {
			if ( $license_message->data->activated ) {
				$message = "<span class='active'>License is active. You have {$license_message->data->license_key->activation_usage}/{$license_message->data->license_key->activation_limit} instances activated.</span>";
			} else {
				$message = $license_message->error ?: "License for this site is not active. Click the button below to activate.";
			}
		}

		$license_key = get_option( 'the_lic_kyfor_pro' );
		if ( isset( $license_key['api_key_0'] ) && ! empty( $license_key['api_key_0'] ) && $message ) {
			echo "<p class='description'>{$message}</p>";
		}
	}

	public function handle_license_activation( $old_value, $new_value, $option ) {
		if ( isset( $new_value['api_key_0'] ) && ! empty( $new_value['api_key_0'] ) && $old_value['api_key_0'] !== $new_value['api_key_0'] ) {
			$this->activate_license( $new_value['api_key_0'] );
		}

		if ( isset( $new_value['api_key_0'] ) && empty( $new_value['api_key_0' ] ) && ! empty( $old_value['api_key_0'] ) ) {
			$license_message = json_decode( get_option( 'linkt_license_message' ) );
			if ( isset( $license_message->data->instance->id ) ) {
				$this->deactivate_license( $old_value['api_key_0'], $license_message->data->instance->id );
			}
		}
	}

	public function activate_license( $license_key ) {
		$activation_url = add_query_arg(
			[
				'license_key' => $license_key,
				'instance_name' => home_url(),
			],
			LINKT_PLUGIN_API_URL . '/activate'
		);

		$response = wp_remote_get( $activation_url, [
			'sslverify' => false,
			'timeout' => 10,
		] );

		if (
			is_wp_error( $response )
			|| ( 200 !== wp_remote_retrieve_response_code( $response ) && 400 !== wp_remote_retrieve_response_code( $response ) )
			|| empty( wp_remote_retrieve_body( $response ) )
		) {
			return;
		}

		update_option( 'linkt_license_message', wp_remote_retrieve_body( $response ) );
	}

	public function deactivate_license( $license_key, $instance_id ) {
		$activation_url = add_query_arg(
			[
				'license_key' => $license_key,
				'instance_id' => $instance_id,
			],
			LINKT_PLUGIN_API_URL . '/deactivate'
		);

		$response = wp_remote_get( $activation_url, [
			'sslverify' => false,
			'timeout' => 10,
		] );

		if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
			delete_option( 'linkt_license_message' );
		}
	}
}

if ( is_admin() ) {
	$linkt_settings = new LinktLemSqPluginLicense();
}
