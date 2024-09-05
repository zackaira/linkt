<?php
/*
 * Create Custom Rest API Endpoints
 */
class MapMyDistance_Rest_Routes {
	public function __construct() {
		add_action('rest_api_init', [$this, 'mmd_create_rest_routes']);
	}

	/*
	 * Create REST API routes for get & save
	 */
	public function mmd_create_rest_routes() {
		// Plugin Settings
		register_rest_route('mmd-api/v1', '/settings', [
			'methods' => 'GET',
			'callback' => [$this, 'mmd_get_settings'],
			'permission_callback' => [$this, 'mmd_get_settings_permission'],
		]);
		register_rest_route('mmd-api/v1', '/settings', [
			'methods' => 'POST',
			'callback' => [$this, 'mmd_save_settings'],
			'permission_callback' => [$this, 'mmd_save_settings_permission'],
		]);
		register_rest_route('mmd-api/v1', '/delete', [
			'methods' => 'DELETE',
			'callback' => [$this, 'mmd_delete_settings'],
			'permission_callback' => [$this, 'mmd_save_settings_permission'],
		]);
		// Routes
		register_rest_route('mmd-api/v1', '/save-route', [
			'methods' => 'POST',
			'callback' => [$this, 'mmd_save_route'],
			'permission_callback' => [$this, 'mmd_save_route_permission'],
		]);
		register_rest_route('mmd-api/v1', '/get-route/(?P<id>\d+)', [
			'methods' => 'GET',
			'callback' => [$this, 'mmd_get_route'],
			'permission_callback' => [$this, 'mmd_get_settings_permission'],
		]);
<<<<<<< HEAD
		register_rest_route('linkt-api/v1', '/delete-tags', array(
			'methods' => 'POST',
			'callback' => [$this, 'linkt_delete_tag_entries'],
			'permission_callback' => [$this, 'linkt_get_settings_permission'],
		));
		register_rest_route('linkt-api/v1', '/settings', [
			'methods' => 'POST',
			'callback' => [$this, 'linkt_save_settings'],
			'permission_callback' => [$this, 'linkt_save_settings_permission'],
		]);
		register_rest_route('linkt-api/v1', '/delete', [
			'methods' => 'DELETE',
			'callback' => [$this, 'linkt_delete_settings'],
			'permission_callback' => [$this, 'linkt_save_settings_permission'],
		]);
		register_rest_route( 'linkt-api/v1', '/remove-data/(?P<id>\d+)', [
			'methods' => 'DELETE',
			'callback' => [$this, 'linkt_remove_click_data'],
			'permission_callback' => [$this, 'linkt_save_settings_permission'],
		]);

		/*
		 * Add meta data to Linkt PostData
		 */
		// register_rest_field(
		// 	'linkt',
		// 	'visits',
		// 	array(
		// 		'get_callback' => function ( $obj ) {
		// 			$post_id = $obj['id'];
		
		// 			if ($obj['type'] == 'linkt') {
		// 				global $wpdb;
		// 				$table_name = $wpdb->prefix . 'linkt_track_visits';
		// 				$total_visits_count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE post_id = %d", $post_id));

		// 				return $total_visits_count;
		// 			}
		// 			return null;
		// 		},
		// 		'schema' => null,
		// 	)
		// );
		register_rest_field(
			'linkt',
			'redirect_url',
			array(
				'get_callback' => function ( $obj ) {
					$post_id = $obj['id'];
					if ($obj['type'] == 'linkt') {
						return get_post_meta($post_id, '_linkt_redirect', true) ?: null;
					}
				},
				'schema' => null,
			)
		);
		register_rest_field(
			'linkt',
			'linkt_tags',
			array(
				'get_callback' => function ( $obj ) {
					$post_id = $obj['id'];
		
					if ($obj['type'] == 'linkt') {
						$linkt_tags = get_post_meta($post_id, '_linkt_url_params', true);
						if ($linkt_tags) {
							return json_decode($linkt_tags);
						}
					}
					return null;
				},
				'schema' => null,
			)
		);
		register_rest_field(
			'linkt',
			'total_clicks',
			array(
				'get_callback' => function ( $obj ) {
					$post_id = $obj['id'];
					if ($obj['type'] == 'linkt') {
						$linktSavedOptions = get_option('linkt_options');
						$linktOptions = $linktSavedOptions ? json_decode($linktSavedOptions) : '';

						if ($linktOptions && $linktOptions->settings->chart_display) {
							global $wpdb;
							$table_name = $wpdb->prefix . 'linkt_track_visits';

							// Safely decode JSON and handle potential errors
							$extra_tags = json_decode($obj['linkt_tags'], true);
							$tag_names = [];
							if (is_array($extra_tags)) {
								$tag_names = array_column($extra_tags, 'name');
							}

							$period = $linktOptions->settings->chart_display ?? '7_days';
							switch ($period) {
								case '7_days':
									$interval = '-7 days';
									break;
								case '14_days':
									$interval = '-14 days';
									break;
								case '30_days':
									$interval = '-30 days';
									break;
								case '3_months':
									$interval = '-3 months';
									break;
								case '6_months':
									$interval = '-6 months';
									break;
								case '12_months':
								case '':
									$interval = '-12 months';
									break;
								default:
									return new WP_Error('invalid_period', 'Invalid period specified', array('status' => 400));
							}

							$date_threshold = date('Y-m-d H:i:s', strtotime($interval));

							// Only prepare placeholders if there are tag names
							if (!empty($tag_names)) {
								$placeholders = implode(',', array_fill(0, count($tag_names), '%s'));
								$query = $wpdb->prepare(
									"SELECT COUNT(*) FROM $table_name WHERE post_id = %d AND (tag_id IN ($placeholders) OR tag_id IS NULL) AND visit_time >= %s",
									array_merge([$post_id], $tag_names, [$date_threshold])
								);
							} else {
								$query = $wpdb->prepare(
									"SELECT COUNT(*) FROM $table_name WHERE post_id = %d AND visit_time >= %s",
									$post_id, $date_threshold
								);
							}
							
							$total_clicks = $wpdb->get_var($query);

							return $total_clicks;
						}
						
						return 0;
					}
				},
				'schema' => null,
			)
		);
=======
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	}

