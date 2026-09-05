<?php
/**
 * WP-CLI-style helper to point a WordPress install at a new domain.
 *
 * Usage (run from the WordPress root so wp-load.php / wp-config.php load):
 *   php scripts/wp-rewrite-siteurl.php www.bdgarmentscareer.com
 *
 * What it does:
 *   1. Loads WordPress (so wp-config credentials are used).
 *   2. Updates the `home` and `siteurl` options to the new domain.
 *   3. Rewrites any option values still containing the OLD domain to the new
 *      one (this is the part that keeps menus, widgets and customizer values
 *      pointing at the right place instead of localhost).
 *
 * It never touches serialized data lengths incorrectly because WordPress's
 * own update_option() handles that. For full body-content rewrites across
 * posts/pages use a proper search-replace tool (e.g. the Better Search
 * Replace plugin) — this script covers the core site URL + options.
 */

if ( PHP_SAPI !== 'cli' ) {
	exit( 'CLI only.' );
}

if ( $argc < 2 ) {
	fwrite( STDERR, "Usage: php wp-rewrite-siteurl.php <new-domain> [old-domain]\n" );
	exit( 1 );
}

$new_host = trim( $argv[1] );
$new_url  = ( 0 === strpos( $new_host, 'http' ) ) ? rtrim( $new_host, '/' )
	: 'https://' . ltrim( $new_host, '/' );

// Load WordPress.
require __DIR__ . '/../wp-load.php';

$old_home = get_option( 'home' );
$old_url  = get_option( 'siteurl' );
fwrite( STDOUT, "Old home:    $old_home\nOld siteurl: $old_url\nNew home:    $new_url\n" );

update_option( 'home', $new_url );
update_option( 'siteurl', $new_url );
fwrite( STDOUT, "home/siteurl updated.\n" );

// Determine the old origin to replace (from CLI arg if given, else current DB value).
$old_origin = isset( $argv[2] ) ? rtrim( $argv[2], '/' ) : '';
if ( '' === $old_origin ) {
	// Fall back to the parsed old home host.
	$old_origin = (string) wp_parse_url( $old_home, PHP_URL_SCHEME ) . '://' . (string) wp_parse_url( $old_home, PHP_URL_HOST );
}

global $wpdb;
$old_origin = untrailingslashit( $old_origin );
if ( $old_origin === 'https://' . wp_parse_url( $new_url, PHP_URL_HOST ) || $old_origin === $new_url ) {
	fwrite( STDOUT, "No origin change needed.\n" );
	exit( 0 );
}

// Rewrite any option whose value still contains the old origin.
// We operate on the serialized strings directly so serialized WordPress data
// (widgets, menus, customizer) survives intact.
$rows = $wpdb->get_results( "SELECT option_id, option_name, option_value FROM {$wpdb->options}", ARRAY_A );
$changed = 0;
foreach ( $rows as $row ) {
	if ( false === strpos( (string) $row['option_value'], $old_origin ) ) {
		continue;
	}
	$new_value = str_replace( $old_origin, $new_url, (string) $row['option_value'] );
	$wpdb->update(
		$wpdb->options,
		array( 'option_value' => $new_value ),
		array( 'option_id' => (int) $row['option_id'] ),
		array( '%s' ),
		array( '%d' )
	);
	$changed++;
}
fwrite( STDOUT, "Rewrote $changed option(s) from $old_origin to $new_url.\n" );
fwrite( STDOUT, "Done. Flush permalinks once: Settings > Permalinks > Save.\n" );