<?php
    /**
     *
     */

    /**
     * Class Controller
     *
     * @property Request $Request
     * @property Config $Config
     * @property DatabaseDriver $db
     */
    abstract class Controller
    {

        /**
         * @var Loader $load
         */
        protected $load;

        /**
         * @var Controller $instance
         */
        private static $instance;

        /**
         *
         */
        public function __construct()
        {
            self::$instance =& $this;
            $this->load     = Loader::singleton();

            $this->load->helper('Html');
            if ($this->Request->is_post() || $this->Request->is_get()) {
                $method = strtolower($this->Request->is());
                $host = $this->Request->$method('host');
                if ($host) {
                    $config = $this->Config->config['config'];
                    $vars   = $config[$host];
                    $db     = $this->Request->$method('db');
                    if ($db)
                        $vars['db'] = $db;
                    $this->load->database($vars);
                }
            }
        }

        /**
         * @return Controller
         */
        public static function &GetInstance()
        {
            return self::$instance;
        }

        /**
         * @param $key
         * @return bool
         */
        final public function __get($key)
        {
            if (property_exists($this->load, $key)) {
                return $this->load->$key;
            } else if (property_exists($this, $key)) {
                return $this->$key;
            }
            return false;
        }
        /*public function BeforeCall($request){
            $this->load->Helper('Html');
            if(isset($_POST['host']) && $_POST['host'] !== ''){
                global $config;
                $vars = $config[$_POST['host']];
                if(isset($_POST['db']) && $_POST['db'] !== '')
                    $vars['db'] = $_POST['db'];
                $this->load->DB($vars);
            }
        }

        public function AfterCall($request){

        }*/
    }