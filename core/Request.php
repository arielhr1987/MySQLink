<?php
    /**
     *
     */

    class Request{

        private $URI;

        private $Controller;

        private $Method;

        private $Args;

        public function __construct(){
            $uri = $_SERVER['REQUEST_URI'];
            if (strpos($uri, $_SERVER['SCRIPT_NAME']) === 0)
            {
                $uri = substr($uri, strlen($_SERVER['SCRIPT_NAME']));
            }
            elseif (strpos($uri, dirname($_SERVER['SCRIPT_NAME'])) === 0)
            {
                $uri = substr($uri, strlen(dirname($_SERVER['SCRIPT_NAME'])));
            }
            //Clean QUERY_STRING from url
            $uri= str_replace('?' . $_SERVER['QUERY_STRING'],'',$uri) ;
            if($uri == '' || $uri == '/')$uri = 'welcome';
            $this->URI = $this->ParseURI($uri);
            $this->Generate();
        }

        public function ParseURI($uri){
            //Routes config
            global $routes;
            $parts = explode('/',$uri);
            $parts = array_filter($parts);
            foreach ($routes as $key => $val)
            {
                // Convert wild-cards to RegEx
                $key = str_replace(':any', '.+', str_replace(':num', '[0-9]+', $key));
                // Does the RegEx match?
                if (preg_match('#^'.$key.'$#', $uri))
                {
                    // Do we have a back-reference?
                    if (strpos($val, '$') !== FALSE AND strpos($key, '(') !== FALSE)
                    {
                        $val = preg_replace('#^'.$key.'$#', $val, $parts);
                    }
                    return $val;
                }
            }
            return $uri;
        }

        public function Generate(){
            $parts = explode('/',$this->URI);
            $parts = array_filter($parts);
            $this->Controller = ($c = array_shift($parts))? $c: 'index';
            $this->Method = ($c = array_shift($parts))? $c: 'index';
            $this->Args = (isset($parts[0])) ? $parts : array();
        }

        public function get_controller(){
            return $this->Controller . 'Controller';
        }
        public function get_method(){
            return $this->Method;
        }
        public function get_args(){
            return $this->Args;
        }
    }