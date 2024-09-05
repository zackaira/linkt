<?php
/**
 * Plugin Name: Linkt
 * Version: 1.1.0
 * Plugin URI: https://zackaira.com/wordpress-plugins/linkt/
 * Description: Simplify link management and tracking with Linkt, the ultimate WordPress plugin for tracking, categorizing, and analyzing your website URLs.
 * Author: Kaira
 * Author URI: https://zackaira.com/
 * Requires at least: 5.0
 * Tested up to: 6.6
 * Text Domain: linkt
 * Domain Path: /lang/
 *
 * @package linkt
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'LINKT_PLUGIN_VERSION' ) ) {
	define('LINKT_PLUGIN_VERSION', '1.1.0');
}
if ( !defined( 'LINKT_PLUGIN_URL' ) ) {
	define('LINKT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}
if ( !defined( 'LINKT_PLUGIN_DIR' ) ) {
	define('LINKT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'LINKT_PLUGIN_API_URL' ) ) {
	define( 'LINKT_PLUGIN_API_URL', 'https://zackaira.com/wp-json/lsq/v1' );
}

require_once 'classes/class-scripts.php';
require_once 'classes/class-rest-api.php';
require_once 'classes/class-admin.php';
require_once 'classes/class-notices.php';
require_once 'classes/class-frontend.php';
require_once 'classes/class-plugin-updater.php';
require_once 'classes/class-plugin-updater-page.php';

/**
 * Main instance of Linkt_Admin to prevent the need to use globals
 *
 * @since  1.0.0
 * @return object Linkt_Admin
 */
function linkt() {
	$instance = Linkt::instance( __FILE__, LINKT_PLUGIN_VERSION );
	return $instance;
}
linkt();

/**
 * Instanciate the Lemon Squeezy updater class.
 */
if ( class_exists( 'LinktLemSqPluginUpdater' ) ) {
    new LinktLemSqPluginUpdater(
        plugin_basename( __FILE__ ),
        plugin_basename( __DIR__ ),
        LINKT_PLUGIN_VERSION,
        LINKT_PLUGIN_API_URL
    );
}
