<?php
/**
 * Frontend functions.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Frontend class.
 */
class MapMyDistance_Frontend {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		// $mmdSavedOptions = get_option('mmd_options');
		// $mmdOptions = $mmdSavedOptions ? json_decode($mmdSavedOptions) : '';

<<<<<<< HEAD
		// add_action('wp_head', array( $this, 'linkt_output_og_tags' ), 5);

		// add_filter('body_class', array( $this, 'linkt_frontend_body_classes' ));
=======
		// add_filter('body_class', array( $this, 'mmd_frontend_body_classes' ));
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	}

	/**
	 * Output the social share OG: Tags.
	 */
<<<<<<< HEAD
	// public function linkt_output_og_tags() {
	// 	if (!is_singular('linkt')) return;
	
	// 	$og_data = $this->get_linkt_og_data();
		
	// 	if (!$og_data) return;
	
	// 	foreach ($og_data as $property => $content) {
	// 		if (!empty($content)) {
	// 			echo "<meta property=\"" . esc_attr($property) . "\" content=\"" . esc_attr($content) . "\" />\n";
	// 		}
=======
	// public function mmd_frontend_body_classes($classes) {
	// 	if ( mmd_fs()->can_use_premium_code__premium_only() ) {
	// 		$classes[] = sanitize_html_class('mmd-pro');
	// 	} else {
	// 		$classes[] = sanitize_html_class('mmd-free');
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	// 	}
	// }
}
new MapMyDistance_Frontend();
