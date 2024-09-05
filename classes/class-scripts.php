<?php
/**
 * Scripts & Styles file
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Main plugin class.
 */
class Linkt {
	/**
	 * The single instance of Linkt
	 */
	private static $_instance = null; //phpcs:ignore

	/**
	 * The version number
	 */
	public $_version; //phpcs:ignore

	/**
	 * The main plugin file.
	 */
	public $file;

	/**
	 * Constructor funtion
	 */
	public function __construct($file = '', $version = LINKT_PLUGIN_VERSION) {
		$this->file     = $file;
		$this->_version = $version;

		register_activation_hook( $this->file, array( $this, 'install' ) );

		// Register Scripts for plugin.
		add_action( 'init', array( $this, 'linkt_register_scripts' ), 10 );

		// Update/fix defaults on plugins_loaded hook
		add_action( 'plugins_loaded', array( $this, 'linkt_update_plugin_defaults' ) );

		// Load Frontend JS & CSS.
		add_action( 'wp_enqueue_scripts', array( $this, 'linkt_frontend_scripts' ), 10 );

		// Load Admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'linkt_admin_scripts' ), 10, 1 );

		// Load Editor JS & CSS.
		add_action( 'enqueue_block_editor_assets', array( $this, 'linkt_block_editor_scripts' ), 10, 1 );

		$this->linkt_load_plugin_textdomain();
		add_action( 'init', array( $this, 'linkt_load_localisation' ), 0 );
	} // End __construct ()

	/**
	 * Register Scripts & Styles
	 */
	public function linkt_register_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';

		// Font Awesome Free
		wp_register_style('linkt-fontawesome', esc_url(LINKT_PLUGIN_URL . 'assets/font-awesome/css/all.min.css'), array(), LINKT_PLUGIN_VERSION);
		
