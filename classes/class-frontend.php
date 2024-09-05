<?php
/**
 * Frontend functions.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Frontend class.
 */
class Linkt_Frontend {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		// $linktSavedOptions = get_option('linkt_options');
		// $linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';

		// add_action('wp_head', array( $this, 'linkt_output_og_tags' ), 5);

		// add_filter('body_class', array( $this, 'linkt_frontend_body_classes' ));
	}

	/**
	 * Output the social share OG: Tags.
	 */
	// public function linkt_output_og_tags() {
	// 	if (!is_singular('linkt')) return;
	
	// 	$og_data = $this->get_linkt_og_data();
		
	// 	if (!$og_data) return;
	
	// 	foreach ($og_data as $property => $content) {
	// 		if (!empty($content)) {
	// 			echo "<meta property=\"" . esc_attr($property) . "\" content=\"" . esc_attr($content) . "\" />\n";
	// 		}
	// 	}
	// }
}
new Linkt_Frontend();
