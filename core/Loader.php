<?php
    /**
     *
     */

    class Loader
    {
        /**
         * @var
         */
        private static $instance;

        /**
         * @return Controller
         */
        private function &GetInstance()
        {
            return Controller::GetInstance();
        }

        // A private constructor; prevents direct creation of object
        /**
         *
         */
        private function __construct()
        {
            //not accessible
        }

        /**
         * @return mixed
         */
        public static function singleton()
        {
            if (!isset(self::$instance)) {
                $c              = __CLASS__;
                self::$instance = new $c;
            }
            return self::$instance;
        }

        /**
         * @param string $name
         * @param array $vars
         * @param bool $return
         * @return bool|string
         * @throws Exception
         */
        public function view($name = 'index', $vars = array(), $return = false)
        {
            $file = VIEWS_PATH . DS . $name . '.php';
            if (is_readable($file)) {
                if (is_array($vars)) {
                    extract($vars);
                }
                ob_start();
                if ((bool)@ini_get('short_open_tag') === FALSE) {
                    echo eval('?>' . preg_replace("/;*\s*\?>/", "; ?>", str_replace('<?=', '<?php echo ', file_get_contents($file))));
                } else {
                    include($file);
                }
                if ($return === TRUE) {
                    $buffer = ob_get_contents();
                    @ob_end_clean();
                    return $buffer;
                }
                @ob_end_flush();
                return true;
            }
            throw new Exception('The view ' . $name . ' was not found.');
        }

        /**
         * @param $helpers
         * @throws Exception
         */
        public function helper($helpers)
        {
            if (is_string($helpers)) {
                $helpers = str_replace(' ', '', $helpers);
                $helpers = explode(',', $helpers);
            }
            $helpersPath = HELPERS_PATH . DS;
            foreach ($helpers as $name) {
                $file = $helpersPath . $name . 'Helper.php';
                if (file_exists($file)) {
                    require_once $file;
                } else {
                    throw new Exception("The Helper $name was not found.");
                }
            }
        }

        /**
         * @param $name
         * @param array $vars
         * @param null $objectName
         * @return bool
         * @throws Exception
         */
        public function library($name, $vars = array(), $objectName = null)
        {
            $file = LIBRARIES_PATH . DS . $name . '.php';
            if (file_exists($file)) {
                require_once $file;
                //$Controller = $this->GetInstance();
                if (is_null($objectName)) {
                    $objectName = $name;
                }
                //Load the library
                if (!property_exists($this, $objectName) || !isset($this->$objectName)) {
                    $this->$objectName = new $name($vars);
                }
                return true;
            }
            throw new Exception("The Library $name was not found.");
        }

        /**
         * @param null $vars
         * @param bool $return
         * @param null $objectName
         * @return bool
         * @throws Exception
         */
        public function database($vars = null, $return = false, $objectName = null)
        {
            $dbDriver   = DATABASE_PATH . DS . 'database_driver.php';
            $driverName = $vars['driver'];
            //if(!isset($driverName))return false;
            if (file_exists($dbDriver)) {
                require_once $dbDriver;
                $className = $driverName . 'Driver';
                if (require_once DATABASE_PATH . DS . 'drivers' . DS . $driverName . DS . $driverName . 'Driver.php') {

                    if ($return === true) {
                        return new $className($vars);
                    }
                    $Controller = $this->GetInstance();
                    if (is_null($objectName)) {
                        $objectName = 'db';
                    }
                    if (!property_exists($Controller, $objectName) || !isset($Controller->$objectName)) {
                        $Controller->$objectName = new $className($vars);
                    }
                    return true;
                } else {
                    throw new Exception("$className file not found");
                }
            } else {
                throw new Exception("DatabaseDriver file not found.");
            }
        }
    }