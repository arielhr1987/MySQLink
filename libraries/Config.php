<?php
    /**
     *
     */

    class Config
    {

        public $config = array();

        private $loaded = array();

        public function __construct()
        {

        }

        public function load($file= '')
        {
            if(is_string($file)){
                $file = array($file);
            }
            foreach($file as $name){
                $file_path = CONFIG_PATH . DS . $name . '.php';
                if (!in_array($file_path, $this->loaded, true)) {
                    if (file_exists($file_path)) {
                        include $file_path;
                        if (!isset($config) OR !is_array($config)) {
                            throw new Exception("The configuration file $name does not appear to be valid.");
                        }
                        if (isset($this->config[$name])) {
                            $this->config[$name] = array_merge($this->config[$name], $config);
                        } else {
                            $this->config[$name] = $config;
                        }
                        $this->loaded[] = $file_path;
                        unset($config);
                    } else {
                        throw new Exception("The file $name was not found.");
                    }
                }
            }
            return true;
        }

    }