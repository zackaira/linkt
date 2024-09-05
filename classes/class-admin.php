<?php
/**
 * Admin Settings & Setup file.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Admin class.
 */
class MapMyDistance_Admin {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		add_action('admin_menu', array( $this, 'mmd_create_admin_menu' ), 10, 1);

		add_filter('block_categories_all', array($this, 'mmd_blocks_custom_category'), 10, 2);

		add_filter('admin_body_class', array($this, 'mmd_admin_body_classes'));

		// Regsiter post type
		// add_action('init' , array( $this, 'mmd_register_post_type' ));

		// MMD Edit Screen
		// add_action('admin_menu', array( $this, 'mmd_post_type_meta_box' ));

<<<<<<< HEAD
		// Linkt List Screen
		add_filter('manage_edit-linkt_columns', array( $this, 'linkt_post_list_columns' ));
		add_action('manage_posts_custom_column', array( $this, 'linkt_post_list_columns_detail' ));
=======
		// MMD List Screen
		// add_filter('manage_edit-mmd_columns', array( $this, 'mmd_post_list_columns' ));
		// add_action('manage_posts_custom_column', array( $this, 'mmd_post_list_columns_detail' ));
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

		// add_action('save_post', array( $this, 'mmd_save_post_meta' ));

		// Add Dashboard Widget
		add_action('wp_dashboard_setup', array( $this, 'mmd_dashboard_widget' ));
	}

	/**
	 * Create an Admin Sub-Menu under WooCommerce
	 */
	public function mmd_create_admin_menu() {
		$capability = 'manage_options';
		$slug = 'mmd-settings';

		add_submenu_page(
			'edit.php?post_type=mmd',
			__('Settings', 'mmd'),
			__('Settings', 'mmd'),
			$capability,
			$slug,
			array($this, 'mmd_menu_page_template')
		);
	}

	/**
	 * Create the Page Template html for React
	 * Settings created in ../src/backend/settings/admin.js
	 */
	public function mmd_menu_page_template() {
		$allowed_html = array(
			'div' => array('class' => array(), 'id' => array()),
			'h2' => array(),
		);

		$html  = '<div class="wrap">' . "\n";
		$html .= '<h2> </h2>' . "\n";
		$html .= '<div id="mmd-root"></div>' . "\n";
		$html .= '</div>' . "\n";

		echo wp_kses($html ,$allowed_html);
	}

	/**
	 * Create MMD blocks Category
	 */
	public function mmd_blocks_custom_category($categories, $post) {
		return array_merge(
			$categories,
			array(
				array(
					"slug" => "mmd-category",
					"title" => __("MMD Blocks", "mmd"),
				)
			)
		);
	}

	/**
	 * Function to check for active plugins
	 */
	public static function mmd_is_plugin_active($plugin_name) {
		// Get Active Plugin Setting
		$active_plugins = (array) get_option('active_plugins', array());
		if (is_multisite()) {
			$active_plugins = array_merge($active_plugins, array_keys(get_site_option( 'active_sitewide_plugins', array())));
		}

		$plugin_filenames = array();
		foreach ($active_plugins as $plugin) {
			if (false !== strpos( $plugin, '/') ) {
				// normal plugin name (plugin-dir/plugin-filename.php)
				list(, $filename ) = explode( '/', $plugin);
			} else {
				// no directory, just plugin file
				$filename = $plugin;
			}
			$plugin_filenames[] = $filename;
		}
		return in_array($plugin_name, $plugin_filenames);
	}

	/**
	 * Function to check for active plugins
	 */
	public function mmd_admin_body_classes($admin_classes) {
		$lsProOptions = json_decode(get_option('mmd_license_message'));
		$isPremium = isset( $lsProOptions->data->activated ) ? (bool) $lsProOptions->data->activated : false;

		if ($isPremium) {
			$admin_classes .= ' ' . sanitize_html_class('mmd-pro');
		} else {
			$admin_classes .= ' ' . sanitize_html_class('mmd-free');
		}
		return $admin_classes;
	}

	/**
	 * Register new post type
	 * @return void
	 */
	public function mmd_register_post_type() {
		$labels = array(
			'name'               => __( 'Route', 'mmd' ),
			'singular_name'      => __( 'Route', 'mmd' ),
			'add_new'            => __( 'Add New', 'mmd' ),
			'add_new_item'       => __( 'Add New', 'mmd' ),
			'new_item'           => __( 'New Route', 'mmd' ),
			'edit_item'          => __( 'Edit Route', 'mmd' ),
			'view_item'          => __( 'View Route', 'mmd' ),
			'all_items'          => __( 'All Routes', 'mmd' ),
			'search_items'       => __( 'Search Routes', 'mmd' ),
			'parent_item_colon'  => __( 'Parent Routes:', 'mmd' ),
			'not_found'          => __( 'No Route found.', 'mmd' ),
			'not_found_in_trash' => __( 'No Route found in Trash.', 'mmd' )
		);

		$slug = apply_filters('linkt_slug_prefix', 'go');
	
		$args = array(
			'labels'             => $labels,
			'description'        => __( 'Description.', 'mmd' ),
			'public'             => true, // false
			'publicly_queryable' => true, // false
			'exclude_from_search'=> true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true, // false
			'query_var' => true,
			'can_export' => true,
			'rewrite' => array(
<<<<<<< HEAD
				'slug' => $slug,
=======
				'slug' => apply_filters( 'mmd_slug_prefix', 'go' ),
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
				'with_front' => false,
			),
			'capability_type'    => 'post',
			'has_archive'        => true, // false
			'hierarchical'       => false,
			'show_in_rest' 		 => true,
			'rest_base'			 => 'mmd',
	  		'rest_controller_class' => 'WP_REST_Posts_Controller',
			'menu_position'      => 101,
			'supports'           => array( 'title' )
		);

		// Create Categories
		register_taxonomy(
		    'routes',
		    'route',
		    array(
		        'hierarchical' => true,
		        'label' => 'Categories',
		        'query_var' => true,
		        'show_in_rest' => true,
		        'rewrite' => array( 'slug' => 'categories' )
		    )
		);

<<<<<<< HEAD
		register_post_type( 'linkt', $args );

		// Add a new rewrite rule to handle flexible base slugs
        add_rewrite_rule(
			'^' . $slug . '/([^/]+)/?$',
			'index.php?post_type=linkt&name=$matches[1]',
			'top'
		);
	}

	public function linkt_change_post_slug( $slug ) {
		$linktSavedOptions = get_option('linkt_options');
		$linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';

		return $linktOptions->settings->url_ext ?: $slug;
=======
		register_post_type( 'route', $args );
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	}

	/**
	 * Create a Dashboard Widget for MMD
	 */
	public function mmd_dashboard_widget() {
		wp_add_dashboard_widget(
			'mmd_dashboard_widget',
			__( 'MMD Something', 'mmd' ), array( $this, 'mmd_render_dashboard_widget' )
		);
	}

	/**
	 * Render the Dashboard Widget info
	 */
	public function mmd_render_dashboard_widget() {
		echo '<div id="mmd-dashboard-widget"></div>';
	}
	
	/**
	 * Create admin columns in the post type list
	 */
	// public function mmd_post_list_columns( $columns ) {
	// 	return array(
	// 		'cb'               => '<input type="checkbox" />',
	// 		'title'            => __( 'Title', 'mmd' ),
	// 		'mmd_permalink'  => __( 'Track Link', 'mmd' ),
	// 		'mmd_cats'       => __( 'Category', 'mmd' ),
	// 		'mmd_created_on' => __( 'Date', 'mmd' )
	// 	);
	// }

	/**
	 * Fill admin columns with info
	 */
	public function mmd_post_list_columns_detail( $column ) {
		global $post;
		
		switch ( $column ) {
			case 'mmd_permalink' : ?>
				<div class="mmd-list-track">
					<div class="link-meta-box-input">
						<div class="mmd-copy fa-regular fa-copy"></div>
							<input type="text" value="<?php echo esc_url( get_permalink() ); ?>" class="mmd-input" disabled />
							<span class="mmd-tooltip"><?php esc_html_e( 'Copy to Clipboard', 'mmd' ) ?></span>
						</div>
					</div>
				</div><?php
				break;
			case 'mmd_cats': ?>
				<div class="mmd-list-cats">
					<?php echo get_the_term_list($post->ID, 'mmds', '', ', ', ''); ?>
				</div><?php
				break;
			case 'mmd_created_on':
				$post_date = get_the_date( '', $post->ID );
				echo __( 'Published', 'mmd' ) . ' ' . $post_date;
				break;
		}
	}

	/**
	 * Create MMD post type meta box
	 */