	/*
	 * Get saved options from database
	 */
	public function mmd_get_settings() {
		$mmdPluginOptions = get_option('mmd_options');

		if (!$mmdPluginOptions)
			return;

		return rest_ensure_response($mmdPluginOptions);
	}

	/*
	 * Allow permissions for get options
	 */
	public function mmd_get_settings_permission() {
		return true;
	}

	/*
	 * Set save permissions for Admin users
	 */
	public function mmd_save_settings_permission() {
		return current_user_can('publish_posts') ? true : false;
	}

	/*
	 * Set save permissions for Customers & Subscriber users
	 */
	public function mmd_save_route_permission() {
		return is_user_logged_in() && current_user_can('read') ? true : false;
	}

	/*
	 * Save settings as JSON string
	 */
	public function mmd_save_settings() {
		$req = file_get_contents('php://input');
		$reqData = json_decode($req, true);

		update_option('mmd_options', $reqData['mmdOptions']);

		return rest_ensure_response($resp);
	}

	/*
	 * Delete the plugin settings
	 */
	public function mmd_delete_settings() {
		delete_option('mmd_options');

		return rest_ensure_response('Success!');
	}

	/*
	 * SAVE User Route
	 */
	public function mmd_save_route($request) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'mmd_map_routes';
	
		$params = $request->get_params();
	
		$user_id = get_current_user_id();
		$route_name = sanitize_text_field($params['routeName']);
		$route_description = sanitize_textarea_field($params['description']);
		$route_tags = sanitize_text_field(implode(',', $params['tags']));
		$route_activity = sanitize_text_field($params['activity']);
		$route_data = json_encode($params['routeData']);
		$distance = floatval($params['distance']);
	
		$result = $wpdb->insert(
			$table_name,
			[
				'user_id' => $user_id,
				'route_name' => $route_name,
				'route_description' => $route_description,
				'route_tags' => $route_tags,
				'route_activity' => $route_activity,
				'route_data' => $route_data,
				'created_at' => current_time('mysql'),
				'distance' => $distance,
			],
			[
				'%d', '%s', '%s', '%s', '%s', '%s', '%s', '%f'
			]
		);
	
		if ($result === false) {
			return new WP_Error('route_save_failed', 'Failed to save the route', ['status' => 500]);
		}
	
		return rest_ensure_response([
			'success' => true,
			'message' => 'Route saved successfully',
			'route_id' => $wpdb->insert_id
		]);
	}

	/*
	 * GET User Route
	 */
	public function mmd_get_route($request) {
		$route_id = $request['id'];
		
		global $wpdb;
		$table_name = $wpdb->prefix . 'mmd_map_routes';
		
		$route = $wpdb->get_row($wpdb->prepare(
			"SELECT * FROM $table_name WHERE id = %d",
			$route_id
		), ARRAY_A);
	
		if (null === $route) {
			return new WP_Error('no_route', 'Route not found', array('status' => 404));
		}
	
		// Decode the JSON stored in route_data
		$route['route_data'] = json_decode($route['route_data'], true);
	
		return rest_ensure_response($route);
	}
}
new MapMyDistance_Rest_Routes();
