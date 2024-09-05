<?php
/**
 * Plugin Name: Button Block
 * Plugin URI: https://github.com/WordPress/linkt
 * Description: A Button Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package linkt
 */
defined( 'ABSPATH' ) || exit;

/**
 * Register Block Assets
 */
function linkt_button_register_block() {
	// Register the block by passing the location of block.json.
	register_block_type( __DIR__ );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'linkt-button-editor-script', 'linkt', LINKT_PLUGIN_DIR . 'lang' );
	}

}
add_action( 'init', 'linkt_button_register_block' );