<<<<<<< HEAD
	public function linkt_post_type_meta_box() {
		$lsProOptions = json_decode(get_option('linkt_license_message'));
		$isPremium = isset( $lsProOptions->data->activated ) ? (bool) $lsProOptions->data->activated : false;

		add_meta_box(
			'linkt-details',
			__( 'Redirect Link', 'linkt' ),
			array( &$this, 'linkt_render_post_type_meta_box' ),
			'linkt',
			'normal',
			'high'
		);
		if ($isPremium) :
			add_meta_box(
				'linkt-social',
				__( 'Social Meta Data', 'linkt' ),
				array( &$this, 'linkt_render_social_meta_box' ),
				'linkt',
				'side',
				'default'
			);
		endif;
	}
=======
	// public function mmd_post_type_meta_box() {
	// 	add_meta_box(
	// 		'mmd-details',
	// 		__( 'Redirect Link', 'mmd' ),
	// 		array( &$this, 'mmd_render_post_type_meta_box' ),
	// 		'mmd',
	// 		'normal',
	// 		'high'
	// 	);
	// }
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

	/**
	 * Render the post type meta box
	 */
	public function mmd_render_post_type_meta_box( $post ) {
		wp_nonce_field( basename( __FILE__ ), '_mmd_meta_box_nonce' );
    
		$field_id = '_mmd_redirect';
		$field_exists = get_post_meta( $post->ID, $field_id, true ) ? 'mmd-metabox-on' : '';
		$saved_tags = json_decode(get_post_meta( $post->ID, '_mmd_url_params', true ));

		$field_value = esc_attr( get_post_meta( $post->ID, $field_id, true ) );
		$sanitized_tags = esc_attr( $saved_tags );
		$sanitized_field_exists = sanitize_html_class( $field_exists );

<<<<<<< HEAD
		echo strtr( '<div class="linkt-metabox ' . $sanitized_field_exists . '">
						<h5 class="linkt-title"><label for="{name}">Redirect the link to:</label></h5>
						<input type="url" id="{name}" name="{name}" value="{value}" placeholder="{placeholder}" class="linkt-input" />
=======
		echo strtr( '<div class="mmd-metabox ' . $sanitized_field_exists . '">
						<h5 class="mmd-title"><label for="{name}">image, description, etc</label></h5>
						<input type="url" id="{name}" name="{name}" value="{value}" placeholder="{placeholder}" class="mmd-input" />
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
					</div>
					<input type="hidden" id="_mmd_url_params" name="_mmd_url_params" value="' . $sanitized_tags . '" class="mmd-input" />', array(
			'{label}' => __( 'Redirect the link to:', 'mmd' ),
			'{name}'  => esc_attr( $field_id ),
			'{placeholder}' => esc_url( __( 'https://enter-your-link.com/', 'mmd' ) ),
			'{value}' => $field_value,
		) ); ?>
		<div id="mmd-post-metabox"></div><?php
	}

