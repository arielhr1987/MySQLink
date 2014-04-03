<?php
    /**
     *
     */

    abstract class DatabaseResult
    {
        public $link = null;
        public $result = null;
        public $resultArray = array();
        public $resultObject = array();
        public $fields = array();
        public $currentRow = 0;
        public $numRows = 0;

        public function __construct($result, $link = null){
            $this->result = $result;
            $this->link = $link;
        }
        /*public function ResultAll(){

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
        }*/
        //-------------------------------------
        public function resultArray()
        {
            if (count($this->resultArray) > 0)
            {
                return $this->resultArray;
            }
            $this->dataSeek(0);
            while ($row = $this->fetchAssoc())
            {
                $this->resultArray[] = $row;
            }
            return $this->resultArray;
        }

        public function resultObject()
        {
            if (count($this->resultObject) > 0)
            {
                return $this->resultObject;
            }
            $this->dataSeek(0);
            while ($row = $this->fetchObject())
            {
                $this->resultObject[] = $row;
            }
            return $this->resultObject;
        }

        abstract public function fetchAssoc();
        abstract public function fetchObject();
        abstract public function dataSeek();
        abstract public function fields();
    }