<?php
    /**
     *
     */
    class QueryController extends Controller
    {
        public function Index($host = '', $db = '', $sql = '')
        {
            $config = $this->Config->config['config'];
            if (!array_key_exists($host, $config)) {
                throw new Exception('Host not found in config file');
            }
            $vars = $config[$host];
            $this->load->database($vars);
            $dbs = $this->db->listDatabases();
            $dbs = json_encode($dbs);
            $this->load->view('Query/Index', array(
                    'dbs'        => $dbs,
                    'host'       => $host,
                    'sql'        => $sql,
                    'executeURL' => Core::base_url() . 'Query/Execute'
                )
            );
        }

        public function Execute()
        {
            $resultArr = $this->db->MultiQuery($_POST['query']);
            $res       = array();
            foreach ($resultArr as $result) {
                $obj      = array();
                $rows     = array();
                $editable = false;
                while ($row = $result->RowArr()) {
                    $rows[] = $row;
                };
                $obj['editable']  = $editable;
                $obj['meta']      = $result->FieldMetaAll();
                $obj['rows']      = $rows;
                $res['results'][] = $obj;
            }
            //$res['msg'] = 'Query executed successfully';
            $res['msg'] = array('status' => 'OK', 'time' => date('d-m-Y h:i:s a'), 'msg' => 'Query executed successfully', 'duration' => '123');
            $error      = $this->db->error();
            if ($error['code']) {
                //$res['msg'] = 'Error ' . $error['code'] . ' ' . $error['msg'] ;
                $res['msg']['msg']    = 'Error ' . $error['code'] . ' ' . $error['msg'];
                $res['msg']['status'] = 'ERROR';
            }

            echo json_encode($res);
        }

    }