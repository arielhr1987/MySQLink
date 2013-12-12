<?php
    /**
     *
     */

    class mysqliResult extends DatabaseResult
    {
        public function ResultAll(){
            return @mysqli_fetch_all($this->result , MYSQLI_ASSOC);
        }


    }