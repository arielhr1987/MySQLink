<?php
    /**
     *
     */

    /*Constants*/
    define('ROOT', dirname(__FILE__));
    define('DS', DIRECTORY_SEPARATOR);

    //Folder constants
    define('CONFIG_PATH',        ROOT . DS . 'config');
    define('CONTROLLERS_PATH',   ROOT . DS . 'controllers');
    define('CORE_PATH',          ROOT . DS . 'core');
    define('DATABASE_PATH',      ROOT . DS . 'db');
    define('HELPERS_PATH',       ROOT . DS . 'helpers');
    define('LIBRARIES_PATH',     ROOT . DS . 'libraries');
    define('VIEWS_PATH',         ROOT . DS . 'views');



    /*Require necessary files.*/
    require_once(CORE_PATH . DS . 'Core.php');
    require_once(CORE_PATH . DS . 'Loader.php');
    require_once(CORE_PATH . DS . 'Controller.php');
    require_once(CONFIG_PATH . DS . 'constants.php');

    try {
        $load = Loader::singleton();
        $load->library('Config');
        $load->Config->load(array('routes','config'));
        $load->library('Request');
        Core::dispatch($load->Request);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