		// Linkt Frontend
		wp_register_style('linkt-frontend-style', esc_url(LINKT_PLUGIN_URL . 'dist/frontend' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_register_script('linkt-frontend-script', esc_url(LINKT_PLUGIN_URL . 'dist/frontend' . $suffix . '.js'), array(), LINKT_PLUGIN_VERSION);

		// Settings JS
		wp_register_style('linkt-admin-settings-style', esc_url(LINKT_PLUGIN_URL . 'dist/settings' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_register_script('linkt-admin-settings-script', esc_url(LINKT_PLUGIN_URL . 'dist/settings' . $suffix . '.js'), array('wp-element', 'wp-i18n'), LINKT_PLUGIN_VERSION, true);

		// Dashboard Widget
		wp_register_style('linkt-dashboard-style', esc_url(LINKT_PLUGIN_URL . 'dist/dashboard' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_register_script('linkt-dashboard-script', esc_url(LINKT_PLUGIN_URL . 'dist/dashboard' . $suffix . '.js'), array('wp-element', 'wp-i18n'), LINKT_PLUGIN_VERSION, true);

		// Linkt Post Type Dashboard List
		wp_register_style('linkt-admin-list-style', esc_url(LINKT_PLUGIN_URL . 'dist/post-type-list' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_register_script('linkt-admin-list-script', esc_url(LINKT_PLUGIN_URL . 'dist/post-type-list' . $suffix . '.js'), array('wp-i18n'), LINKT_PLUGIN_VERSION, true);

		// Linkt Post Type Page
		wp_register_style('linkt-admin-linkt-style', esc_url(LINKT_PLUGIN_URL . 'dist/linkt-post-type' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_register_script('linkt-admin-linkt-script', esc_url(LINKT_PLUGIN_URL . 'dist/linkt-post-type' . $suffix . '.js'), array('wp-element', 'wp-i18n', 'wp-data', 'wp-block-editor', 'wp-components', 'wp-api-fetch'), LINKT_PLUGIN_VERSION, true);
	} // End linkt_register_scripts ()

	/**
	 * Load frontend Scripts & Styles
	 */
	public function linkt_frontend_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';
		$linktSavedOptions = get_option('linkt_options');
		$linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';

		// Frontend CSS
		wp_enqueue_style('linkt-frontend-style');
		wp_enqueue_script('linkt-frontend-script');
		wp_localize_script('linkt-frontend-script', 'linktFrontObj', array(
			'apiUrl' => esc_url(get_rest_url()),
			'nonce' => wp_create_nonce('wp_rest'),
			'currentPostId' => is_singular('linkt') ? get_the_ID() : null,
		));
	} // End linkt_frontend_scripts ()

	/**
	 * Admin enqueue Scripts & Styles
	 */
	public function linkt_admin_scripts( $hook = '') {
		global $pagenow;
		$adminPage = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : $pagenow;
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';

		$linktSavedOptions = get_option('linkt_options');
		$linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';
		$lsProOptions = json_decode(get_option('linkt_license_message'));
		$isPremium = isset( $lsProOptions->data->activated ) ? (bool) $lsProOptions->data->activated : false;
		$linktDefaults = get_option('linkt_default_options');

		// Admin CSS
		wp_register_style('linkt-admin-style', esc_url(LINKT_PLUGIN_URL . 'dist/admin' . $suffix . '.css'), array(), LINKT_PLUGIN_VERSION);
		wp_enqueue_style('linkt-admin-style');

		// Admin JS
		wp_register_script('linkt-admin-script', esc_url(LINKT_PLUGIN_URL . 'dist/admin' . $suffix . '.js'), array(), LINKT_PLUGIN_VERSION, true);
		wp_localize_script('linkt-admin-script', 'linktObj', array(
			'apiUrl' => esc_url( get_rest_url() ),
			'pluginUrl' => esc_url(LINKT_PLUGIN_URL),
			'nonce' => wp_create_nonce('wp_rest'),
			// 'wcActive' => Linkt_Admin::linkt_is_plugin_active('woocommerce.php'),
		));
		wp_enqueue_script('linkt-admin-script');

		wp_set_script_translations('linkt-admin-script', 'linkt', LINKT_PLUGIN_DIR . 'lang');

		// Links Admin Settings Page
		if ('linkt-settings' == $adminPage) {
			wp_enqueue_style('linkt-admin-settings-style');
			
			wp_enqueue_script('linkt-admin-settings-script');
			wp_localize_script('linkt-admin-settings-script', 'linktSetObj', array(
				'apiUrl' => esc_url(get_rest_url()),
				'nonce' => wp_create_nonce('wp_rest'),
				'isPremium' => $isPremium,
				'accountUrl' => false,
				'upgradeUrl' => false,
				// 'wcActive' => Linkt_Admin::linkt_is_plugin_active('woocommerce.php'),
				// 'pluginUrl' => esc_url(LINKT_PLUGIN_URL),
				'linktDefaults' => json_decode($linktDefaults),
				'adminUrl' => esc_url(admin_url()),
			));
			// wp_enqueue_media();
		}

		// Dashboard Widget
		if ('index.php' === $adminPage) {
			wp_enqueue_style('linkt-dashboard-style');
			wp_enqueue_script('linkt-dashboard-script');
			wp_localize_script('linkt-dashboard-script', 'linktDashObj', array(
				'apiUrl' => esc_url(get_rest_url()),
				'adminUrl' => esc_url(admin_url()),
				'nonce' => wp_create_nonce('wp_rest'),
				'linktOptions' => $linktOptions->settings,
			));
		}

		// Admin Linkt Post Type List
		if ('linkt' === get_post_type() && 'edit.php' === $adminPage) {
			wp_enqueue_style('linkt-admin-list-style');
			wp_enqueue_script('linkt-admin-list-script');
		}
		
		// Admin Linkt Post Type Page
		if ('linkt' === get_post_type() && ('post.php' === $adminPage || 'post-new.php' === $adminPage)) {
			$legacyOptions = array(
				'old_count' => get_post_meta(get_the_ID(), '_linkt_count', true ) ? absint(get_post_meta(get_the_ID(), '_linkt_count', true)) : 0,
			);

			wp_enqueue_media();
			wp_enqueue_style('linkt-admin-linkt-style');
			wp_enqueue_script('linkt-admin-linkt-script');
			wp_localize_script('linkt-admin-linkt-script', 'linktPostObj', array(
				'apiUrl' => esc_url(get_rest_url()),
				'currentPostId' => 'post-new.php' === $adminPage ? null : get_the_ID(),
				'nonce' => wp_create_nonce('wp_rest'),
				'linktOptions' => $linktOptions->settings,
				'isPremium' => $isPremium,
				'legacyOptions' => $legacyOptions,
			));
		}
		
		// var_dump('--------------------------------------------- ' . $adminPage);
		
		// Update the language file with this line in the terminal - "wp i18n make-pot ./ lang/linkt.pot"
		wp_set_script_translations('linkt-admin-settings-script', 'linkt', LINKT_PLUGIN_DIR . 'lang');
		wp_set_script_translations('linkt-dashboard-script', 'linkt', LINKT_PLUGIN_DIR . 'lang');
	} // End linkt_admin_scripts ()

	/**
	 * Load Block Editor Scripts & Styles
	 */
	public function linkt_block_editor_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';
		// $linktSavedOptions = get_option('linkt_options');
		// $linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';
		
		wp_register_style('linkt-admin-editor-style', esc_url(LINKT_PLUGIN_URL . 'dist/editor' . $suffix . '.css'), array('linkt-fontawesome'), LINKT_PLUGIN_VERSION);
		wp_enqueue_style('linkt-admin-editor-style');

		// wp_register_script('linkt-admin-editor-script', esc_url(LINKT_PLUGIN_URL . 'dist/editor' . $suffix . '.js'), array('wp-edit-post'), LINKT_PLUGIN_VERSION, true);
		// wp_localize_script('linkt-admin-editor-script', 'linktEditorObj', array(
		// 	'linktOptions' => $linktOptions,
		// ));
		// wp_enqueue_script('linkt-admin-editor-script');
	} // End linkt_block_editor_scripts ()

	/**
	 * Load plugin localisation
	 *
	 * @access  public
	 * @return  void
	 * @since   1.0.0
	 */
	public function linkt_load_localisation() {
		load_plugin_textdomain('linkt', false, LINKT_PLUGIN_DIR . 'languages/');
	} // End linkt_load_localisation ()

	/**
	 * Load plugin textdomain
	 *
	 * @access  public
	 * @return  void
	 * @since   1.0.0
	 */
	public function linkt_load_plugin_textdomain() {
		$domain = 'linkt';
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain($domain, LINKT_PLUGIN_DIR . 'lang/' . $domain . '-' . $locale . '.mo');
		load_plugin_textdomain($domain, false, LINKT_PLUGIN_DIR . 'lang/');
	} // End linkt_load_plugin_textdomain ()

	/**
	 * Main Linkt Instance
	 * Ensures only one instance of Linkt is loaded or can be loaded.
	 */
	public static function instance( $file = '', $version = LINKT_PLUGIN_VERSION) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $file, $version );
		}

		return self::$_instance;
	} // End instance ()

	public static function linktDefaults() {
		$old_track_loggedin = get_option( 'wpt_linkt_setting_track_admin' ) && get_option( 'wpt_linkt_setting_track_admin' ) == 'on' ? true : false;
		$old_ext = get_option( 'wpt_linkt_setting_url_ext', 'go' );

		$initialSettings = array(
			"settings" => array(
				"chart_display" => "7_days",
				"dash_display" => "single",
				"url_ext" => $old_ext,
				"chart_enabled" => true,
				"chart_order_by" => "title",
				"chart_order" => "asc",
				"track_loggedin" => $old_track_loggedin,
			),
			"blocks" => array( // For adding a new block, update this AND ../src/backend/helpers.js AND class-notices.php newblocks number
				"disclosure" => true, // 2
				"button" => true, // 1
			),
		);
		return $initialSettings;
	}

	/**
	 * Update/Save the plugin version, defaults and settings if none exist | Run on 'plugins_loaded' hook
	 */
	public function linkt_update_plugin_defaults() {
		$defaultOptions = (object)$this->linktDefaults();
		$objDefaultOptions = json_encode($defaultOptions);

		// Saved current Plugin Version if no version is saved
		if (!get_option('linkt_plugin_version') || (get_option('linkt_plugin_version') != LINKT_PLUGIN_VERSION)) {
			update_option('linkt_plugin_version', LINKT_PLUGIN_VERSION);
		}
		// Fix/Update Defaults if no defaults are saved or if defaults are different to previous version defaults
		if (!get_option('linkt_default_options') || (get_option('linkt_default_options') != $defaultOptions)) {
			update_option('linkt_default_options', $objDefaultOptions);
		}
		// Save new Plugin Settings from defaults if no settings are saved
		if (!get_option('linkt_options')) {
			update_option('linkt_options', $objDefaultOptions);
		}
	}

	/**
	 * Installation. Runs on activation.
	 */
	public function install() {
		$this->_update_default_settings();
		$this->_log_version_number();

		$this->linkt_create_custom_table();
	}

	/**
	 * Create custom database table for tracking visits.
	 */
	private function linkt_create_custom_table() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'linkt_track_visits';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			post_id BIGINT(20) UNSIGNED NOT NULL,
			visit_time DATETIME NOT NULL,
			query_string VARCHAR(255) DEFAULT NULL,
			from_page VARCHAR(255) DEFAULT NULL,
			tag_id BIGINT(20) UNSIGNED DEFAULT NULL,
			INDEX idx_post_id (post_id),
			INDEX idx_visit_time (visit_time)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	/**
	 * Save Initial Default Settings.
	 */
	private function _update_default_settings() { //phpcs:ignore
		$defaultOptions = (object)$this->linktDefaults();
		
		update_option('linkt_options', json_encode($defaultOptions));
		update_option('linkt_default_options', json_encode($defaultOptions));
	}
	/**
	 * Log the plugin version number.
	 */
	private function _log_version_number() { //phpcs:ignore
		update_option('linkt_plugin_version', LINKT_PLUGIN_VERSION);
	}
}
