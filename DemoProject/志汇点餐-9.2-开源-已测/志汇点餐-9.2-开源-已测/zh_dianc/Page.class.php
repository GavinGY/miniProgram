<?php
   namespace Tools;
	//分页类
	class Page
	{
		public $firstRow;//每页记录的起始值
		public $listRows;//每页记录的条数
		public $totalRow;//总记录数
		public $p;//页码
		public $first;//首页
		public $last;//尾页
		public $pre;//上一页
		public $next;//下一页
		public $pre3;//前三页
		public $next3;//后三页
		public $str;// 当前页/总页数

		
		public function __construct($totalRow,$pageSize=20)
		{
			$this->totalRow = $totalRow;
			$this->listRows = $pageSize;
			
			//获得当前页的页码
			$this->p = $_GET["p"]==NULL?1:$_GET["p"];

			//设置每页记录的起始值
			$this->firstRow = ($this->p-1)*$this->listRows;
		}
		//分页栏
		public function show()
		{
			//总页数
			$totalPage = ceil($this->totalRow / $this->listRows);
			//获得当前url地址
			$url = $_SERVER["REQUEST_URI"];
			$position = strrpos($url,"/p/");
			if($position)
			{
				$url = substr($url,0,$position);
			}
			
			$this->str = "<span style='font-size: 13px;'>共{$this->totalRow}条记录&nbsp;&nbsp;&nbsp;{$this->p}/{$totalPage}</span>&nbsp;&nbsp;&nbsp;";
			
			if($this->p == 1)
			{
				$this->first =  "<span style='font-size: 13px;'>首页</span>&nbsp;&nbsp;&nbsp;";
				$this->pre=  "<span style='font-size: 13px;'>上一页</span>&nbsp;&nbsp;&nbsp;";
			}
			else 
			{
				$this->first= "<a href='{$url}/p/1'>首页</a>&nbsp;&nbsp;&nbsp;";
				$this->pre= "<a href='{$url}/p/".($this->p-1)."'>上一页</a>&nbsp;&nbsp;&nbsp;";
			}
			//pre3前三页
			for($i=3;$i>=0;$i--){
				$cur=$this->p-$i;
				if($cur>0){
				$this->pre.="<a href='{$url}/p/{$cur}'>$cur</a>&nbsp;&nbsp;&nbsp;";


			}
			}
			//后三页
			for($j=1;$j<4;$j++) {
				$cur= $this->p+$j;
				if ($cur<=$totalPage) {
					$this->pre .= "<a href='{$url}/p/{$cur}'>$cur</a>&nbsp;&nbsp;&nbsp;";


				}
			}
			
			if($this->p == $totalPage)
			{
				$this->next= "<span style='font-size: 13px;'>下一页</span>&nbsp;&nbsp;&nbsp;";
				$this->last = "<span style='font-size: 13px;'>尾页</span>";
			}
			else 
			{
				$this->next= "<a href='{$url}/p/".($this->p+1)."'>下一页</a>&nbsp;&nbsp;&nbsp;";
				$this->last= "<a href='{$url}/p/{$totalPage}'>尾页</a>";
			}
			return array(

				"str"      =>   $this->str,
			    "first"    =>   $this->first,
				"pre"      =>   $this->pre,
				"pre3"      =>   $this->pre3,
				"next3"     =>   $this->next3,
				"next"     =>   $this->next,
				"last"     =>   $this->last,
				"p"        =>   $this->p  




			);
			

		}
	}
?>