<<<<<<< HEAD
	/**
	 * Render the post type meta box
	 */
	public function linkt_render_social_meta_box( $post ) {
		wp_nonce_field( basename( __FILE__ ), '_linkt_meta_box_nonce' );

		$title = get_post_meta( $post->ID, '_linkt_social_title', true );
		$description = get_post_meta( $post->ID, '_linkt_social_desc', true );
		$image = get_post_meta( $post->ID, '_linkt_social_image', true );
		$post_title = get_the_title( $post->ID );
    
		echo '<div id="linkt-social-metabox">
				<h5 class="linkt-social-label"><label for="_linkt_social_image">OG: ' . __("Image", "linkt") . '</label></h5>
				<div id="linkt-social-root"></div>
		 		<input type="hidden" id="_linkt_social_image" name="_linkt_social_image" value="' . esc_url($image) . '" class="linkt-input" disabled />

				<h5 class="linkt-social-label"><label for="_linkt_social_title">OG: ' . __("Title", "linkt") . '</label></h5>
		 		<input type="text" id="_linkt_social_title" name="_linkt_social_title" value="' . esc_html($title) . '" placeholder="' . esc_html($post_title) . '" class="linkt-input" />

				<h5 class="linkt-social-label"><label for="_linkt_social_desc">OG: ' . __("Description", "linkt") . '</label></h5>
				<textarea id="_linkt_social_desc" name="_linkt_social_desc" class="linkt-input" rows="4">' . esc_html($description) . '</textarea>
				<div class="linkt-desc-count"><span class="count"></span>/200 ' . __("characters", "linkt") . '</div>

				<input type="hidden" id="_linkt_social_url" name="_linkt_social_url" value="' . esc_url( get_permalink( $post->ID ) ) . '" class="linkt-input" disabled />
				<input type="hidden" id="_linkt_social_type" name="_linkt_social_type" value="article" class="linkt-input" disabled />
			</div>'; ?><?php
	}

	public function linkt_save_post_meta($post_id) {
		if ( ! isset( $_POST['_linkt_meta_box_nonce'] ) || ! wp_verify_nonce( $_POST['_linkt_meta_box_nonce'], basename( __FILE__ ) ) )
			return;
=======
	// public function mmd_save_post_meta($post_id) {
	// 	if ( ! isset( $_POST['_mmd_meta_box_nonce'] ) || ! wp_verify_nonce( $_POST['_mmd_meta_box_nonce'], basename( __FILE__ ) ) )
	// 		return;
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

	// 	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
	// 		return;

	// 	if ( defined( 'DOING_AJAX' ) && DOING_AJAX )
	// 		return;

	// 	if ( defined( 'DOING_CRON' ) && DOING_CRON )
	// 		return;
		
<<<<<<< HEAD
		if ( isset( $_POST['_linkt_redirect'] ) ) :
			update_post_meta( $post_id, '_linkt_redirect', sanitize_text_field( $_POST['_linkt_redirect'] ) );
			update_post_meta( $post_id, '_linkt_url_params', json_encode($_POST['_linkt_url_params']) );
			// Social Meta Data
			update_post_meta( $post_id, '_linkt_social_title', sanitize_text_field( $_POST['_linkt_social_title'] ) );
			update_post_meta( $post_id, '_linkt_social_desc', sanitize_text_field( $_POST['_linkt_social_desc'] ) );
			update_post_meta( $post_id, '_linkt_social_image', sanitize_text_field( $_POST['_linkt_social_image'] ) );
			update_post_meta( $post_id, '_linkt_social_url', sanitize_text_field( $_POST['_linkt_social_url'] ) );
			update_post_meta( $post_id, '_linkt_social_type', sanitize_text_field( $_POST['_linkt_social_type'] ) );
		else :
			delete_post_meta( $post_id, '_linkt_redirect' );
		endif;
	}

	public function linkt_redirect_and_track() {
		// Bot detection via user-agent
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		$bot_patterns = [
			'/googlebot/i',
			'/bingbot/i',
			'/slurp/i',
			'/yahoo/i',
			'/yandex/i',
			'/facebookexternalhit/i',
			'/duckduckbot/i',
			'/baiduspider/i',
			'/sogou/i',
			'/mj12bot/i',
			'/semrushbot/i',
			'/ahrefsbot/i',
			'/botify/i',
			'/rogerbot/i',
			'/spbot/i',
			'/applebot/i',
			'/facebot/i',
			'/ia_archiver/i',
			'/twitterbot/i',
			'/pinterestbot/i',
			'/bingpreview/i',
			'/nutch/i',
			'/teoma/i',
			'/exabot/i',
			'/dotbot/i',
			'/archive.org_bot/i',
			'/uptimerobot/i',
			'/linkdexbot/i',
			'/spider/i',
			'/crawler/i',
			'/python-requests/i',
			'/curl/i',
			'/wget/i',
			'/java/i',
			'/scrapy/i',
			'/httpclient/i'
		  ];
		foreach ($bot_patterns as $pattern) {
			if (preg_match($pattern, $user_agent)) {
				return;
			}
		}

		if (!is_admin() && !is_singular('linkt')) {
			global $wp_query;
			
			// Check if this is a potential Linkt URL
			if ($wp_query->is_404) {
				$request_uri = trim($_SERVER['REQUEST_URI'], '/');
				$uri_parts = explode('/', $request_uri);
				
				if (count($uri_parts) >= 2) {
					$potential_slug = end($uri_parts);
					$linkt = get_page_by_path($potential_slug, OBJECT, 'linkt');
					
					if ($linkt) {
						$post_id = $linkt->ID;
						// Set the global $post variable
						$GLOBALS['post'] = $linkt;
						
						// Proceed with redirection and tracking
						$this->process_linkt_redirect($post_id);
						return;
					}
				}
			}
			return;
		}
	
		$post_id = get_the_ID();
		$this->process_linkt_redirect($post_id);
	}

	private function process_linkt_redirect($post_id) {
		$linktSavedOptions = get_option('linkt_options');
		$linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';
	
		// Check if a Pro license is activated
		$lsProOptions = json_decode(get_option('linkt_license_message'));
		$isPremium = isset( $lsProOptions->data->activated ) ? (bool) $lsProOptions->data->activated : false;
	
		// Extract additional tracking information
		$query_string = isset($_SERVER['QUERY_STRING']) ? sanitize_text_field($_SERVER['QUERY_STRING']) : '';
		$from_page = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : sanitize_text_field('no referrer');
		preg_match('/(?:^|&|\?)tid=([^&]+)/', $query_string, $matches);
		$tid_value = isset($matches[1]) ? $matches[1] : null;
		$tag_id = $tid_value;
	
		// Track visit
		if ((isset($linktOptions->settings->track_loggedin) && $linktOptions->settings->track_loggedin == true) || (isset($linktOptions->settings->track_loggedin) && $linktOptions->settings->track_loggedin == false && !is_user_logged_in())) {
			$this->linkt_track_visit($post_id, $query_string, $from_page, $tag_id);
		}
	
		// Redirection
		$default_url = get_post_meta($post_id, '_linkt_redirect', true);
		$redirect_url = $default_url;
		$redirect_options = get_post_meta($post_id, '_linkt_url_params', true);
	
		$tid = isset($_GET['tid']) ? $_GET['tid'] : null;
	
		if ($tid && $redirect_options) {
			$redirect_options = stripslashes($redirect_options);
			$redirect_options = trim($redirect_options, '"');
	
			$options = json_decode($redirect_options, true);
	
			if (is_array($options)) {
				foreach ($options as $option) {
					if (isset($option['name']) && $option['name'] === $tid) {
						if (isset($option['url'])) {
							$url = trim($option['url']);
							if (filter_var($url, FILTER_VALIDATE_URL)) {
								$parsed_url = parse_url($url);
								if (isset($parsed_url['host']) && preg_match('/\.[a-zA-Z]{2,}$/', $parsed_url['host'])) {
									$redirect_url = $url;
								} else {
									$redirect_url = $default_url;
								}
							} else {
								$redirect_url = $default_url;
							}
						} else {
							$redirect_url = $default_url;
						}
						break; // Exit loop once the tid is found
					}
				}
			}
		}
	
		if (!empty($redirect_url)) {
			// Output OG tags
			if ($isPremium) {
				$this->output_minimal_html_with_og_tags($post_id, $redirect_url);
			}
	
			wp_redirect($redirect_url, 301);
			exit;
		} else {
			wp_redirect(home_url(), 302);
			exit;
		}
	}

	private function linkt_track_visit($post_id, $query_string, $from_page, $tag_id) {
		if (!session_id()) session_start();
	
		$current_time = time();
		$session_key = 'visited_' . $post_id;
		$visit_recorded = $_SESSION[$session_key] ?? 0;
	
		// Time threshold in seconds (e.g., 300 seconds = 5 minutes)
		$time_threshold = 15;
	
		if ($current_time - $visit_recorded < $time_threshold) {
			// Recent visit already recorded, do not record again
			return;
		}
	
		// Record new visit
		$_SESSION[$session_key] = $current_time;
	
		// Proceed with recording the visit data
		$this->linkt_record_visit_data($post_id, $query_string, $from_page, $tag_id);
	}

	private function linkt_record_visit_data($post_id, $query_string, $from_page, $tag_id) {
		global $wpdb;

		// Prepare visit data with current time in MySQL datetime format
		$visit_data = array(
			'post_id' => $post_id,
			'visit_time' => current_time('timestamp'),
			'query_string' => $query_string,
			'from_page' => $from_page,
			'tag_id' => $tag_id
		);
	
		$wpdb->insert($wpdb->prefix . 'linkt_track_visits', $visit_data);
	}

	private function output_minimal_html_with_og_tags($post_id, $redirect_url) {
		$og_tags = $this->get_og_tags($post_id);
	
		echo "<!DOCTYPE html><html><head>\n";
		foreach ($og_tags as $property => $content) {
			if (!empty($content)) {
				echo "<meta property=\"" . esc_attr($property) . "\" content=\"" . esc_attr($content) . "\" />\n";
			}
		}
		echo "</head><body></body></html>\n";
	}

	private function get_og_tags($post_id) {
		$og_title = get_post_meta($post_id, '_linkt_social_title', true);
		$og_description = get_post_meta($post_id, '_linkt_social_desc', true);
		$og_image = get_post_meta($post_id, '_linkt_social_image', true);
	
		if (empty($og_title)) {
			$og_title = get_the_title($post_id);
		}
		if (empty($og_description)) {
			$og_description = wp_trim_words(get_the_excerpt($post_id), 55, '...');
		}
		if (empty($og_image)) {
			$og_image = get_the_post_thumbnail_url($post_id, 'large');
		}
	
		$og_url = get_permalink($post_id);
	
		return array(
			'og:title' => $og_title,
			'og:description' => $og_description,
			'og:image' => $og_image,
			'og:url' => $og_url,
			'og:type' => 'article'
		);
	}
=======
	// 	if ( isset( $_POST['_mmd_redirect'] ) ) :
	// 		update_post_meta( $post_id, '_mmd_redirect', sanitize_text_field( $_POST['_mmd_redirect'] ) );
	// 		update_post_meta( $post_id, '_mmd_url_params', json_encode($_POST['_mmd_url_params']) );
	// 	else :
	// 		delete_post_meta( $post_id, '_mmd_redirect' );
	// 	endif;
	// }
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
}
new MapMyDistance_Admin();
