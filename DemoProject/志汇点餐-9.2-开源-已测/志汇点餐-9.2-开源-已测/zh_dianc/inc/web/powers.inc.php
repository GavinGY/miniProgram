<?php
global $_GPC, $_W;
$GLOBALS['frames'] = $this->getMainMenu();
$stores=pdo_getall('wpdc_store',array('uniacid'=>$_GPC['uniacid']));
 $item=pdo_get('wpdc_system',array('uniacid'=>$_GPC['uniacid']));
    if(checksubmit('submit')){
            $data['msgn']=$_GPC['msgn'];//平台模式功能
            $data['more']=$_GPC['msgn'];
            $data['is_jf']=$_GPC['jfgn'];
            $data['jfgn']=$_GPC['jfgn'];//积分功能

            $data['fxgn']=$_GPC['fxgn'];//分销功能
            $data2['is_open']=$_GPC['fxgn'];
            

            $data['uniacid']=$_GPC['uniacid'];

            pdo_update('wpdc_fxset', $data2, array('uniacid' => $_GPC['uniacid']));
            if($_GPC['id']==''){                
                $res=pdo_insert('wpdc_system',$data);
                if($res){
                    message('添加成功',$this->createWebUrl('powers',array('uniacid'=>$_GPC['uniacid'])),'success');
                }else{
                    message('添加失败','','error');
                }
            }else{
                $res = pdo_update('wpdc_system', $data, array('id' => $_GPC['id']));
                if($res){
                    message('编辑成功',$this->createWebUrl('powers',array('uniacid'=>$_GPC['uniacid'])),'success');
                }else{
                    message('编辑失败','','error');
                }
            }
        }
include $this->template('web/powers');