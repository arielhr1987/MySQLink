<?php
    /**
     *
     */

    abstract class DatabaseDriver
    {
        public $link;
        protected $host;
        protected $user;
        protected $pass;
        protected $db;
        protected $port;
        protected $socket;

        public function __construct($params)
        {
            if (is_array($params)) {
                foreach ($params as $key => $val) {
                    $this->$key = $val;
                }
            }
            $this->Connect();
        }

        protected function Connect()
        {
        }

        protected function Disconnect()
        {
        }

        public function GetResultClass()
        {
            $driver = $this->driver . 'Result';
            if (!class_exists($driver)) {
                require_once(DATABASE_PATH . DS . 'database_result.php');
                require_once(DATABASE_PATH . DS . 'drivers' . DS . $this->driver . DS . $this->driver . 'Result.php');
            }
            return $driver;
        }

        //Query related functions
        /**
         * @param $query
         * @return DatabaseResult mixed
         */
        abstract public function Query($query);

        abstract public function MultiQuery($query);

        abstract public function ListDatabases();

        abstract public function ListTables();

        abstract public function ListViews();

        public function ListFunctions(){
            $res = $this->Query('SHOW FUNCTION STATUS');//WHERE Db = '$this->db'
            return $res->RowAll();
        }

        abstract public function ListProceduresName();

        abstract public function ListEvents();

        abstract public function ListFields($table);

        abstract public function ListIndices($table);

        abstract public function ListTriggersName($table);
		
		abstract public function ListTriggers($table);

        abstract public function ListForeignKeys($table);

        abstract public function Error();

        protected function DropDatabase(string $name)
        {
        }

        protected function RenameDatabase(string $newName)
        {
        }

        protected function OptimizeDatabase(string $name)
        {
        }

        public function process_list(){
            return $this->Query('SHOW PROCESSLIST');
        }
        public function server_variables(){
            return $this->Query('SHOW GLOBAL VARIABLES');
        }
        public function server_status(){
            return $this->Query('SHOW GLOBAL STATUS');
        }
        public function kill_process($ids){
            return $this->Query('SHOW STATUS');
        }
        public function server_engines(){
            return $this->Query('SHOW ENGINES');
        }
        public function server_character_set(){
            return $this->Query('SHOW COLLATION');
        }
        //Table related functions

    }