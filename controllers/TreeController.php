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
                    $result = $this->GenerateTreenode(array_keys($config),false,'app-icon-server');
                };
                    break;
                //Databases
                case 1:
                {
                    $res    = $this->db->ListDatabases();
                    $result = $this->GenerateTreenode($res,false, 'app-icon-database');
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
                            $res    = $this->db->ListTables();
                            $result = $this->GenerateTreenode($res, false ,'app-icon-table');
                        };
                            break;
                        //Views
                        case 'views':
                        {
                            $res    = $this->db->ListViews();
                            $result = $this->GenerateTreenode($res,true, 'app-icon-view');
                        };
                            break;
                        //Functions
                        case 'functions':
                        {
                            $res    = $this->db->ListFunctions();
                            $result = $this->GenerateTreenode($res, true, 'app-icon-function');
                        };
                            break;
                        //Procedures
                        case 'procedures':
                        {
                            $res    = $this->db->ListProceduresName();
                            $result = $this->GenerateTreenode($res, true, 'app-icon-procedure');
                        };
                            break;
                        //Events
                        case 'events':
                        {
                            $res    = $this->db->ListEvents();
                            $result = $this->GenerateTreenode($res, true, 'app-icon-event');
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
                            $res    = $this->db->ListFields($node[3]);
                            $result = $this->GenerateTreenode($res, true, 'app-icon-table-column');
                        };
                            break;
                        //Indices
                        case 'indices':
                        {
                            $res    = $this->db->ListIndices($node[3]);
                            $result = $this->GenerateTreenode($res, true, 'app-icon-table-index');
                        };
                            break;
                        //Foreign keys
                        case 'fk':
                        {
                            $res    = $this->db->ListForeignKeys($node[3]);
                            $result = $this->GenerateTreenode($res, true , 'app-icon-fk');
                        };
                            break;
                        //Triggers
                        case 'triggers':
                        {
                            $res    = $this->db->ListTriggersName($node[3]);
                            $result = $this->GenerateTreenode($res, true, 'app-icon-table-trigger');
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
        private function GenerateTreenode($array = array(), $leaf = false, $iconCls = 'x-tree-icon')
        {
            $result = array();
            foreach ($array as $value) {
                //$value = utf8_encode($value);
                $result[] = array('text' => $value, 'xid' => $value, 'leaf' => $leaf , 'iconCls'=> $iconCls/*,'editable'=>false*/);
            }
            return $result;
        }
    }