<?php
global $_GPC, $_W;
$GLOBALS['frames'] = $this->getMainMenu2();
$storeid=$_COOKIE["storeid"];
$cur_store = $this->getStoreById($storeid);
$type=pdo_getall('wpdc_type',array('store_id'=>$storeid),array(),'','order_by asc');
$where=" WHERE a.uniacid=:uniacid and a.store_id=:store_id";
$data[':uniacid']=$_W['uniacid'];
$data[':store_id']=$storeid;

	//echo $_GPC['area'];die;
    if($_GPC['keywords']){
    	$where .=" and a.name LIKE :name ";
    	 $op=$_GPC['keywords'];
          $data[':name']="%$op%";
    	
    }
    if($_GPC['dishes_type']){
    	$where .=" and a.dishes_type=:bid";
    	$data[':bid']=$_GPC['dishes_type'];
    }
    if($_GPC['type_id']){
      $where .=" and a.type_id=:type_id";
      $data[':type_id']=$_GPC['type_id'];
    }
    if($_GPC['is_shelves2']){
    	$where .=" and a.is_shelves=:cid";
    	$data[':cid']=$_GPC['is_shelves'];
    }


$pageindex = max(1, intval($_GPC['page']));
$pagesize=15;
$sql="select a.* ,b.type_name from " . tablename("wpdc_dishes") . " a"  . " left join " . tablename("wpdc_type") . " b on b.id=a.type_id".$where." order by sorting asc";
$select_sql =$sql." LIMIT " .($pageindex - 1) * $pagesize.",".$pagesize;
$list = pdo_fetchall($select_sql,$data);	   
$total=pdo_fetchcolumn("select count(*) from " . tablename("wpdc_dishes") . " a"  . " left join " . tablename("wpdc_type") . " b on b.id=a.type_id".$where,$data);
$pager = pagination($total, $pageindex, $pagesize);
if($_GPC['id']){
	$data2['is_shelves']=$_GPC['is_shelves'];
	$res=pdo_update('wpdc_dishes',$data2,array('id'=>$_GPC['id']));
	if($res){
		message('设置成功',$this->createWebUrl('dishes2',array('page'=>$_GPC['page'],'keywords'=>$_GPC['keywords'],'dishes_type'=>$_GPC['dishes_type'],'type_id'=>$_GPC['type_id'],'is_shelves2'=>$_GPC['is_shelves2'])),'success');
	}else{
		message('设置失败','','error');
	}
}
if($_GPC['op']=='delete'){
	$result = pdo_delete('wpdc_dishes', array('id'=>$_GPC['delid']));
		if($result){
			message('删除成功',$this->createWebUrl('dishes2',array()),'success');
		}else{
			message('删除失败','','error');
		}
}
if(checksubmit('submit2')){

     $filename = $_FILES['file_stu']['name'];
     $tmp_name = $_FILES['file_stu']['tmp_name'];

       $filePath = IA_ROOT . '/addons/zh_dianc/inc/upload/';
        include 'phpexcelreader/reader.php';

        $data = new Spreadsheet_Excel_Reader();
        $data->setOutputEncoding('utf-8');

        //注意设置时区
        $time = date("y-m-d-H-i-s"); //去当前上传的时间
        $extend = strrchr ($filename, '.');
        //上传后的文件名
        $name = $time . $extend;
        $uploadfile = $filePath . $name; //上传后的文件名地址
    //@move_uploaded_file($tmp_name, $uploadfile);
        if (copy($tmp_name, $uploadfile)) {
            if (!file_exists($filePath)) {
                echo '文件路径不存在.';
                return;
            }
            if (!is_readable($uploadfile)) {
                echo("文件为只读,请修改文件相关权限.");
                return;
            }
        
            $data->read($uploadfile);
            error_reporting(E_ALL ^ E_NOTICE);
            $count = 0;
            for ($i = 2; $i <= $data->sheets[0]['numRows']; $i++) { //$=2 第二行开始
                //以下注释的for循环打印excel表数据
               /* for ($j = 1; $j <= $data->sheets[0]['numCols']; $j++) {//获取某个单元格的数据
                    //echo "\"".$data->sheets[0]['cells'][$i][$j]."\",";
                }*/

                $row = $data->sheets[0]['cells'][$i];
                //message($data->sheets[0]['cells'][$i][1]);
                //开始处理数据库
                   $insert['sorting'] = $row[1];
                   $insert['name'] = $row[2];
                   //$insert['img'] = $row[3];
                   $insert['num'] = $row[3];
                   $insert['money'] = $row[4];
                   $insert['wm_money'] = $row[5];
                   $insert['sit_ys_num'] = $row[6];
                   $insert['type_id'] = $row[7];
                   $insert['dishes_type'] = $row[8];
                   $insert['box_fee'] = $row[9];
                   $insert['signature'] = $row[10];
                   $insert['is_shelves'] = $row[11];
                   $insert['details'] = $row[12];
                   $insert['store_id'] = $storeid;
                   $insert['uniacid'] = $_W['uniacid'];
                   $res= pdo_insert('wpdc_dishes',$insert);  
                   $count = $count + $res;
            }
        }
       //unlink($uploadfile); //删除文件
        if ($count == 0) {
        	message('导入失败',$this->createWebUrl('dishes2',array()),'error');
           
        } else {
           message('导入成功',$this->createWebUrl('dishes2',array()),'success');
        }
        
    }

    if(checksubmit('export_submit2', true)) {
    $time=date("Y-m-d");
    $time="'%$time%'";
        $count = pdo_fetchcolumn("SELECT COUNT(*) FROM". tablename("wpdc_dishes")." WHERE  store_id =".$storeid);
        $pagesize = ceil($count/5000);
        //array_unshift( $names,  '活动名称'); 
        $header = array(
           'sorting' => '排序',
          'name'=>'菜品名称',
           'img' => '菜品图片',
           'num' => '库存', 
           'sit_ys_num' => '销量', 
           'money'=>'店内价格',
           'dishes_type' => '商品选项',
           'box_fee' => '餐盒费',
          
           'signature' => '招牌(1是2否)',
            'is_shelves' => '上架(1是2否)',
           'details' => '描述',
          

        );

        $keys = array_keys($header);
        $html = "\xEF\xBB\xBF";
        foreach ($header as $li) {
            $html .= $li . "\t ,";
        }
        $html .= "\n";
        for ($j = 1; $j <= $pagesize; $j++) {
            $sql = "select * from " . tablename("wpdc_dishes")." WHERE store_id =".$storeid." limit " . ($j - 1) * 5000 . ",5000 ";
            $list = pdo_fetchall($sql);            
        }
            if (!empty($list)) {
                $size = ceil(count($list) / 500);
                for ($i = 0; $i < $size; $i++) {
                    $buffer = array_slice($list, $i * 500, 500);
                    $user = array();
                    foreach ($buffer as $k =>$row) {
                        $row['details']= strip_tags($row['details']);
                     
                        $good=pdo_getall('wpdc_goods',array('order_id'=>$row['id']));
                        $date6='';
                        for($i=0;$i<count($good);$i++){
                            $date6 .=$good[$i]['name'].'*'.$good[$i]['number']."  ";
                        }
                        $row['goods']=$date6;
                        foreach ($keys as $key) {
                            $data5[] = $row[$key];
                        }
                        $user[] = implode("\t ,", $data5) . "\t ,";
                        unset($data5);
                    }
                    $html .= implode("\n", $user) . "\n";
                }
            }
        
        header("Content-type:text/csv");
        header("Content-Disposition:attachment; filename=菜品数据.csv");
        echo $html;
        exit();
    }

include $this->template('web/dishes2');
