<?php
global $_GPC, $_W;
$action = 'start';
//$GLOBALS['frames'] = $this->getMainMenu2();
$storeid=$_COOKIE["storeid"];
$GLOBALS['frames'] = $this->getNaveMenu($storeid, $action);
$list = pdo_getall('wpdc_spec',array('goods_id' => $_GPC['dishes_id']));
if($_GPC['id']){
		$result = pdo_delete('wpdc_spec', array('id'=>$_GPC['id']));
		if($result){
			message('删除成功',$this->createWebUrl2('dlspec',array('dishes_id'=>$_GPC['dishes_id'])),'success');
		}else{
		message('删除失败','','error');
		}
	
}
include $this->template('web/dlspec');