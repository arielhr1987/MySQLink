<?php
    /**
     *
     */

    class mysqliDriver extends DatabaseDriver
    {

        public function Connect()
        {
            $this->link = @mysqli_connect($this->host, $this->user, $this->pass, $this->db);
            if (!$this->link) {
                return false;
            }
            $this->link->set_charset('utf8');
            return true;
        }


        public function ListDatabases()
        {
            $result = $this->Query('SHOW DATABASES');
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row[0];
            }
            return $res;
        }

        public function Query($query)
        {
            $result = @mysqli_query($this->link, $query);
            if (is_object($result)) {
                $rdriver = $this->GetResultClass();
                $result  = new $rdriver ($result);
            }
            return $result;
        }

        public function MultiQuery($query)
        {
            $result  = array();
            if ($res = @mysqli_multi_query($this->link, $query)) {                
                $rdriver = $this->GetResultClass();
                do {
                    if ($temp = mysqli_store_result($this->link)) {
                        $result[] = new $rdriver ($temp);
                    }
                } while (mysqli_more_results($this->link) && mysqli_next_result($this->link));
            }
            return $result;
        }

        public function ListTables()
        {
            $result = $this->Query("SHOW FULL TABLES WHERE Table_type <> 'VIEW'");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row[0];
            }
            return $res;
        }

        public function ListViews()
        {
            $result = $this->Query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row[0];
            }
            return $res;
        }

        /*public function ListFunctions()
        {
            $result = $this->Query("SHOW FUNCTION STATUS WHERE Db = '$this->db'");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row[1];
            }
            return $res;
        }*/

        public function ListProceduresName()
        {
            $result =  $this->ListProcedures();
            $res    = array();
            foreach ($result as $row) {
                $res[] = $row["Name"];
            }
            return $res;
        }

        public function ListProcedures(){
            $result = $this->Query("SHOW PROCEDURE STATUS WHERE Db = '$this->db'");
            return $result->RowAll();
        }

        public function ListEvents()
        {
            $result = $this->Query("SHOW EVENTS WHERE Db = '$this->db'");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row[1];
            }
            return $res;
        }


        public function ListFields($table)
        {
            $result = $this->Query("SHOW COLUMNS FROM `$table`");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row['Field'];
            }
            return $res;
        }

        public function ListIndices($table)
        {
            $result = $this->Query("SHOW INDEX FROM `$table`");
            $res    = array();
            while ($row = $result->Row()) {
                $res[] = $row['Key_name'];
            }
            return $res;
        }

        public function ListTriggersName($table)
        {
            $result = $this->ListTriggers($table);
            $res    = array();
            foreach($result as $row){
                $res[] = $row['Trigger'];
            }
            return $res;
        }
		
		public function ListTriggers($table)
        {
            $result = $this->Query("SHOW TRIGGERS WHERE `Table` = '$table'");
            return $result->RowAll();
        }
		
		public function TriggerDefiniton($table, $name)
        {
            $result = $this->Query("SHOW TRIGGERS WHERE `Table` = '$table' AND `Trigger` = '$name'");
            $res    = array();
            if($row = $result->Row()) {
                $res = array(
					"Timing" => $row["Timing"],
					"Event"  => $row["Event"],
					"Definer"=> $row["Definer"],
					"Statement"=> $row["Statement"]
				);
            }
            return $res;
        }

        public function ListForeignKeys($table)
        {
            $result    = array();
            $statement = $this->Query("SHOW CREATE TABLE `" . $table . "`")->Row();
            $statement = $statement[1];
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

        public function Error()
        {
			$code = 0;
			$msg ='';
			if (@mysqli_connect_errno($this->link)) {
				$code = mysqli_connect_errno($this->link);
				$msg = mysqli_connect_error($this->link);
			}else if (@mysqli_errno($this->link)) {
				$code = @mysqli_errno($this->link);
				$msg = @mysqli_error($this->link);
			}
			return array(
                'code' => $code,
                'msg' => $msg
            );
        }
    }