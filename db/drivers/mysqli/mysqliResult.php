<?php
    /**
     *
     */

    class mysqliResult extends DatabaseResult
    {
        public function ResultAll(){
            return @mysqli_fetch_all($this->result , MYSQLI_ASSOC);
        }

        public function fetchAssoc()
        {
            return mysqli_fetch_assoc($this->result);
        }

        public function fetchObject()
        {
            return mysqli_fetch_object($this->result);
        }

        public function dataSeek($n = 0)
        {
            return mysqli_data_seek($this->result, $n);
        }

        public function fields()
        {
            if(count($this->fields) > 0){
                return $this->fields;
            }
            $retval = array();
            while ($field = mysqli_fetch_field($this->result))
            {
                preg_match('/([a-zA-Z]+)(\(\d+\))?/', $field->Type, $matches);

                $type = (array_key_exists(1, $matches)) ? $matches[1] : NULL;
                $length = (array_key_exists(2, $matches)) ? preg_replace('/[^\d]/', '', $matches[2]) : NULL;

                $F				= new stdClass();
                $F->name		= $field->Field;
                $F->type		= $type;
                $F->default		= $field->Default;
                $F->max_length	= $length;
                $F->primary_key = ( $field->Key == 'PRI' ? 1 : 0 );

                $retval[] = $F;
            }

            return $this->fields = $retval;
        }
    }