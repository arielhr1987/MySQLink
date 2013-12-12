<?php
    /**
     *
     */
    class Core
    {
        public static function dispatch(Request $request)
        {
            $controller = $request->get_controller();
            $method     = $request->get_method();
            $args       = $request->get_args();

            $file = CONTROLLERS_PATH . DS . $controller . '.php';

            if (is_readable($file)) {
                require_once $file;
                //Is the calss defined in the loaded file?
                if(!class_exists($controller))
                    throw new Exception('Class '.$controller.' does not exist in file '.$controller.'.php');

                $controller = new $controller;
                //Check if the function exist in the controller otherwise not found.
                if(method_exists($controller,$method) && is_callable(array($controller, $method))){

                    //Call BeforeCall method
                    //$controller->BeforeCall($request);

                    //Call the Controller method
                    if (!empty($args)) {
                        call_user_func_array(array($controller, $method), $args);
                    } else {
                        call_user_func(array($controller, $method));
                    }

                    //Call AfterCall method
                    //$controller->AfterCall($request);

                    return;
                }
                throw new Exception('404 - Method "' . $method . '" in "' . $request->get_controller() . '" is not callable or not exist');
            }
            throw new Exception('404 - ' . $request->get_controller() . ' not found');
        }

        /**
         * @return string
         */
        public static function base_url()
        {
            if (isset($_SERVER['HTTP_HOST'])) {
                $baseUrl = isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off' ? 'https' : 'http';
                $baseUrl .= '://' . $_SERVER['HTTP_HOST'];
                $baseUrl .= str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
            } else {
                $baseUrl = 'http://localhost/';

            }
            return $baseUrl;
        }
    }