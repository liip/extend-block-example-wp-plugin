<?php
/**
 * Plugin Name: Extend Block Example
 * Description: Example how to extend an existing Gutenberg block.
 * Author: Team Jazz, Liip AG
 * Author URI: https://liip.ch
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: extend-block-example
 * Domain Path: /languages/
 *
 * @package extend-block-example
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'enqueue_block_editor_assets', 'extend_block_example_enqueue_block_editor_assets' );

function extend_block_example_enqueue_block_editor_assets() {
    // Enqueue our script
    wp_enqueue_script(
        'extend-block-example-js',
        esc_url( plugins_url( '/dist/extend-block-example.js', __FILE__ ) ),
        array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
        '1.0.0',
        true // Enqueue the script in the footer.
    );
}
