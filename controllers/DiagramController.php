<?php
    /**
     *
     */
    class DiagramController extends Controller
    {
        public function Index($host = '', $db = '')
        {
            global $config;
            if (!array_key_exists($host, $config)) {
                throw new Exception('Host not found in config file');
            }
            $this->load->view('Diagram/Index', array(
                    'db'        => $db,
                    'host'       => $host
            ));
        }

    }