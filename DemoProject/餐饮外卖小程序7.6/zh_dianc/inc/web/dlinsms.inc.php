<?php
global $_GPC, $_W;
$action = 'start';
$storeid=$_COOKIE["storeid"];
$cur_store = $this->getStoreById($storeid);
//$GLOBALS['frames'] = $this->getMainMenu2();
$GLOBALS['frames'] = $this->getNaveMenu($storeid, $action);
$item=pdo_get('wpdc_sms',array('uniacid'=>$_W['uniacid'],'store_id'=>$storeid));
    if(checksubmit('submit')){
            // $data['user_name']=trim($_GPC['user_name']);
            // $data['password']=trim($_GPC['password']);
            // $data['model']=trim($_GPC['model']);
            // $data['model2']=trim($_GPC['model2']);
            // $data['signature']=trim($_GPC['signature']);
            $data['appkey']=trim($_GPC['appkey']);
            $data['tpl_id']=trim($_GPC['tpl_id']);
            $data['tpl2_id']=trim($_GPC['tpl2_id']);
            $data['store_id']=$storeid;
            $data['tel']=$_GPC['tel'];
            $data['email']=$_GPC['email'];
            $data['uniacid']=$_W['uniacid'];
            if($_GPC['id']==''){                
                $res=pdo_insert('wpdc_sms',$data);
                if($res){
                    message('添加成功',$this->createWebUrl2('dlinsms',array()),'success');
                }else{
                    message('添加失败','','error');
                }
            }else{
                $res = pdo_update('wpdc_sms', $data, array('id' => $_GPC['id']));
                if($res){
                    message('编辑成功',$this->createWebUrl2('dlinsms',array()),'success');
                }else{
                    message('编辑失败','','error');
                }
            }
        }
include $this->template('web/dlinsms');