<?php
    /**
     *
     */

    abstract class DatabaseResult
    {
        protected $link = null;
        protected $result = null;
        protected $currentRow = 0;
        protected $numRows = 0;

        public function __construct($result){
            $this->result = $result;
        }
        public function ResultAll(){

        }

        public function Row(){
            return  @mysqli_fetch_array($this->result, MYSQL_BOTH);
        }

        public function RowArr(){
            return  @mysqli_fetch_array($this->result, MYSQL_ASSOC);
        }
		
		public function RowAll($key = null){
            $res    = array();
            while ($row = $this->RowArr()) {
                $res[] = $key === null? $row : $row[$key];
            }
            return $res;
        }

        public function FieldMeta(){
            $result = array();
            if($field =  @mysqli_fetch_field($this->result))
            {
                $result['table'] = $field->orgtable == ''? $field->table : $field->orgtable;
                $result['name'] = $field->name;
                $result['orgname'] = $field->orgname == ''? $field->name : $field->orgname;
            }
            return $result;
        }

        public function FieldMetaAll(){
            $meta = array();
            while ($row = $this->FieldMeta()) {
                $meta[] = $row;
            };
            return $meta;
        }
    }