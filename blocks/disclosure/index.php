<?php
/**
 * Plugin Name: Disclosure Block
 * Plugin URI: https://github.com/WordPress/linkt
 * Description: An Affiliate Disclosure Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package linkt
 */
defined( 'ABSPATH' ) || exit;

/**
 * Register Block Assets
 */
function linkt_disclosure_register_block() {
	register_block_type( __DIR__ );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'linkt-disclosure-editor-script', 'linkt', LINKT_PLUGIN_DIR . 'lang' );
	}

}
add_action( 'init', 'linkt_disclosure_register_block' );
