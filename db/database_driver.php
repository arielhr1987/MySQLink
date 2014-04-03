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

        protected $result;
        protected $queryTime;

        public function __construct($params)
        {
            if (is_array($params)) {
                foreach ($params as $key => $val) {
                    $this->$key = $val;
                }
            }
            $this->connect();
        }

        abstract protected function dbConnect();

        protected function connect()
        {
            if (is_resource($this->link) OR is_object($this->link)) {
                return TRUE;
            }
            $this->link = $this->dbConnect();

            if (!$this->link) {
                return false;
            }
            return true;
        }

        protected function Disconnect()
        {
        }

        public function getResultClass()
        {
            $driver = $this->driver . 'Result';
            if (!class_exists($driver)) {
                require_once(DATABASE_PATH . DS . 'database_result.php');
                require_once(DATABASE_PATH . DS . 'drivers' . DS . $this->driver . DS . $this->driver . 'Result.php');
            }
            return $driver;
        }

        abstract protected function execute($sql);
        abstract public function error();

        //Query related functions
        /**
         * @param $query
         * @return DatabaseResult mixed
         */
        public function query($sql){
            $this->connect();
            //query timer start
            $time_start = list($sm, $ss) = explode(' ', microtime());
            if (FALSE === ($this->result = $this->execute($sql))){
                return false;
            }
            //query timer stop
            $time_end = list($em, $es) = explode(' ', microtime());
            $this->queryTime = ($em + $es) - ($sm + $ss);
            $driver = $this->getResultClass();
            $res = new $driver($this->result,$this->link);
            return $res;
        }

        abstract public function MultiQuery($query);

        public function listDatabases(){
            $query = $this->query('SHOW DATABASES');
            if($query != false){
                return $this->simplify($query->resultArray(),'Database');
            }
            return false;
        }


        public function listTables(){
            $query = $this->query("SHOW FULL TABLES WHERE Table_type <> 'VIEW'");
            if($query != false){
                return $this->simplify($query->resultArray(),0);
            }
            return false;
        }

        public function listViews(){
            $query = $this->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
            if($query != false){
                return $this->simplify($query->resultArray(),0);
            }
            return false;
        }

        public function listFunctions($simple = false)
        {
            $query = $this->query("SHOW FUNCTION STATUS WHERE Db = '$this->db'");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Name');
                return $query->resultObject();
            }
            return false;
        }

        public function listProcedures($simple = false){
            $query = $this->query("SHOW PROCEDURE STATUS WHERE Db = '$this->db'");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Name');
                return $query->resultObject();
            }
            return false;
        }

        public function listEvents($simple = false){
            $query = $this->query("SHOW EVENTS WHERE Db = '$this->db'");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Name');
                return $query->resultObject();
            }
            return false;
        }

        public function listFields($table, $simple = false){
            $query = $this->query("SHOW COLUMNS FROM `$table`");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Field');
                return $query->resultObject();
            }
            return false;
        }

        public function listIndices($table, $simple = false){
            $query = $this->query("SHOW INDEX FROM `$table`");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Key_name');
                return $query->resultObject();
            }
            return false;
        }

        public function listForeignKeys($table, $simple = false){
            $result    = array();
            $statement = $this->Query("SHOW CREATE TABLE `" . $table . "`")->resultArray();
            $statement = $statement[0]['Create Table'];
            if ($statement) {
                $fb = array('RESTRICT', 'CASCADE', 'SET NULL', 'NO ACTION');
                static $ba = '`(?:[^`]|``)+`';
                preg_match_all("~CONSTRAINT ($ba) FOREIGN KEY \\(((?:$ba,? ?)+)\\) REFERENCES ($ba)(?:\\.($ba))? \\(((?:$ba,? ?)+)\\)(?: ON DELETE (" . implode("|", $fb) . "))?(?: ON UPDATE (" . implode("|", $fb) . "))?~", $statement, $oa, PREG_SET_ORDER);
                foreach ($oa as $k) {
                    //preg_match_all("~$ba~", $k[2], $Ga);
                    //preg_match_all("~$ba~", $k[5], $ea);
                    //$c[$k[1]] = array("db" => $k[4] != "" ? $k[3] : $k[4], "table" => $k[4] != "" ? $k[4] : $k[3], "source" => array_map('idf_unescape', $Ga[0]), "target" => array_map('idf_unescape', $ea[0]), "on_delete" => $k[6], "on_update" => $k[7],);
                    $result[] = str_replace('`', '', $k[1]);
                }
            }
            return $result;
        }

        public function listTriggers($table, $simple = false){
            $query = $this->query("SHOW TRIGGERS WHERE `Table` = '$table'");
            if($query != false){
                if($simple) return $this->simplify($query->resultObject(),'Trigger');
                return $query->resultObject();
            }
            return false;
        }


        protected function DropDatabase(string $name)
        {
        }

        protected function RenameDatabase(string $newName)
        {
        }

        protected function OptimizeDatabase(string $name)
        {
        }

        public function processList()
        {
            return $this->Query('SHOW PROCESSLIST')->resultArray();
        }

        public function serverVariables()
        {
            return $this->Query('SHOW GLOBAL VARIABLES')->resultArray();
        }

        public function server_status()
        {
            return $this->Query('SHOW GLOBAL STATUS')->resultArray();
        }

        public function kill_process($ids)
        {
            return $this->Query('SHOW STATUS');
        }

        public function server_engines()
        {
            return $this->Query('SHOW ENGINES')->resultArray();
        }

        public function server_character_set()
        {
            return $this->Query('SHOW COLLATION')->resultArray();
        }

        /**
         * This function is a helper used to generate a simple arr
         *
         * @param $arr array or object that u want to simplify
         * @param $key  the key to simplify for
         * @return array the simplified array
         */
        private function simplify($arr, $key){
            $res=array();
            foreach($arr as $item){
                if(is_object($item)){
                    $res[] = $item->$key;
                }else if(is_array($item)){
                    if(array_key_exists($key, $item)){
                        $res[] = $item[$key];
                    }else{
                        $tempArr = array_values($item);
                        $res[] = $tempArr[0];
                    }
                }
            }
            return $res;
        }
    }