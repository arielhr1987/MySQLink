<?php
    /**
     *
     */

    if (!function_exists('script')) {
        function script($name, $type = 'text/javascript')
        {
            $src = Core::base_url() . RESOURCES . '/js/' . $name . '.js';
            echo '<script type="' . $type . '" src="' . $src . '" ></script>';
        }
    }

    if (!function_exists('link_tag')) {
        function link_tag($name, $type = 'text/css')
        {
            $src = Core::base_url() . RESOURCES . '/css/' . $name . '.css';
            echo '<link rel="stylesheet" type="' . $type . '" href="' . $src . '"/>';
        }
    }

    if (!function_exists('extjs')) {
        function extjs()
        {
            link_tag('ext/ext-theme-classic/ext-theme-classic-all');
//            link_tag('ext/ext-theme-neptune/ext-theme-neptune-all');
            script('ext/ext-all');
//            script('ext/ext-all-debug-w-comments');
        }
    }



