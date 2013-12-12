<?php
    /**
     *
     */

    class Request
    {

        private $URI;

        private $controller;

        private $method;

        private $args;

        public function __construct()
        {
            $uri = $_SERVER['REQUEST_URI'];
            if (strpos($uri, $_SERVER['SCRIPT_NAME']) === 0) {
                $uri = substr($uri, strlen($_SERVER['SCRIPT_NAME']));
            } elseif (strpos($uri, dirname($_SERVER['SCRIPT_NAME'])) === 0) {
                $uri = substr($uri, strlen(dirname($_SERVER['SCRIPT_NAME'])));
            }
            //Clean QUERY_STRING from url
            $uri = str_replace('?' . $_SERVER['QUERY_STRING'], '', $uri);
            if ($uri == '' || $uri == '/') $uri = 'welcome';
            $this->URI = $this->parse_URI($uri);
            $this->generate();
        }

        public function parse_URI($uri)
        {
            //Routes config
            $routes = Loader::singleton()->Config->config['routes'];
            $parts  = explode('/', $uri);
            $parts  = array_filter($parts);
            foreach ($routes as $key => $val) {
                // Convert wild-cards to RegEx
                $key = str_replace(':any', '.+', str_replace(':num', '[0-9]+', $key));
                // Does the RegEx match?
                if (preg_match('#^' . $key . '$#', $uri)) {
                    // Do we have a back-reference?
                    if (strpos($val, '$') !== FALSE AND strpos($key, '(') !== FALSE) {
                        $val = preg_replace('#^' . $key . '$#', $val, $parts);
                    }
                    return $val;
                }
            }
            return $uri;
        }

        public function generate()
        {
            $parts            = explode('/', $this->URI);
            $parts            = array_filter($parts);
            $this->controller = ($c = array_shift($parts)) ? $c : 'index';
            $this->method     = ($c = array_shift($parts)) ? $c : 'index';
            $this->args       = (isset($parts[0])) ? $parts : array();
        }

        public function get_controller()
        {
            return $this->controller . 'Controller';
        }

        public function get_method()
        {
            return $this->method;
        }

        public function get_args()
        {
            return $this->args;
        }

        private function fetch_from_array(&$array, $index = '')
        {
            if (!isset($array[$index])) {
                return FALSE;
            }
            return $array[$index];
        }

        public function post($index = '')
        {
            return $this->fetch_from_array($_POST, $index);
        }

        public function get($index = '')
        {
            return $this->fetch_from_array($_GET, $index);
        }

        public function cookie($index = '')
        {
            return $this->fetch_from_array($_COOKIE, $index);
        }

        public function server($index = '')
        {
            return $this->fetch_from_array($_SERVER, $index);
        }

        public function is_ajax()
        {
            return ($this->server('HTTP_X_REQUESTED_WITH') === 'XMLHttpRequest');
        }

        public function is_post(){
            return $this->is('POST');
        }

        public function is_get(){
            return $this->is('GET');
        }

        public function is($method = null){
            if($method == null)
                return $_SERVER['REQUEST_METHOD'];
            return ($_SERVER['REQUEST_METHOD'] === strtoupper($method));
        }
    }