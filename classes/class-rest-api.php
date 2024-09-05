<?php
/*
 * Create Custom Rest API Endpoints
 */
class Linkt_API_Rest_Routes {
	public function __construct() {
		add_action('rest_api_init', [$this, 'linkt_create_rest_routes']);
	}

	/*
	 * Create REST API routes for get & save
	 */
	public function linkt_create_rest_routes() {
		register_rest_route('linkt-api/v1', '/settings', [
			'methods' => 'GET',
			'callback' => [$this, 'linkt_get_settings'],
			'permission_callback' => [$this, 'linkt_get_settings_permission'],
		]);
		register_rest_route('linkt-api/v1', '/get-linkts/(?P<id>\d+)', [
			'methods' => 'GET',
			'callback' => [$this, 'linkt_get_all_linkts'],
			'permission_callback' => [$this, 'linkt_get_settings_permission'],
		]);
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
							$extra_tags = json_decode($obj['linkt_tags'], true);
							$tag_names = array_column($extra_tags, 'name'); // Extract 'name' values from tags array

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
							$placeholders = implode(',', array_fill(0, count($tag_names), '%s')); // Prepare placeholder string for query

							$query = $wpdb->prepare(
								"SELECT COUNT(*) FROM $table_name WHERE post_id = %d AND (tag_id IN ($placeholders) OR tag_id IS NULL) AND visit_time >= %s",
								array_merge([$post_id], $tag_names, [$date_threshold])
							);
							$total_clicks = $wpdb->get_var($query);

							return $total_clicks;
						}
						
						return 0;
					}
				},
				'schema' => null,
			)
		);
	}

	/*
	 * Get saved options from database
	 */
	public function linkt_get_settings() {
		$linktPluginOptions = get_option('linkt_options');

		if (!$linktPluginOptions)
			return;

		return rest_ensure_response($linktPluginOptions);
	}

	/*
	 * Get stats from Linkt database
	 */
	public function linkt_get_all_linkts($request) {
		global $wpdb;
	
		// Sanitize and validate the post ID parameter
		$post_id = absint($request->get_param('id'));
		$period = sanitize_text_field($request->get_param('period'));
		$tag = sanitize_text_field($request->get_param('tag'));
	
		// Check if post_id is valid
		if (empty($post_id) || $post_id <= 0) {
			return new WP_Error('invalid_post_id', 'Invalid post ID', array('status' => 400));
		}
	
		// Define the table name
		$table_name = $wpdb->prefix . 'linkt_track_visits';
	
		// Determine the date range based on the period parameter
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
	
		// Get the current date and time, and calculate the start date
		$current_time = current_time('mysql');
		$start_date = date('Y-m-d H:i:s', strtotime($interval, strtotime($current_time)));
	
		// Adjust the query for the "total" case
		if ($tag === 'total') {
			$query = $wpdb->prepare(
				"SELECT *, COALESCE(tag_id, 'default') as tag_id FROM $table_name WHERE post_id = %d AND visit_time >= %s",
				$post_id, 
				$start_date
			);
		} elseif (!empty($tag) && $tag !== 'undefined' && $tag !== 'all') {
			$query = $wpdb->prepare(
				"SELECT * FROM $table_name WHERE post_id = %d AND visit_time >= %s AND COALESCE(tag_id, 'default') = %s",
				$post_id, 
				$start_date, 
				$tag
			);
		} else {
			$query = $wpdb->prepare(
				"SELECT *, COALESCE(tag_id, 'default') as tag_id FROM $table_name WHERE post_id = %d AND visit_time >= %s",
				$post_id, 
				$start_date
			);
		}
	
		// Execute the query and get the results
		$post_data = $wpdb->get_results($query);
	
		// Check if any data was found
		if (empty($post_data)) {
			// Return an empty array instead of an error
			return rest_ensure_response([]);
		}
	
		// Return the data as a REST response
		return rest_ensure_response($post_data);
	}

	/*
	 * Delete tag & all database entries
	 */
	public function linkt_delete_tag_entries(WP_REST_Request $request) {
		global $wpdb;
		$post_id = absint($request->get_param('post_id'));
		$tag_id = sanitize_text_field($request->get_param('tag_id'));
		
		if (empty($post_id) || empty($tag_id)) {
			return new WP_Error('invalid_parameters', 'Invalid parameters', array('status' => 400));
		}
		
		$table_name = $wpdb->prefix . 'linkt_track_visits';
		
		// Check for the existence of the tag_id
		$existing_entries = $wpdb->get_var($wpdb->prepare(
			"SELECT COUNT(*) FROM $table_name WHERE post_id = %d AND tag_id = %s",
			$post_id,
			$tag_id
		));
		
		// If tag_id exists, delete entries
		if ($existing_entries > 0) {
			$delete_result = $wpdb->delete($table_name, array('post_id' => $post_id, 'tag_id' => $tag_id), array('%d', '%s'));
			
			if ($delete_result === false) {
				error_log('Error deleting entries');
				return new WP_Error('db_error', 'Error deleting entries', array('status' => 500));
			}
			
			return rest_ensure_response(array('deleted' => $delete_result));
		} else {
			return rest_ensure_response(array('deleted' => 0));
		}
	}	

	/*
	 * Allow permissions for get options
	 */
	public function linkt_get_settings_permission() {
		return true;
	}

	/*
	 * Save settings as JSON string
	 */
	public function linkt_save_settings() {
		$req = file_get_contents('php://input');
		$reqData = json_decode($req, true);

		$oldSlug = json_decode(get_option('linkt_options'))->settings->url_ext;
		$newSlug = json_decode($reqData['linktOptions'])->settings->url_ext;

		update_option('linkt_options', $reqData['linktOptions']);

		$resp = 'Success';
		if ($oldSlug != $newSlug) {
			$resp = 'Successful';
		}

		return rest_ensure_response($resp);
	}

	/*
	 * Set save permissions for admin users
	 */
	public function linkt_save_settings_permission() {
		return current_user_can('publish_posts') ? true : false;
	}

	/*
	 * Delete the plugin settings
	 */
	public function linkt_delete_settings() {
		delete_option('linkt_options');

		return rest_ensure_response('Success!');
	}

	/*
	 * Delete the post click data
	 */
	public function linkt_remove_click_data($request) {
		$post_id = esc_attr($request->get_param( 'id' ));
		global $wpdb;

		$meta_key_pattern = 'linkt_click_data_%';

		// Delete post meta matching the pattern for the specified post ID
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM $wpdb->postmeta 
				WHERE post_id = %d AND meta_key LIKE %s
				", 
				$post_id,
				$meta_key_pattern 
			) 
		);

		update_post_meta($post_id, 'linkt_total_clicks', 0);

		return rest_ensure_response('Data Deleted!');
	}
}
new Linkt_API_Rest_Routes();
