<?php
    /**
     *
     */

    class TreeController extends Controller
    {
        public function Index()
        {
            $result = array();
            $node   = explode('/', $_POST['nodePath']);
            array_shift($node);
            array_shift($node); //remove the 'root' node
            switch (count($node)) {
                //Servers
                case 0:
                {
                    $config = $this->Config->config['config'];
                    $result = $this->generateTreenode(array_keys($config),false,'app-icon-server');
                };
                    break;
                //Databases
                case 1:
                {
                    $res    = $this->db->listDatabases();
                    $result = $this->generateTreenode($res,false, 'app-icon-database');
                };
                    break;
                //Database Folders
                case 2:
                {
                    $result = array(
                        array('text' => 'Tables', 'xid' => 'tables'),
                        array('text' => 'Views', 'xid' => 'views'),
                        array('text' => 'Functions', 'xid' => 'functions'),
                        array('text' => 'Procedures', 'xid' => 'procedures'),
                        array('text' => 'Events', 'xid' => 'events')
                    );
                };
                    break;
                //Database folder content
                case 3:
                {
                    switch ($node[2]) {
                        //Tables in the database
                        case 'tables':
                        {
                            $res    = $this->db->listTables();
                            $result = $this->generateTreenode($res, false ,'app-icon-table');
                        };
                            break;
                        //Views
                        case 'views':
                        {
                            $res    = $this->db->listViews();
                            $result = $this->generateTreenode($res,true, 'app-icon-view');
                        };
                            break;
                        //Functions
                        case 'functions':
                        {
                            $res    = $this->db->listFunctions(true);
                            $result = $this->generateTreenode($res, true, 'app-icon-function');
                        };
                            break;
                        //Procedures
                        case 'procedures':
                        {
                            $res    = $this->db->listProcedures(true);
                            $result = $this->generateTreenode($res, true, 'app-icon-procedure');
                        };
                            break;
                        //Events
                        case 'events':
                        {
                            $res    = $this->db->listEvents(true);
                            $result = $this->generateTreenode($res, true, 'app-icon-event');
                        }
                    }
                };
                    break;
                //Tables folder content
                case 4:
                {
                    if ($node[2] == 'tables') {
                        $result = array(
                            array('text' => 'Fields', 'xid' => 'fields',),
                            array('text' => 'Indices', 'xid' => 'indices'),
                            array('text' => 'Foreign Keys', 'xid' => 'fk'),
                            array('text' => 'Triggers', 'xid' => 'triggers')
                        );
                    }
                };
                    break;
                case 5:
                {
                    switch ($node[4]) {
                        //Fields
                        case 'fields':
                        {
                            $res    = $this->db->listFields($node[3], true);
                            $result = $this->generateTreenode($res, true, 'app-icon-table-column');
                        };
                            break;
                        //Indices
                        case 'indices':
                        {
                            $res    = $this->db->listIndices($node[3], true);
                            $result = $this->generateTreenode($res, true, 'app-icon-table-index');
                        };
                            break;
                        //Foreign keys
                        case 'fk':
                        {
                            $res    = $this->db->listForeignKeys($node[3], false);
                            $result = $this->generateTreenode($res, true , 'app-icon-fk');
                        };
                            break;
                        //Triggers
                        case 'triggers':
                        {
                            $res    = $this->db->listTriggers($node[3], true);
                            $result = $this->generateTreenode($res, true, 'app-icon-table-trigger');
                        };
                            break;
                    }
                };
                    break;
            }
            echo json_encode($result);
        }

        /**
         * Returns a array with the format needed by the ext tree to render the nodes
         *
         * @param array $array The array to iterate
         * @param bool $leaf Mark the generated nodes as leaf. By default false
         * @param string $iconCls Apply a user defined icon. By default 'x-tree-icon'
         * @return array
         */
        private function generateTreenode($array = array(), $leaf = false, $iconCls = 'x-tree-icon')
        {
            if($array == false){
                //Error
            }
            $result = array();
            foreach ($array as $value) {
                //$value = utf8_encode($value);
                $result[] = array('text' => $value, 'xid' => $value, 'leaf' => $leaf , 'iconCls'=> $iconCls/*,'editable'=>false*/);
            }
            return $result;
        }
    }