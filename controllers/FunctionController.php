<?php
    /**
     *
     */
    class FunctionController extends Controller
    {
        public function Index($host = '', $db = '')
        {
            $config = $this->Config->config['config'];
            if (!array_key_exists($host, $config)) {
                throw new Exception('Host not found in config file');
            }
            $this->load->view('Function/Index', array(
                    'db'        => $db,
                    'host'       => $host
            ));
        }

        public function All(){
            $result = $this->db->ListFunctions();
            $arr = array();
            foreach($result as $res){
                $arr[] = array(
                    'Name' => $res["Name"],
                    'Definer' => $res['Definer'],
                    'Created' => $res['Created'],
                    'Modified' => $res['Modified'],
                    'Security_type' => $res['Security_type'],
                    'Comment' => $res['Comment']
                );
            }
            echo json_encode($arr);
        }

        public function Alter($host = '', $db = '', $name = ''){
            //$this->db->
        }
		
		public function Save(){
			$defArr = json_decode($_POST['definition'],true);
			$pArr = $defArr['parameters'];
			$query = 'CREATE DEFINER = CURRENT_USER PROCEDURE `' . $defArr['name'] . '` (';			
			foreach($pArr as $key => $p){
				$query .= $p['mode'] . ' `' . $p['name'] . '` ' . $p['type'] ;
				$query .= ($key !== count($pArr) - 1)? ',' : '';
			} 
			$query .= ') ' . $defArr['definition'] . ';';
			echo $query;
			$this->db->MultiQuery($query);
		}

        public function Drop(){
            $test = null;
        }

    }