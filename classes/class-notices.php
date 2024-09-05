<?php
/**
 * Scripts & Styles file
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Main plugin class.
 */
class Linkt_Notices {
	/**
	 * Constructor funtion
	 */
	public function __construct() {
		add_action( 'admin_init', array($this, 'linkt_dismiss_notice' ), 0);
		add_action( 'admin_notices', array($this, 'linkt_add_update_notice' ));
	} // End __construct ()

	/**
	 * Add notices
	 */
	public function linkt_add_update_notice() {
		global $pagenow;
		global $current_user;
        $user_id = $current_user->ID;
		$linkt_page = isset( $_GET['page'] ) ? $pagenow . '?page=' . sanitize_text_field($_GET['page']) . '&' : sanitize_text_field($pagenow) . '?';

		$notices = $this->linkt_notices();

		$allowed_html = array(
			'b' => array('style' => array()),
		);

		if ( $pagenow == 'index.php' || $pagenow == 'plugins.php' || $pagenow == 'options-general.php' ) :

			if ( $notices ) :
				// Loop over all notices
				foreach ($notices as $notice) :

					if ( current_user_can( 'manage_options' ) && !get_user_meta( $user_id, 'linkt_notice_' . $notice['id'] . '_dismissed', true ) ) : ?>
						<div class="linkt-admin-notice notice notice-<?php echo isset($notice['type']) ? sanitize_html_class($notice['type']) : 'info'; ?>">
							<a href="<?php echo esc_url(admin_url($linkt_page . 'linkt_dismiss_notice&linkt-notice-id=' . $notice['id'])); ?>" class="notice-dismiss"></a>

							<div class="linkt-notice <?php echo isset($notice['inline']) ? esc_attr( 'inline' ) : ''; ?>">
								<?php if (isset($notice['title'])) : ?>
									<h4 class="linkt-notice-title"><?php echo wp_kses($notice['title'] ,$allowed_html); ?></h4>
								<?php endif; ?>

								<?php if (isset($notice['text'])) : ?>
									<p class="linkt-notice-text"><?php echo wp_kses($notice['text'] ,$allowed_html); ?></p>
								<?php endif; ?>

								<?php if (isset($notice['link']) && isset($notice['link_text'])) : ?>
									<a href="<?php echo esc_url($notice['link']); ?>" class="linkt-notice-btn">
										<?php esc_html_e($notice['link_text']); ?>
									</a>
								<?php endif; ?>
							</div>
						</div><?php
					endif;

				endforeach;
			endif;
			
		endif;
	}
	// Make Notice Dismissable
	public function linkt_dismiss_notice() {
		global $current_user;
		$user_id = $current_user->ID;

		if ( isset( $_GET['linkt_dismiss_notice'] ) ) {
			$linkt_notice_id = sanitize_text_field( $_GET['linkt-notice-id'] );
			add_user_meta( $user_id, 'linkt_notice_' .$linkt_notice_id. '_dismissed', 'true', true );
		}
    }

	/**
	 * Build Notices Array
	 */
	private function linkt_notices() {
		if ( !is_admin() )
			return;

		$settings = array();
		
		// $settings['new_blocks_added'] = array(
		// 	'id'    => 'newblocks_003', // Increment this when adding new blocks
		// 	'type'  => 'info', // info | error | warning | success
		// 	'title' => __( 'New Advans,fh vsj dfced Slider & Content Toggler blocks have been added to the Linkt plugin', 'linkt' ),
		// 	'text'  => __( 'To enable the new blocks and start using them in the WordPress editor:', 'linkt' ),
		// 	'link'  => admin_url( 'options-general.php?page=linkt-settings' ),
		// 	'link_text' => __( 'Go to the Linkt settings', 'linkt' ),
		// 	'inline' => true, // To display the link & text inline
		// );

		// $settings['new_settings'] = array(
		// 	'id'    => '01',
		// 	'type'  => 'info',
		// 	'title' => __( 'Linkt, manually added notice', 'linkt' ),
		// 	'text'  => __( 'Other notices can be added simply by adding then here in the code', 'linkt' ),
		// 	// 'link'  => admin_url( 'options-general.php?page=linkt-settings' ),
		// 	// 'link_text' => __( 'Go to Settings', 'linkt' ),
		// 	// 'inline' => true,
		// );

		return $settings;
	}
}
new Linkt_Notices();
