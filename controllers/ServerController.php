<?php
    /**
     *
     */

    class ServerController extends Controller
    {

        public function index()
        {
            $this->load->view('server/index');
        }

        public function process()
        {
            $res = $this->server_process();
            echo json_encode($res);
        }

        public function variables()
        {
            $res = $this->server_variables();
            echo json_encode($res);
        }

        public function status()
        {
            $res = $this->server_variables('server_status');
            echo json_encode($res);
        }

        /**
         * @return array
         */
        private function server_variables($method = 'server_variables')
        {
            $res = array(
                'metaData' => array(
                    'fields'  => array('Variable_name'),
                    'columns' => array(
                        array('text' => 'Variables', 'dataIndex' => 'Variable_name')
                    )
                ),
                'rows'     => array()
            );

            $temp_arr = array();
            foreach ($this->Config->config['config'] as $server => $vars) {
                $res['metaData']['columns'][] = array('text' => $server, 'dataIndex' => $server);
                $res['metaData']['fields'][]  = $server;
                $db                           = $this->load->database($vars, true);
                $result                       = $db->$method();
                $result                       = $result->RowAll();

                foreach ($result as $key => $value) {
                    $arr = array('Variable_name' => $value['Variable_name'], $server => $value['Value']);
                    if (in_array($value['Variable_name'], $temp_arr)) {
                        $num               = array_search($value['Variable_name'], $temp_arr);
                        $res['rows'][$num] = array_merge($res['rows'][$num], $arr);
                    } else {
                        $temp_arr[]    = $value['Variable_name'];
                        $res['rows'][] = $arr;
                    }
                }
            }
            return $res;
        }

        public function engines()
        {
            $res = $this->server_process('server_engines');
            echo json_encode($res);
        }

        public function charset()
        {
            $res = array(
                'metaData' => array(
                    'fields'  => array('Collation', 'Charset'),
                    'columns' => array(
                        array('text' => 'Collation', 'dataIndex' => 'Collation')
                    )
                ),
                'rows'     => array()
            );

            $temp_arr = array();
            foreach ($this->Config->config['config'] as $server => $vars) {
                $res['metaData']['columns'][] = array('text' => $server, 'dataIndex' => $server, 'my_type' => 'checkcolumn');
                $res['metaData']['fields'][]  = $server;
                $db                           = $this->load->database($vars, true);
                $result                       = $db->server_character_set();
                $result                       = $result->RowAll();

                foreach ($result as $key => $value) {
                    $arr = array('Collation' => $value['Collation'], 'Charset' => $value['Charset'], $server => true);
                    if (in_array($value['Collation'].$value['Charset'], $temp_arr)) {
                        $num               = array_search($value['Collation'].$value['Charset'], $temp_arr);
                        $res['rows'][$num] = array_merge($res['rows'][$num], $arr);
                    } else {
                        $temp_arr[]    = $value['Collation'].$value['Charset'];
                        $res['rows'][] = $arr;
                    }
                }
            }
            echo json_encode($res);
        }

        public function kill()
        {
            $arr    = json_decode($GLOBALS['HTTP_RAW_POST_DATA'], false);
            $simple = array();
            foreach ($arr as $value) {
                $simple[$value->groupHost][] = $value->Id;
            }
            $keys = array_keys($simple);
            foreach ($keys as $server) {
                $vars = $this->Config->config['config'][$server];
                $db   = $this->load->database($vars, true);
                //$db->

            }
            $var = 0;
        }

        /**
         * @return array
         */
        private function server_process($method = 'process_list')
        {
            $res = array();
            foreach ($this->Config->config['config'] as $server => $vars) {
                $db     = $this->load->database($vars, true);
                $result = $db->$method();
                $result = $result->RowAll();
                foreach ($result as $process) {
                    $process['groupHost'] = $server;
                    $res[]                = $process;
                }
            }
            return $res;
        }

    }