<?php
global $_GPC, $_W;
$GLOBALS['frames'] = $this->getMainMenu();
$item=pdo_get('mzhk_sun_system',array('uniacid'=>$_W['uniacid']));

// print_r($item);die;
if(checksubmit('submit')){

    $data['uniacid']=$_W['uniacid'];
	$data['opentel']=intval($_GPC['opentel']);

    if($_GPC['id']==''){
        $res=pdo_insert('mzhk_sun_system',$data);
        if($res){
            message('添加成功',$this->createWebUrl('opentel',array()),'success');
        }else{
            message('添加失败','','error');
        }
    }else{
        $res = pdo_update('mzhk_sun_system', $data, array('id' => $_GPC['id']));
        if($res){
            message('编辑成功',$this->createWebUrl('opentel',array()),'success');
        }else{
            message('编辑失败','','error');
        }
    }
}
include $this->template('web/opentel');