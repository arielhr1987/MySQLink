<?php
/**
 *
 */

class TriggerController extends Controller {
    
	public function Index($host = '',$db = '', $table = ''){
		
		$this->load->view('Trigger/Index',array(
			'table' =>	$table,
			'db' => $db,
			'host'=> $host,
			'listURL' => Core::base_url() . 'Trigger/List'
			)
		);
    }
}