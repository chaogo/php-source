<?php
namespace app\admin\controller;


class Cmenu extends Base
{
    public function get_list()
    {
        $model = $this->model;

        //排序、分页
        $model->fill_order_limit();

        //条件
        $query = function ($query){
            //关键字搜索
            $key = input('get.key');
            if ($key){
                $query->where('name','like',"%$key%")->whereOr('control','like',"%$key%")->whereOr('action','like',"%$key%");
            }
            $menugroup_id = input('get.menugroup_id');
            if ($menugroup_id){
                $query->where('menugroup_id',$menugroup_id);
            }
        };

        $list = $model->with('menugroup,menu')->where($query)->order('index','asc')->select();
        return [
            'code'=>0,
            'count'=>$model->where($query)->count(),
            'data'=>$list,
            'msg'=>'',
        ];
    }
}
