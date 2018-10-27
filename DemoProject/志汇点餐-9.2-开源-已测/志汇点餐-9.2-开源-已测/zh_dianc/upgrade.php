<?php
$sql="CREATE TABLE IF NOT EXISTS `ims_wpdc_account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `weid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '所属帐号',
  `storeid` varchar(1000) NOT NULL,
  `uid` int(10) unsigned NOT NULL DEFAULT '0',
  `from_user` varchar(100) NOT NULL DEFAULT '',
  `accountname` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(200) NOT NULL DEFAULT '',
  `salt` varchar(10) NOT NULL DEFAULT '',
  `pwd` varchar(50) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pay_account` varchar(200) NOT NULL,
  `displayorder` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `dateline` int(10) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '2' COMMENT '状态',
  `role` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '1:店长,2:店员',
  `lastvisit` int(10) unsigned NOT NULL DEFAULT '0',
  `lastip` varchar(15) NOT NULL,
  `areaid` int(10) NOT NULL DEFAULT '0' COMMENT '区域id',
  `is_admin_order` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `is_notice_order` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `is_notice_queue` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `is_notice_service` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `is_notice_boss` tinyint(1) NOT NULL DEFAULT '0',
  `remark` varchar(1000) NOT NULL DEFAULT '' COMMENT '备注',
  `lat` decimal(18,10) NOT NULL DEFAULT '0.0000000000' COMMENT '经度',
  `lng` decimal(18,10) NOT NULL DEFAULT '0.0000000000' COMMENT '纬度',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logo` varchar(300) NOT NULL COMMENT '图片',
  `src` varchar(300) NOT NULL COMMENT '链接地址',
  `uniacid` varchar(50) NOT NULL,
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `orderby` int(4) NOT NULL COMMENT '排序',
  `status` int(4) NOT NULL COMMENT '状态1.启用，2禁用',
  `type` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `appid` varchar(30) NOT NULL,
  `xcx_name` varchar(30) NOT NULL,
  `title` varchar(50) NOT NULL,
  `item` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告表';
CREATE TABLE IF NOT EXISTS `ims_wpdc_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(20) NOT NULL COMMENT '区域名称',
  `num` int(11) NOT NULL COMMENT '排序',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='门店区域';
CREATE TABLE IF NOT EXISTS `ims_wpdc_assess` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `seller_id` int(11) NOT NULL COMMENT '商家ID',
  `order_id` int(11) NOT NULL COMMENT '订单ID',
  `order_num` varchar(30) NOT NULL COMMENT '订单号',
  `score` int(11) NOT NULL COMMENT '分数',
  `content` text NOT NULL COMMENT '评价内容',
  `img` varchar(1000) NOT NULL COMMENT '图片',
  `cerated_time` datetime NOT NULL COMMENT '创建时间',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `uniacid` varchar(50) NOT NULL,
  `reply` varchar(1000) NOT NULL COMMENT '商家回复',
  `status` int(4) NOT NULL COMMENT '评价状态1，未回复，2已回复',
  `reply_time` datetime NOT NULL COMMENT '回复时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_commission_withdrawal` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1.支付宝2.银行卡',
  `state` int(11) NOT NULL COMMENT '1.审核中2.通过3.拒绝',
  `time` int(11) NOT NULL COMMENT '申请时间',
  `sh_time` int(11) NOT NULL COMMENT '审核时间',
  `uniacid` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `account` varchar(100) NOT NULL,
  `tx_cost` decimal(10,2) NOT NULL COMMENT '提现金额',
  `sj_cost` decimal(10,2) NOT NULL COMMENT '实际到账金额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_continuous` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `day` int(11) NOT NULL COMMENT '天数',
  `integral` int(11) NOT NULL COMMENT '积分',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_coupons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '名称',
  `start_time` varchar(20) NOT NULL COMMENT '开始时间',
  `end_time` varchar(20) NOT NULL COMMENT '结束时间',
  `conditions` varchar(10) NOT NULL COMMENT '条件',
  `preferential` varchar(10) NOT NULL COMMENT '优惠',
  `uniacid` varchar(50) NOT NULL,
  `coupons_type` int(4) NOT NULL COMMENT '使用类型1:外卖，2店内,3都可使用',
  `instruction` varchar(300) NOT NULL COMMENT '使用说明',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_czhd` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full` int(11) NOT NULL,
  `reduction` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_czorder` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `money` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `state` int(11) NOT NULL COMMENT '1.待支付2.已支付',
  `code` varchar(100) NOT NULL,
  `form_id` varchar(100) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `time` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_dishes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `img` varchar(500) NOT NULL COMMENT '菜品图片',
  `num` int(11) NOT NULL COMMENT '数量',
  `money` decimal(10,2) NOT NULL,
  `type_id` int(11) NOT NULL COMMENT '分类id',
  `signature` int(11) NOT NULL COMMENT '1是  2否 招牌',
  `one` int(11) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `xs_num` int(11) NOT NULL COMMENT '销售数量',
  `sit_ys_num` int(11) NOT NULL COMMENT '设置月销售数量',
  `is_shelves` int(4) NOT NULL COMMENT '是否上架1是,2否',
  `dishes_type` int(4) NOT NULL COMMENT '菜品类型，2为店内，1为外卖',
  `box_fee` decimal(10,2) NOT NULL,
  `wm_money` decimal(10,2) NOT NULL,
  `details` text NOT NULL COMMENT '描述',
  `sorting` int(11) NOT NULL COMMENT '排序',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_distribution` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `user_tel` varchar(20) NOT NULL,
  `state` int(11) NOT NULL COMMENT '1.审核中2.通过3.拒绝',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_dmorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `money` decimal(10,2) NOT NULL,
  `store_id` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `time` varchar(20) NOT NULL,
  `time2` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_yue` int(11) NOT NULL DEFAULT '2',
  `form_id` varchar(100) NOT NULL,
  `code` varchar(200) NOT NULL,
  `state` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_dyj` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dyj_title` varchar(50) NOT NULL COMMENT '打印机标题',
  `dyj_id` varchar(50) NOT NULL COMMENT '打印机编号',
  `dyj_key` varchar(50) NOT NULL COMMENT '打印机key',
  `uniacid` varchar(50) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1.365  2.易联云',
  `name` varchar(20) NOT NULL COMMENT '打印机名称',
  `mid` varchar(100) NOT NULL COMMENT '打印机终端号',
  `api` varchar(100) NOT NULL COMMENT 'API密钥',
  `store_id` int(11) NOT NULL,
  `state` int(11) NOT NULL COMMENT '1开启2关闭',
  `location` int(11) NOT NULL COMMENT '1..前台 2后厨',
  `yy_id` varchar(20) NOT NULL COMMENT '用户id',
  `token` varchar(50) NOT NULL COMMENT '打印机终端密钥',
  `dyj_title2` varchar(50) NOT NULL,
  `dyj_id2` varchar(50) NOT NULL,
  `dyj_key2` varchar(50) NOT NULL,
  `num` int(11) NOT NULL DEFAULT '1',
  `fezh` varchar(40) NOT NULL,
  `fe_ukey` varchar(50) NOT NULL,
  `fe_dycode` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_earnings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `son_id` int(11) NOT NULL COMMENT '下线',
  `money` decimal(10,2) NOT NULL,
  `time` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_fxset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fx_details` text NOT NULL COMMENT '分销商申请协议',
  `tx_details` text NOT NULL COMMENT '佣金提现协议',
  `is_fx` int(11) NOT NULL COMMENT '1.开启分销审核2.不开启',
  `is_ej` int(11) NOT NULL COMMENT '是否开启二级分销1.是2.否',
  `tx_rate` int(11) NOT NULL COMMENT '提现手续费',
  `commission` varchar(10) NOT NULL COMMENT '一级佣金',
  `commission2` varchar(10) NOT NULL COMMENT '二级佣金',
  `tx_money` int(11) NOT NULL COMMENT '提现门槛',
  `img` varchar(100) NOT NULL,
  `img2` varchar(100) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `is_open` int(11) NOT NULL DEFAULT '1' COMMENT '1.开启2关闭',
  `instructions` text NOT NULL COMMENT '分销商说明',
  `is_type` int(11) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_fxuser` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '一级分销',
  `fx_user` int(11) NOT NULL COMMENT '二级分销',
  `time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_goods` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `img` varchar(300) NOT NULL COMMENT '商品图片',
  `number` int(11) NOT NULL COMMENT '数量',
  `order_id` int(11) NOT NULL COMMENT '订单id',
  `name` varchar(50) NOT NULL COMMENT '商品名称',
  `money` decimal(10,2) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `dishes_id` int(11) NOT NULL COMMENT '菜品id',
  `spec` varchar(20) NOT NULL COMMENT '规格',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_help` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(200) NOT NULL COMMENT '标题',
  `answer` text NOT NULL COMMENT '回答',
  `sort` int(4) NOT NULL COMMENT '排序',
  `uniacid` varchar(50) NOT NULL,
  `created_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_integral` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `score` int(11) NOT NULL COMMENT '分数',
  `type` int(4) NOT NULL COMMENT '1加,2减',
  `order_id` int(11) NOT NULL COMMENT '订单id',
  `cerated_time` datetime NOT NULL COMMENT '创建时间',
  `uniacid` varchar(50) NOT NULL,
  `note` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_jfgoods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  `img` varchar(100) NOT NULL,
  `money` int(11) NOT NULL COMMENT '价格',
  `type_id` int(11) NOT NULL COMMENT '分类id',
  `goods_details` text NOT NULL,
  `process_details` text NOT NULL,
  `attention_details` text NOT NULL,
  `number` int(11) NOT NULL COMMENT '数量',
  `time` varchar(50) NOT NULL COMMENT '期限',
  `is_open` int(11) NOT NULL COMMENT '1.开启2关闭',
  `type` int(11) NOT NULL COMMENT '1.余额2.实物',
  `num` int(11) NOT NULL COMMENT '排序',
  `uniacid` int(11) NOT NULL,
  `hb_moeny` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_jfrecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `good_id` int(11) NOT NULL COMMENT '商品id',
  `time` varchar(20) NOT NULL COMMENT '兑换时间',
  `user_name` varchar(20) NOT NULL COMMENT '用户地址',
  `user_tel` varchar(20) NOT NULL COMMENT '用户电话',
  `address` varchar(200) NOT NULL COMMENT '地址',
  `note` varchar(20) NOT NULL,
  `integral` int(11) NOT NULL COMMENT '积分',
  `good_name` varchar(50) NOT NULL,
  `good_img` varchar(100) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_jftype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `img` varchar(100) NOT NULL,
  `num` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='积分商城分类';
CREATE TABLE IF NOT EXISTS `ims_wpdc_kfwset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL COMMENT '门店ID',
  `user_id` int(11) NOT NULL COMMENT '商户id',
  `access_token` varchar(50) NOT NULL COMMENT '用户授权token',
  `openid` varchar(20) NOT NULL COMMENT '新商户ID',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='快服务设置表';
CREATE TABLE IF NOT EXISTS `ims_wpdc_order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `order_num` varchar(20) NOT NULL COMMENT '订单号',
  `state` int(11) NOT NULL COMMENT '状态 1.待付款 2.等待接单 3.等待送达  4.完成',
  `time` varchar(20) NOT NULL COMMENT '下单时间',
  `pay_time` int(11) NOT NULL COMMENT '付款时间',
  `money` decimal(10,2) NOT NULL,
  `preferential` varchar(10) NOT NULL COMMENT '优惠',
  `tel` varchar(20) NOT NULL COMMENT '客户电话',
  `name` varchar(20) NOT NULL COMMENT '客户姓名',
  `address` varchar(200) NOT NULL,
  `delivery_time` varchar(20) NOT NULL COMMENT '送达时间',
  `time2` int(11) NOT NULL,
  `cancel_time` int(11) NOT NULL COMMENT '取消时间',
  `uniacid` varchar(50) NOT NULL,
  `type` int(4) NOT NULL COMMENT '订单类型1外卖，2店内',
  `dn_state` int(4) NOT NULL COMMENT '店内订单状态1,待支付，2已完成,3关闭订单',
  `table_id` int(11) NOT NULL COMMENT '桌台ID',
  `freight` decimal(10,2) NOT NULL COMMENT '配送费',
  `box_fee` decimal(10,2) NOT NULL COMMENT '餐盒费',
  `coupons_id` int(11) NOT NULL COMMENT '优惠劵ID',
  `voucher_id` int(11) NOT NULL COMMENT '代金劵ID',
  `seller_id` int(11) NOT NULL COMMENT '商家ID',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `area` varchar(20) NOT NULL,
  `lat` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `del` int(11) NOT NULL DEFAULT '2' COMMENT '1.删除  2.未删除',
  `sh_ordernum` varchar(50) NOT NULL,
  `pay_type` int(11) NOT NULL COMMENT '1.线上2.线下',
  `del2` int(11) NOT NULL,
  `is_take` int(11) NOT NULL COMMENT '1.自取 2.不自取',
  `is_yue` int(11) NOT NULL COMMENT '1.余额 2.',
  `completion_time` int(11) NOT NULL COMMENT '完成时间',
  `form_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_qbmx` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `money` decimal(10,2) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1.加2减',
  `note` varchar(20) NOT NULL COMMENT '备注',
  `time` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_reduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '活动名称',
  `full` int(11) NOT NULL COMMENT '满',
  `reduction` int(11) NOT NULL COMMENT '减',
  `type` int(11) NOT NULL COMMENT '1.外卖 2.店内 3.外卖+店内',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_rrset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL COMMENT '门店id',
  `username` varchar(30) NOT NULL COMMENT '账号',
  `appkey` varchar(50) NOT NULL COMMENT 'key',
  `is_open` int(11) NOT NULL DEFAULT '1' COMMENT '是否开启1是,2否',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_ruzhu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_name` varchar(20) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `img` varchar(100) NOT NULL,
  `state` int(11) NOT NULL COMMENT '1.待审核 2.通过 3.拒绝',
  `user_id` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `address` varchar(200) NOT NULL,
  `sp_img` varchar(100) NOT NULL,
  `sfz_img` varchar(100) NOT NULL,
  `sfz_img2` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_seller` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(30) NOT NULL,
  `pwd` varchar(50) NOT NULL,
  `cerated_time` datetime NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `store_id` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_signlist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `time` varchar(20) NOT NULL COMMENT '签到时间',
  `time2` int(11) NOT NULL,
  `integral` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_signset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `one` int(11) NOT NULL COMMENT '首次奖励积分',
  `integral` int(11) NOT NULL COMMENT '每天签到积分',
  `is_open` int(11) NOT NULL COMMENT '1.开启2.关闭  签到',
  `is_bq` int(11) NOT NULL COMMENT '1.开启2.关闭  补签',
  `bq_integral` int(11) NOT NULL COMMENT '补签扣除积分',
  `details` text NOT NULL COMMENT '签到说明',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_sms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `model` varchar(30) NOT NULL COMMENT '支付订单通知模板',
  `model2` varchar(30) NOT NULL COMMENT '预约通知模板',
  `tel` varchar(20) NOT NULL,
  `tid` varchar(100) NOT NULL,
  `signature` varchar(200) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `yy_tid` varchar(50) NOT NULL COMMENT '预约模板ID',
  `dm_tid` varchar(50) NOT NULL COMMENT '当面付模板ID',
  `store_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `appkey` varchar(100) NOT NULL COMMENT '应用key(聚合)',
  `tpl_id` int(11) NOT NULL COMMENT '模板id(聚合)',
  `tpl2_id` int(11) NOT NULL,
  `is_wmsms` int(11) NOT NULL DEFAULT '1',
  `is_yysms` int(11) NOT NULL DEFAULT '1',
  `is_dnsms` int(11) NOT NULL DEFAULT '1',
  `tpl3_id` int(11) NOT NULL,
  `sj_tid` varchar(50) NOT NULL,
  `sj_tid2` varchar(50) NOT NULL,
  `wx_appid` varchar(20) NOT NULL,
  `wx_secret` varchar(50) NOT NULL,
  `sj_openid` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_spec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL COMMENT '商品ID',
  `name` varchar(50) NOT NULL COMMENT '规格名称',
  `cost` decimal(10,2) NOT NULL COMMENT '价格',
  `num` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_special` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `day` varchar(20) NOT NULL COMMENT '日期',
  `integral` int(11) NOT NULL COMMENT '积分',
  `title` varchar(20) NOT NULL COMMENT '标题说明',
  `color` varchar(20) NOT NULL COMMENT '颜色',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_store` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '商家名称',
  `address` varchar(500) NOT NULL COMMENT '商家地址',
  `time` varchar(100) NOT NULL COMMENT '营业时间',
  `tel` varchar(20) NOT NULL COMMENT '电话',
  `announcement` varchar(500) NOT NULL COMMENT '公告',
  `conditions` varchar(10) NOT NULL COMMENT '条件',
  `preferential` varchar(10) NOT NULL COMMENT '优惠',
  `support` varchar(500) NOT NULL COMMENT '支持',
  `is_rest` int(11) NOT NULL COMMENT '是否休息(1 是  2否)',
  `img` text NOT NULL COMMENT '商家图片',
  `start_at` varchar(20) NOT NULL COMMENT '起送价',
  `freight` varchar(20) NOT NULL COMMENT '配送费',
  `logo` varchar(200) NOT NULL COMMENT '店铺logo',
  `details` text NOT NULL,
  `bgimg` text NOT NULL COMMENT '商家背景图片',
  `time2` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `xyh_money` decimal(10,2) NOT NULL COMMENT '新用户立减金额',
  `xyh_open` int(4) NOT NULL COMMENT '是否开启新用户立减1是2否',
  `integral` int(11) NOT NULL COMMENT ' 积分 (设置评价获取积分)',
  `coordinates` varchar(50) NOT NULL COMMENT '经纬度',
  `distance` varchar(100) NOT NULL COMMENT '配送距离单位米',
  `is_yy` int(4) NOT NULL COMMENT '是否预约1是',
  `is_wm` int(4) NOT NULL COMMENT '是否外卖1是',
  `is_dn` int(4) NOT NULL COMMENT '是否店内1是',
  `is_sy` int(4) NOT NULL COMMENT '是否收银1是',
  `is_pd` int(4) NOT NULL COMMENT '是否排队1是',
  `ps_mode` int(4) NOT NULL COMMENT '配送方式 1.蜂鸟，2商家',
  `bq_logo` varchar(100) NOT NULL,
  `is_display` int(4) NOT NULL COMMENT '幻灯片是否显示,1是，2否',
  `yyzz` text NOT NULL COMMENT '营业资质',
  `environment` text NOT NULL COMMENT '商家环境',
  `sd_time` varchar(20) NOT NULL COMMENT '配送时间',
  `md_logo` varchar(200) NOT NULL COMMENT '门店logo',
  `md_name` varchar(50) NOT NULL COMMENT '门店名称',
  `md_area` int(11) NOT NULL COMMENT '门店区域id',
  `md_type` int(11) NOT NULL COMMENT '门店类型id',
  `md_content` varchar(300) NOT NULL COMMENT '门店简介',
  `number` int(11) NOT NULL,
  `score` decimal(10,1) NOT NULL,
  `sales` int(11) NOT NULL COMMENT '销量',
  `is_jd` int(11) NOT NULL COMMENT '1自动接单  2.手动接单',
  `jd_time` int(11) NOT NULL COMMENT '自动接单时间',
  `source_id` int(11) NOT NULL COMMENT '商家',
  `shop_no` varchar(20) NOT NULL COMMENT '门店编号',
  `is_mp3` int(11) NOT NULL COMMENT '1.开启 2.关闭',
  `is_video` int(11) NOT NULL COMMENT '1.开启 2.关闭',
  `store_mp3` text NOT NULL,
  `store_video` text NOT NULL,
  `is_yypay` int(11) NOT NULL COMMENT '是否开启预约付款1.是2.否',
  `yy_name` varchar(20) NOT NULL COMMENT '预约文本',
  `yy_img` varchar(100) NOT NULL COMMENT '预约图片',
  `wm_name` varchar(20) NOT NULL COMMENT '外卖文本',
  `wm_img` varchar(100) NOT NULL,
  `dn_name` varchar(20) NOT NULL COMMENT '店内文本',
  `dn_img` varchar(100) NOT NULL,
  `sy_name` varchar(20) NOT NULL COMMENT '收银文本',
  `sy_img` varchar(100) NOT NULL,
  `pd_name` varchar(20) NOT NULL COMMENT '优惠券文本',
  `pd_img` varchar(100) NOT NULL,
  `box_name` varchar(20) NOT NULL,
  `storecode` varchar(200) NOT NULL,
  `is_czztpd` int(11) NOT NULL DEFAULT '1' COMMENT '是否开启餐桌状态判断',
  `is_chzf` int(11) DEFAULT '1' COMMENT '是否开启餐后支付',
  `time3` varchar(20) NOT NULL,
  `time4` varchar(20) NOT NULL,
  `hb_img` varchar(100) NOT NULL,
  `is_open` int(11) NOT NULL DEFAULT '1',
  `is_jf` int(11) NOT NULL DEFAULT '1',
  `is_wmjf` int(11) NOT NULL DEFAULT '1',
  `is_yyjf` int(11) NOT NULL DEFAULT '1',
  `is_dnjf` int(11) NOT NULL DEFAULT '1',
  `is_dmjf` int(11) NOT NULL DEFAULT '1',
  `poundage` varchar(20) NOT NULL,
  `is_jfpay` int(11) NOT NULL DEFAULT '1',
  `is_yuejf` int(11) NOT NULL DEFAULT '1',
  `integral2` int(11) NOT NULL,
  `is_yue` int(11) NOT NULL DEFAULT '1',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_storetype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `num` int(11) NOT NULL,
  `img` varchar(200) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `commission` int(11) NOT NULL,
  `commission2` int(11) NOT NULL,
  `poundage` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_system` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `appid` varchar(100) NOT NULL COMMENT 'appid',
  `appsecret` varchar(200) NOT NULL COMMENT 'appsecret',
  `link` varchar(200) NOT NULL COMMENT '网址',
  `mchid` varchar(20) NOT NULL COMMENT '商户号',
  `wxkey` varchar(100) NOT NULL COMMENT '商户秘钥',
  `uniacid` varchar(50) NOT NULL,
  `url_name` varchar(20) NOT NULL COMMENT '网址名称',
  `details` text NOT NULL COMMENT '关于我们',
  `url_logo` varchar(100) NOT NULL COMMENT '网址logo',
  `bq_name` varchar(50) NOT NULL COMMENT '版权名称',
  `link_name` varchar(30) NOT NULL COMMENT '网站名称',
  `link_logo` varchar(100) NOT NULL COMMENT '网站logo',
  `more` int(11) NOT NULL DEFAULT '1',
  `default_store` int(11) NOT NULL COMMENT '默认门店id',
  `support` varchar(20) NOT NULL COMMENT '技术支持',
  `bq_logo` varchar(100) NOT NULL,
  `color` varchar(20) NOT NULL,
  `map_key` varchar(100) NOT NULL COMMENT '腾讯地图key',
  `tz_appid` varchar(30) NOT NULL,
  `tz_name` varchar(30) NOT NULL,
  `pt_name` varchar(30) NOT NULL COMMENT '平台名称',
  `dada_key` varchar(50) NOT NULL COMMENT '达达key',
  `dada_secret` varchar(50) NOT NULL COMMENT '达达secret',
  `apiclient_cert` text NOT NULL,
  `apiclient_key` text NOT NULL,
  `day` int(11) NOT NULL COMMENT '天数',
  `username` varchar(20) NOT NULL COMMENT '邮箱用户名',
  `password` varchar(50) NOT NULL COMMENT '邮箱密码',
  `type` varchar(10) NOT NULL COMMENT '邮箱类型',
  `sender` varchar(50) NOT NULL COMMENT '发件人名称',
  `signature` varchar(200) NOT NULL COMMENT '邮件签名',
  `is_email` int(11) NOT NULL COMMENT '1开启  2关闭',
  `tx_money` decimal(10,2) NOT NULL COMMENT '最低提现金额',
  `tx_rate` int(11) NOT NULL COMMENT '手续费',
  `tx_details` text NOT NULL COMMENT '提现详情',
  `tel` varchar(20) NOT NULL COMMENT '平台电话',
  `dc_name` varchar(20) NOT NULL COMMENT '点餐文本',
  `wm_name` varchar(20) NOT NULL COMMENT '外卖文本',
  `yd_name` varchar(20) NOT NULL COMMENT '预定文本',
  `typeset` int(11) NOT NULL COMMENT '1开启  2.关闭(分类)',
  `integral` int(11) NOT NULL COMMENT '评论得积分',
  `cjwt` text NOT NULL,
  `rzxy` text NOT NULL,
  `is_ruzhu` int(11) NOT NULL COMMENT '1.开启2关闭',
  `is_yue` int(11) NOT NULL DEFAULT '1',
  `integral2` int(11) NOT NULL COMMENT '消费得积分',
  `is_jf` int(11) NOT NULL DEFAULT '1' COMMENT '1开启2关闭',
  `is_jfpay` int(11) NOT NULL DEFAULT '1',
  `jf_proportion` int(11) NOT NULL DEFAULT '1',
  `is_zfb` int(11) NOT NULL DEFAULT '1',
  `is_yhk` int(11) NOT NULL DEFAULT '1',
  `is_wx` int(11) NOT NULL DEFAULT '1',
  `ip` varchar(30) NOT NULL,
  `jfgn` int(11) NOT NULL DEFAULT '1',
  `fxgn` int(11) NOT NULL DEFAULT '1',
  `msgn` int(11) NOT NULL DEFAULT '1',
  `is_img` int(11) NOT NULL DEFAULT '2',
  `is_psxx` int(11) NOT NULL DEFAULT '2',
  `kfw_appid` varchar(30) NOT NULL,
  `kfw_appsecret` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '桌台号',
  `num` int(4) NOT NULL COMMENT '就餐人数',
  `type_id` varchar(50) NOT NULL COMMENT '桌台类型ID',
  `tag` varchar(50) NOT NULL COMMENT '标签',
  `orderby` int(11) NOT NULL COMMENT '排序',
  `status` int(4) NOT NULL COMMENT '状态，0 空闲，1开台，2已下单，3已支付',
  `uniacid` varchar(50) NOT NULL COMMENT '公众号ID',
  `store_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_table_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名字',
  `fw_cost` decimal(10,2) NOT NULL COMMENT '服务费',
  `zd_cost` decimal(10,2) NOT NULL COMMENT '最低消费',
  `yd_cost` decimal(10,2) NOT NULL COMMENT '预付款',
  `num` int(11) NOT NULL COMMENT '数量',
  `orderby` int(11) NOT NULL,
  `ss_seller` varchar(50) NOT NULL COMMENT '所属商家',
  `seller_id` int(11) NOT NULL COMMENT '商家id',
  `uniacid` varchar(50) NOT NULL COMMENT '公众号ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_traffic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `time` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商家访问量';
CREATE TABLE IF NOT EXISTS `ims_wpdc_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL COMMENT '分类名称',
  `uniacid` varchar(50) NOT NULL,
  `order_by` int(4) NOT NULL,
  `store_id` int(11) NOT NULL COMMENT '商家id',
  `is_open` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `join_time` int(11) NOT NULL,
  `img` varchar(500) NOT NULL,
  `openid` varchar(200) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `user_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `user_tel` varchar(50) NOT NULL COMMENT '收货人电话',
  `user_address` varchar(100) NOT NULL COMMENT '收货人地址',
  `total_score` int(11) NOT NULL,
  `wallet` decimal(10,2) NOT NULL COMMENT '钱包',
  `commission` decimal(10,2) NOT NULL,
  `day` int(11) NOT NULL,
  `order_money` decimal(10,2) NOT NULL,
  `order_number` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_usercoupons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `coupons_id` int(11) NOT NULL COMMENT '优惠券id',
  `state` int(11) NOT NULL COMMENT '1使用  2未使用',
  `uniacid` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_uservoucher` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `vouchers_id` int(11) NOT NULL COMMENT '代金券id',
  `state` int(11) NOT NULL COMMENT '1使用  2未使用',
  `uniacid` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_uuset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL COMMENT '门店id',
  `appid` varchar(50) NOT NULL,
  `appkey` varchar(50) NOT NULL,
  `account` varchar(30) NOT NULL,
  `OpenId` varchar(50) NOT NULL,
  `uniacid` varchar(50) NOT NULL,
  `is_open` int(4) NOT NULL DEFAULT '2' COMMENT '1开启,2关闭(uu跑腿)',
  `is_check` int(4) NOT NULL COMMENT '1自动,2手动确认订单价格',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_voucher` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '名称',
  `start_time` varchar(20) NOT NULL COMMENT '开始时间',
  `end_time` varchar(20) NOT NULL COMMENT '结束时间',
  `preferential` varchar(10) NOT NULL COMMENT '优惠',
  `uniacid` varchar(50) NOT NULL,
  `voucher_type` int(4) NOT NULL COMMENT '使用类型1:外卖，2店内,3都可使用',
  `instruction` varchar(300) NOT NULL COMMENT '使用说明',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_withdrawal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL COMMENT '真实姓名',
  `username` varchar(100) NOT NULL COMMENT '账号',
  `type` int(11) NOT NULL COMMENT '1支付宝 2.微信 3.银行',
  `time` varchar(20) NOT NULL COMMENT '申请时间',
  `sh_time` varchar(20) NOT NULL COMMENT '审核时间',
  `state` int(11) NOT NULL COMMENT '1.待审核 2.通过  3.拒绝',
  `tx_cost` decimal(10,2) NOT NULL COMMENT '提现金额',
  `sj_cost` decimal(10,2) NOT NULL COMMENT '实际金额',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  `uniacid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `ims_wpdc_ydorder` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `xz_date` varchar(30) NOT NULL COMMENT '选择日期',
  `yjdd_date` varchar(30) NOT NULL COMMENT '预计到店时间',
  `table_type_id` int(11) NOT NULL COMMENT '桌位类型ID',
  `link_name` varchar(50) NOT NULL COMMENT '联系人',
  `link_tel` varchar(50) NOT NULL COMMENT '联系电话',
  `jc_num` int(4) NOT NULL COMMENT '就餐人数',
  `remark` varchar(500) NOT NULL COMMENT '备注',
  `state` int(4) NOT NULL COMMENT '状态 1,待审核，2已审核,3已拒绝,4取消',
  `uniacid` varchar(50) NOT NULL,
  `created_time` varchar(30) NOT NULL COMMENT '创建时间',
  `time2` int(11) NOT NULL COMMENT '时间撮',
  `order_num` varchar(30) NOT NULL COMMENT '订单号',
  `table_type_name` varchar(50) NOT NULL COMMENT '桌台类型名称',
  `store_id` int(11) NOT NULL COMMENT '商家id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `zd_cost` decimal(10,2) NOT NULL COMMENT '最低消费',
  `pay_money` decimal(10,2) NOT NULL COMMENT '付款金额',
  `ydcode` varchar(100) NOT NULL COMMENT '商户订单号',
  `del` int(11) NOT NULL COMMENT '1.删除 2.未删除',
  `is_yue` int(11) NOT NULL DEFAULT '2',
  `completion_time` int(11) NOT NULL COMMENT '完成时间',
  `form_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
";
pdo_run($sql);
if(!pdo_fieldexists('wpdc_account',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `id` int(10) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_account',  'weid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `weid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '所属帐号';");
}
if(!pdo_fieldexists('wpdc_account',  'storeid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `storeid` varchar(1000) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'uid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `uid` int(10) unsigned NOT NULL DEFAULT '0';");
}
if(!pdo_fieldexists('wpdc_account',  'from_user')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `from_user` varchar(100) NOT NULL DEFAULT '';");
}
if(!pdo_fieldexists('wpdc_account',  'accountname')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `accountname` varchar(50) NOT NULL DEFAULT '';");
}
if(!pdo_fieldexists('wpdc_account',  'password')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `password` varchar(200) NOT NULL DEFAULT '';");
}
if(!pdo_fieldexists('wpdc_account',  'salt')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `salt` varchar(10) NOT NULL DEFAULT '';");
}
if(!pdo_fieldexists('wpdc_account',  'pwd')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `pwd` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'mobile')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `mobile` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'email')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `email` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'username')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `username` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'pay_account')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `pay_account` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'displayorder')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `displayorder` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_account',  'dateline')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `dateline` int(10) unsigned NOT NULL DEFAULT '0';");
}
if(!pdo_fieldexists('wpdc_account',  'status')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `status` tinyint(1) unsigned NOT NULL DEFAULT '2' COMMENT '状态';");
}
if(!pdo_fieldexists('wpdc_account',  'role')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `role` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '1:店长,2:店员';");
}
if(!pdo_fieldexists('wpdc_account',  'lastvisit')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `lastvisit` int(10) unsigned NOT NULL DEFAULT '0';");
}
if(!pdo_fieldexists('wpdc_account',  'lastip')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `lastip` varchar(15) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_account',  'areaid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `areaid` int(10) NOT NULL DEFAULT '0' COMMENT '区域id';");
}
if(!pdo_fieldexists('wpdc_account',  'is_admin_order')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `is_admin_order` tinyint(1) unsigned NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_account',  'is_notice_order')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `is_notice_order` tinyint(1) unsigned NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_account',  'is_notice_queue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `is_notice_queue` tinyint(1) unsigned NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_account',  'is_notice_service')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `is_notice_service` tinyint(1) unsigned NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_account',  'is_notice_boss')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `is_notice_boss` tinyint(1) NOT NULL DEFAULT '0';");
}
if(!pdo_fieldexists('wpdc_account',  'remark')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `remark` varchar(1000) NOT NULL DEFAULT '' COMMENT '备注';");
}
if(!pdo_fieldexists('wpdc_account',  'lat')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `lat` decimal(18,10) NOT NULL DEFAULT '0.0000000000' COMMENT '经度';");
}
if(!pdo_fieldexists('wpdc_account',  'lng')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_account')." ADD `lng` decimal(18,10) NOT NULL DEFAULT '0.0000000000' COMMENT '纬度';");
}
if(!pdo_fieldexists('wpdc_ad',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_ad',  'logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `logo` varchar(300) NOT NULL COMMENT '图片';");
}
if(!pdo_fieldexists('wpdc_ad',  'src')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `src` varchar(300) NOT NULL COMMENT '链接地址';");
}
if(!pdo_fieldexists('wpdc_ad',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'created_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `created_time` datetime NOT NULL COMMENT '创建时间';");
}
if(!pdo_fieldexists('wpdc_ad',  'orderby')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `orderby` int(4) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_ad',  'status')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `status` int(4) NOT NULL COMMENT '状态1.启用，2禁用';");
}
if(!pdo_fieldexists('wpdc_ad',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `type` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `appid` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'xcx_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `xcx_name` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'title')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `title` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ad',  'item')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ad')." ADD `item` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_area',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_area')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_area',  'area_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_area')." ADD `area_name` varchar(20) NOT NULL COMMENT '区域名称';");
}
if(!pdo_fieldexists('wpdc_area',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_area')." ADD `num` int(11) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_area',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_area')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_assess',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_assess',  'seller_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `seller_id` int(11) NOT NULL COMMENT '商家ID';");
}
if(!pdo_fieldexists('wpdc_assess',  'order_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `order_id` int(11) NOT NULL COMMENT '订单ID';");
}
if(!pdo_fieldexists('wpdc_assess',  'order_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `order_num` varchar(30) NOT NULL COMMENT '订单号';");
}
if(!pdo_fieldexists('wpdc_assess',  'score')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `score` int(11) NOT NULL COMMENT '分数';");
}
if(!pdo_fieldexists('wpdc_assess',  'content')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `content` text NOT NULL COMMENT '评价内容';");
}
if(!pdo_fieldexists('wpdc_assess',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `img` varchar(1000) NOT NULL COMMENT '图片';");
}
if(!pdo_fieldexists('wpdc_assess',  'cerated_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `cerated_time` datetime NOT NULL COMMENT '创建时间';");
}
if(!pdo_fieldexists('wpdc_assess',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `user_id` int(11) NOT NULL COMMENT '用户ID';");
}
if(!pdo_fieldexists('wpdc_assess',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_assess',  'reply')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `reply` varchar(1000) NOT NULL COMMENT '商家回复';");
}
if(!pdo_fieldexists('wpdc_assess',  'status')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `status` int(4) NOT NULL COMMENT '评价状态1，未回复，2已回复';");
}
if(!pdo_fieldexists('wpdc_assess',  'reply_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_assess')." ADD `reply_time` datetime NOT NULL COMMENT '回复时间';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `type` int(11) NOT NULL COMMENT '1.支付宝2.银行卡';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `state` int(11) NOT NULL COMMENT '1.审核中2.通过3.拒绝';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `time` int(11) NOT NULL COMMENT '申请时间';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'sh_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `sh_time` int(11) NOT NULL COMMENT '审核时间';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `user_name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'account')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `account` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'tx_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `tx_cost` decimal(10,2) NOT NULL COMMENT '提现金额';");
}
if(!pdo_fieldexists('wpdc_commission_withdrawal',  'sj_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_commission_withdrawal')." ADD `sj_cost` decimal(10,2) NOT NULL COMMENT '实际到账金额';");
}
if(!pdo_fieldexists('wpdc_continuous',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_continuous')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_continuous',  'day')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_continuous')." ADD `day` int(11) NOT NULL COMMENT '天数';");
}
if(!pdo_fieldexists('wpdc_continuous',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_continuous')." ADD `integral` int(11) NOT NULL COMMENT '积分';");
}
if(!pdo_fieldexists('wpdc_continuous',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_continuous')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_coupons',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_coupons',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `name` varchar(20) NOT NULL COMMENT '名称';");
}
if(!pdo_fieldexists('wpdc_coupons',  'start_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `start_time` varchar(20) NOT NULL COMMENT '开始时间';");
}
if(!pdo_fieldexists('wpdc_coupons',  'end_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `end_time` varchar(20) NOT NULL COMMENT '结束时间';");
}
if(!pdo_fieldexists('wpdc_coupons',  'conditions')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `conditions` varchar(10) NOT NULL COMMENT '条件';");
}
if(!pdo_fieldexists('wpdc_coupons',  'preferential')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `preferential` varchar(10) NOT NULL COMMENT '优惠';");
}
if(!pdo_fieldexists('wpdc_coupons',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_coupons',  'coupons_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `coupons_type` int(4) NOT NULL COMMENT '使用类型1:外卖，2店内,3都可使用';");
}
if(!pdo_fieldexists('wpdc_coupons',  'instruction')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `instruction` varchar(300) NOT NULL COMMENT '使用说明';");
}
if(!pdo_fieldexists('wpdc_coupons',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_coupons')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_czhd',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czhd')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_czhd',  'full')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czhd')." ADD `full` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czhd',  'reduction')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czhd')." ADD `reduction` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czhd',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czhd')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_czorder',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `state` int(11) NOT NULL COMMENT '1.待支付2.已支付';");
}
if(!pdo_fieldexists('wpdc_czorder',  'code')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `code` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'form_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `form_id` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_czorder',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_czorder')." ADD `time` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_dishes',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `name` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `img` varchar(500) NOT NULL COMMENT '菜品图片';");
}
if(!pdo_fieldexists('wpdc_dishes',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `num` int(11) NOT NULL COMMENT '数量';");
}
if(!pdo_fieldexists('wpdc_dishes',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'type_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `type_id` int(11) NOT NULL COMMENT '分类id';");
}
if(!pdo_fieldexists('wpdc_dishes',  'signature')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `signature` int(11) NOT NULL COMMENT '1是  2否 招牌';");
}
if(!pdo_fieldexists('wpdc_dishes',  'one')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `one` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'xs_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `xs_num` int(11) NOT NULL COMMENT '销售数量';");
}
if(!pdo_fieldexists('wpdc_dishes',  'sit_ys_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `sit_ys_num` int(11) NOT NULL COMMENT '设置月销售数量';");
}
if(!pdo_fieldexists('wpdc_dishes',  'is_shelves')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `is_shelves` int(4) NOT NULL COMMENT '是否上架1是,2否';");
}
if(!pdo_fieldexists('wpdc_dishes',  'dishes_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `dishes_type` int(4) NOT NULL COMMENT '菜品类型，2为店内，1为外卖';");
}
if(!pdo_fieldexists('wpdc_dishes',  'box_fee')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `box_fee` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'wm_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `wm_money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dishes',  'details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `details` text NOT NULL COMMENT '描述';");
}
if(!pdo_fieldexists('wpdc_dishes',  'sorting')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `sorting` int(11) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_dishes',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dishes')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_distribution',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_distribution',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_distribution',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `time` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_distribution',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `user_name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_distribution',  'user_tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `user_tel` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_distribution',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `state` int(11) NOT NULL COMMENT '1.审核中2.通过3.拒绝';");
}
if(!pdo_fieldexists('wpdc_distribution',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_distribution')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `time` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'time2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `time2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'is_yue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `is_yue` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_dmorder',  'form_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `form_id` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'code')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `code` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dmorder',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dmorder')." ADD `state` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_title')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_title` varchar(50) NOT NULL COMMENT '打印机标题';");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_id` varchar(50) NOT NULL COMMENT '打印机编号';");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_key')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_key` varchar(50) NOT NULL COMMENT '打印机key';");
}
if(!pdo_fieldexists('wpdc_dyj',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `type` int(11) NOT NULL COMMENT '1.365  2.易联云';");
}
if(!pdo_fieldexists('wpdc_dyj',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `name` varchar(20) NOT NULL COMMENT '打印机名称';");
}
if(!pdo_fieldexists('wpdc_dyj',  'mid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `mid` varchar(100) NOT NULL COMMENT '打印机终端号';");
}
if(!pdo_fieldexists('wpdc_dyj',  'api')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `api` varchar(100) NOT NULL COMMENT 'API密钥';");
}
if(!pdo_fieldexists('wpdc_dyj',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `state` int(11) NOT NULL COMMENT '1开启2关闭';");
}
if(!pdo_fieldexists('wpdc_dyj',  'location')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `location` int(11) NOT NULL COMMENT '1..前台 2后厨';");
}
if(!pdo_fieldexists('wpdc_dyj',  'yy_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `yy_id` varchar(20) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_dyj',  'token')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `token` varchar(50) NOT NULL COMMENT '打印机终端密钥';");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_title2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_title2` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_id2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_id2` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'dyj_key2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `dyj_key2` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `num` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_dyj',  'fezh')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `fezh` varchar(40) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'fe_ukey')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `fe_ukey` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_dyj',  'fe_dycode')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_dyj')." ADD `fe_dycode` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_earnings',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_earnings',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_earnings',  'son_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `son_id` int(11) NOT NULL COMMENT '下线';");
}
if(!pdo_fieldexists('wpdc_earnings',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_earnings',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `time` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_earnings',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_earnings')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_fxset',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_fxset',  'fx_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `fx_details` text NOT NULL COMMENT '分销商申请协议';");
}
if(!pdo_fieldexists('wpdc_fxset',  'tx_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `tx_details` text NOT NULL COMMENT '佣金提现协议';");
}
if(!pdo_fieldexists('wpdc_fxset',  'is_fx')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `is_fx` int(11) NOT NULL COMMENT '1.开启分销审核2.不开启';");
}
if(!pdo_fieldexists('wpdc_fxset',  'is_ej')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `is_ej` int(11) NOT NULL COMMENT '是否开启二级分销1.是2.否';");
}
if(!pdo_fieldexists('wpdc_fxset',  'tx_rate')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `tx_rate` int(11) NOT NULL COMMENT '提现手续费';");
}
if(!pdo_fieldexists('wpdc_fxset',  'commission')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `commission` varchar(10) NOT NULL COMMENT '一级佣金';");
}
if(!pdo_fieldexists('wpdc_fxset',  'commission2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `commission2` varchar(10) NOT NULL COMMENT '二级佣金';");
}
if(!pdo_fieldexists('wpdc_fxset',  'tx_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `tx_money` int(11) NOT NULL COMMENT '提现门槛';");
}
if(!pdo_fieldexists('wpdc_fxset',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_fxset',  'img2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `img2` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_fxset',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_fxset',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `is_open` int(11) NOT NULL DEFAULT '1' COMMENT '1.开启2关闭';");
}
if(!pdo_fieldexists('wpdc_fxset',  'instructions')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `instructions` text NOT NULL COMMENT '分销商说明';");
}
if(!pdo_fieldexists('wpdc_fxset',  'is_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxset')." ADD `is_type` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_fxuser',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxuser')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_fxuser',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxuser')." ADD `user_id` int(11) NOT NULL COMMENT '一级分销';");
}
if(!pdo_fieldexists('wpdc_fxuser',  'fx_user')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxuser')." ADD `fx_user` int(11) NOT NULL COMMENT '二级分销';");
}
if(!pdo_fieldexists('wpdc_fxuser',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_fxuser')." ADD `time` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_goods',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_goods',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `img` varchar(300) NOT NULL COMMENT '商品图片';");
}
if(!pdo_fieldexists('wpdc_goods',  'number')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `number` int(11) NOT NULL COMMENT '数量';");
}
if(!pdo_fieldexists('wpdc_goods',  'order_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `order_id` int(11) NOT NULL COMMENT '订单id';");
}
if(!pdo_fieldexists('wpdc_goods',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `name` varchar(50) NOT NULL COMMENT '商品名称';");
}
if(!pdo_fieldexists('wpdc_goods',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_goods',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_goods',  'dishes_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `dishes_id` int(11) NOT NULL COMMENT '菜品id';");
}
if(!pdo_fieldexists('wpdc_goods',  'spec')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_goods')." ADD `spec` varchar(20) NOT NULL COMMENT '规格';");
}
if(!pdo_fieldexists('wpdc_help',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_help',  'question')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `question` varchar(200) NOT NULL COMMENT '标题';");
}
if(!pdo_fieldexists('wpdc_help',  'answer')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `answer` text NOT NULL COMMENT '回答';");
}
if(!pdo_fieldexists('wpdc_help',  'sort')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `sort` int(4) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_help',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_help',  'created_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_help')." ADD `created_time` datetime NOT NULL;");
}
if(!pdo_fieldexists('wpdc_integral',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_integral',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_integral',  'score')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `score` int(11) NOT NULL COMMENT '分数';");
}
if(!pdo_fieldexists('wpdc_integral',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `type` int(4) NOT NULL COMMENT '1加,2减';");
}
if(!pdo_fieldexists('wpdc_integral',  'order_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `order_id` int(11) NOT NULL COMMENT '订单id';");
}
if(!pdo_fieldexists('wpdc_integral',  'cerated_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `cerated_time` datetime NOT NULL COMMENT '创建时间';");
}
if(!pdo_fieldexists('wpdc_integral',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_integral',  'note')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_integral')." ADD `note` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `name` varchar(50) NOT NULL COMMENT '名称';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `money` int(11) NOT NULL COMMENT '价格';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'type_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `type_id` int(11) NOT NULL COMMENT '分类id';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'goods_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `goods_details` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'process_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `process_details` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'attention_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `attention_details` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'number')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `number` int(11) NOT NULL COMMENT '数量';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `time` varchar(50) NOT NULL COMMENT '期限';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `is_open` int(11) NOT NULL COMMENT '1.开启2关闭';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `type` int(11) NOT NULL COMMENT '1.余额2.实物';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `num` int(11) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfgoods',  'hb_moeny')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfgoods')." ADD `hb_moeny` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'good_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `good_id` int(11) NOT NULL COMMENT '商品id';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `time` varchar(20) NOT NULL COMMENT '兑换时间';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `user_name` varchar(20) NOT NULL COMMENT '用户地址';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'user_tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `user_tel` varchar(20) NOT NULL COMMENT '用户电话';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'address')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `address` varchar(200) NOT NULL COMMENT '地址';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'note')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `note` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `integral` int(11) NOT NULL COMMENT '积分';");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'good_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `good_name` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'good_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `good_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jfrecord',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jfrecord')." ADD `state` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_jftype',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jftype')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_jftype',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jftype')." ADD `name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jftype',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jftype')." ADD `img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jftype',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jftype')." ADD `num` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_jftype',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_jftype')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_kfwset',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_kfwset',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `store_id` int(11) NOT NULL COMMENT '门店ID';");
}
if(!pdo_fieldexists('wpdc_kfwset',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `user_id` int(11) NOT NULL COMMENT '商户id';");
}
if(!pdo_fieldexists('wpdc_kfwset',  'access_token')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `access_token` varchar(50) NOT NULL COMMENT '用户授权token';");
}
if(!pdo_fieldexists('wpdc_kfwset',  'openid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `openid` varchar(20) NOT NULL COMMENT '新商户ID';");
}
if(!pdo_fieldexists('wpdc_kfwset',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_kfwset')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_order',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_order',  'order_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `order_num` varchar(20) NOT NULL COMMENT '订单号';");
}
if(!pdo_fieldexists('wpdc_order',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `state` int(11) NOT NULL COMMENT '状态 1.待付款 2.等待接单 3.等待送达  4.完成';");
}
if(!pdo_fieldexists('wpdc_order',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `time` varchar(20) NOT NULL COMMENT '下单时间';");
}
if(!pdo_fieldexists('wpdc_order',  'pay_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `pay_time` int(11) NOT NULL COMMENT '付款时间';");
}
if(!pdo_fieldexists('wpdc_order',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'preferential')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `preferential` varchar(10) NOT NULL COMMENT '优惠';");
}
if(!pdo_fieldexists('wpdc_order',  'tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `tel` varchar(20) NOT NULL COMMENT '客户电话';");
}
if(!pdo_fieldexists('wpdc_order',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `name` varchar(20) NOT NULL COMMENT '客户姓名';");
}
if(!pdo_fieldexists('wpdc_order',  'address')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `address` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'delivery_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `delivery_time` varchar(20) NOT NULL COMMENT '送达时间';");
}
if(!pdo_fieldexists('wpdc_order',  'time2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `time2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'cancel_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `cancel_time` int(11) NOT NULL COMMENT '取消时间';");
}
if(!pdo_fieldexists('wpdc_order',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `type` int(4) NOT NULL COMMENT '订单类型1外卖，2店内';");
}
if(!pdo_fieldexists('wpdc_order',  'dn_state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `dn_state` int(4) NOT NULL COMMENT '店内订单状态1,待支付，2已完成,3关闭订单';");
}
if(!pdo_fieldexists('wpdc_order',  'table_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `table_id` int(11) NOT NULL COMMENT '桌台ID';");
}
if(!pdo_fieldexists('wpdc_order',  'freight')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `freight` decimal(10,2) NOT NULL COMMENT '配送费';");
}
if(!pdo_fieldexists('wpdc_order',  'box_fee')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `box_fee` decimal(10,2) NOT NULL COMMENT '餐盒费';");
}
if(!pdo_fieldexists('wpdc_order',  'coupons_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `coupons_id` int(11) NOT NULL COMMENT '优惠劵ID';");
}
if(!pdo_fieldexists('wpdc_order',  'voucher_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `voucher_id` int(11) NOT NULL COMMENT '代金劵ID';");
}
if(!pdo_fieldexists('wpdc_order',  'seller_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `seller_id` int(11) NOT NULL COMMENT '商家ID';");
}
if(!pdo_fieldexists('wpdc_order',  'note')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `note` varchar(200) NOT NULL COMMENT '备注';");
}
if(!pdo_fieldexists('wpdc_order',  'area')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `area` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'lat')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `lat` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'lng')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `lng` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'del')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `del` int(11) NOT NULL DEFAULT '2' COMMENT '1.删除  2.未删除';");
}
if(!pdo_fieldexists('wpdc_order',  'sh_ordernum')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `sh_ordernum` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'pay_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `pay_type` int(11) NOT NULL COMMENT '1.线上2.线下';");
}
if(!pdo_fieldexists('wpdc_order',  'del2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `del2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_order',  'is_take')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `is_take` int(11) NOT NULL COMMENT '1.自取 2.不自取';");
}
if(!pdo_fieldexists('wpdc_order',  'is_yue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `is_yue` int(11) NOT NULL COMMENT '1.余额 2.';");
}
if(!pdo_fieldexists('wpdc_order',  'completion_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `completion_time` int(11) NOT NULL COMMENT '完成时间';");
}
if(!pdo_fieldexists('wpdc_order',  'form_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_order')." ADD `form_id` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_qbmx',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_qbmx',  'money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_qbmx',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `type` int(11) NOT NULL COMMENT '1.加2减';");
}
if(!pdo_fieldexists('wpdc_qbmx',  'note')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `note` varchar(20) NOT NULL COMMENT '备注';");
}
if(!pdo_fieldexists('wpdc_qbmx',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `time` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_qbmx',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_qbmx')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_reduction',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_reduction',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `name` varchar(50) NOT NULL COMMENT '活动名称';");
}
if(!pdo_fieldexists('wpdc_reduction',  'full')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `full` int(11) NOT NULL COMMENT '满';");
}
if(!pdo_fieldexists('wpdc_reduction',  'reduction')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `reduction` int(11) NOT NULL COMMENT '减';");
}
if(!pdo_fieldexists('wpdc_reduction',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `type` int(11) NOT NULL COMMENT '1.外卖 2.店内 3.外卖+店内';");
}
if(!pdo_fieldexists('wpdc_reduction',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_reduction')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_rrset',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_rrset',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `store_id` int(11) NOT NULL COMMENT '门店id';");
}
if(!pdo_fieldexists('wpdc_rrset',  'username')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `username` varchar(30) NOT NULL COMMENT '账号';");
}
if(!pdo_fieldexists('wpdc_rrset',  'appkey')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `appkey` varchar(50) NOT NULL COMMENT 'key';");
}
if(!pdo_fieldexists('wpdc_rrset',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `is_open` int(11) NOT NULL DEFAULT '1' COMMENT '是否开启1是,2否';");
}
if(!pdo_fieldexists('wpdc_rrset',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_rrset')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'store_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `store_name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `tel` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `user_name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `state` int(11) NOT NULL COMMENT '1.待审核 2.通过 3.拒绝';");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `time` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'address')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `address` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'sp_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `sp_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'sfz_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `sfz_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ruzhu',  'sfz_img2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ruzhu')." ADD `sfz_img2` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_seller',  'account')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `account` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'pwd')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `pwd` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'cerated_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `cerated_time` datetime NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_seller',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_seller')." ADD `state` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_signlist',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_signlist',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_signlist',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `time` varchar(20) NOT NULL COMMENT '签到时间';");
}
if(!pdo_fieldexists('wpdc_signlist',  'time2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `time2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_signlist',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `integral` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_signlist',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signlist')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_signset',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_signset',  'one')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `one` int(11) NOT NULL COMMENT '首次奖励积分';");
}
if(!pdo_fieldexists('wpdc_signset',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `integral` int(11) NOT NULL COMMENT '每天签到积分';");
}
if(!pdo_fieldexists('wpdc_signset',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `is_open` int(11) NOT NULL COMMENT '1.开启2.关闭  签到';");
}
if(!pdo_fieldexists('wpdc_signset',  'is_bq')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `is_bq` int(11) NOT NULL COMMENT '1.开启2.关闭  补签';");
}
if(!pdo_fieldexists('wpdc_signset',  'bq_integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `bq_integral` int(11) NOT NULL COMMENT '补签扣除积分';");
}
if(!pdo_fieldexists('wpdc_signset',  'details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `details` text NOT NULL COMMENT '签到说明';");
}
if(!pdo_fieldexists('wpdc_signset',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_signset')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_sms',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `user_name` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'password')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `password` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'model')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `model` varchar(30) NOT NULL COMMENT '支付订单通知模板';");
}
if(!pdo_fieldexists('wpdc_sms',  'model2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `model2` varchar(30) NOT NULL COMMENT '预约通知模板';");
}
if(!pdo_fieldexists('wpdc_sms',  'tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `tel` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'tid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `tid` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'signature')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `signature` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'yy_tid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `yy_tid` varchar(50) NOT NULL COMMENT '预约模板ID';");
}
if(!pdo_fieldexists('wpdc_sms',  'dm_tid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `dm_tid` varchar(50) NOT NULL COMMENT '当面付模板ID';");
}
if(!pdo_fieldexists('wpdc_sms',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'email')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `email` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'appkey')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `appkey` varchar(100) NOT NULL COMMENT '应用key(聚合)';");
}
if(!pdo_fieldexists('wpdc_sms',  'tpl_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `tpl_id` int(11) NOT NULL COMMENT '模板id(聚合)';");
}
if(!pdo_fieldexists('wpdc_sms',  'tpl2_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `tpl2_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'is_wmsms')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `is_wmsms` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_sms',  'is_yysms')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `is_yysms` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_sms',  'is_dnsms')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `is_dnsms` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_sms',  'tpl3_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `tpl3_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'sj_tid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `sj_tid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'sj_tid2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `sj_tid2` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'wx_appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `wx_appid` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'wx_secret')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `wx_secret` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_sms',  'sj_openid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_sms')." ADD `sj_openid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_spec',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_spec')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_spec',  'goods_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_spec')." ADD `goods_id` int(11) NOT NULL COMMENT '商品ID';");
}
if(!pdo_fieldexists('wpdc_spec',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_spec')." ADD `name` varchar(50) NOT NULL COMMENT '规格名称';");
}
if(!pdo_fieldexists('wpdc_spec',  'cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_spec')." ADD `cost` decimal(10,2) NOT NULL COMMENT '价格';");
}
if(!pdo_fieldexists('wpdc_spec',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_spec')." ADD `num` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_special',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_special',  'day')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `day` varchar(20) NOT NULL COMMENT '日期';");
}
if(!pdo_fieldexists('wpdc_special',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `integral` int(11) NOT NULL COMMENT '积分';");
}
if(!pdo_fieldexists('wpdc_special',  'title')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `title` varchar(20) NOT NULL COMMENT '标题说明';");
}
if(!pdo_fieldexists('wpdc_special',  'color')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `color` varchar(20) NOT NULL COMMENT '颜色';");
}
if(!pdo_fieldexists('wpdc_special',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_special')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_store',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `name` varchar(50) NOT NULL COMMENT '商家名称';");
}
if(!pdo_fieldexists('wpdc_store',  'address')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `address` varchar(500) NOT NULL COMMENT '商家地址';");
}
if(!pdo_fieldexists('wpdc_store',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `time` varchar(100) NOT NULL COMMENT '营业时间';");
}
if(!pdo_fieldexists('wpdc_store',  'tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `tel` varchar(20) NOT NULL COMMENT '电话';");
}
if(!pdo_fieldexists('wpdc_store',  'announcement')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `announcement` varchar(500) NOT NULL COMMENT '公告';");
}
if(!pdo_fieldexists('wpdc_store',  'conditions')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `conditions` varchar(10) NOT NULL COMMENT '条件';");
}
if(!pdo_fieldexists('wpdc_store',  'preferential')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `preferential` varchar(10) NOT NULL COMMENT '优惠';");
}
if(!pdo_fieldexists('wpdc_store',  'support')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `support` varchar(500) NOT NULL COMMENT '支持';");
}
if(!pdo_fieldexists('wpdc_store',  'is_rest')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_rest` int(11) NOT NULL COMMENT '是否休息(1 是  2否)';");
}
if(!pdo_fieldexists('wpdc_store',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `img` text NOT NULL COMMENT '商家图片';");
}
if(!pdo_fieldexists('wpdc_store',  'start_at')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `start_at` varchar(20) NOT NULL COMMENT '起送价';");
}
if(!pdo_fieldexists('wpdc_store',  'freight')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `freight` varchar(20) NOT NULL COMMENT '配送费';");
}
if(!pdo_fieldexists('wpdc_store',  'logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `logo` varchar(200) NOT NULL COMMENT '店铺logo';");
}
if(!pdo_fieldexists('wpdc_store',  'details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `details` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'bgimg')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `bgimg` text NOT NULL COMMENT '商家背景图片';");
}
if(!pdo_fieldexists('wpdc_store',  'time2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `time2` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'color')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `color` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'xyh_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `xyh_money` decimal(10,2) NOT NULL COMMENT '新用户立减金额';");
}
if(!pdo_fieldexists('wpdc_store',  'xyh_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `xyh_open` int(4) NOT NULL COMMENT '是否开启新用户立减1是2否';");
}
if(!pdo_fieldexists('wpdc_store',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `integral` int(11) NOT NULL COMMENT ' 积分 (设置评价获取积分)';");
}
if(!pdo_fieldexists('wpdc_store',  'coordinates')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `coordinates` varchar(50) NOT NULL COMMENT '经纬度';");
}
if(!pdo_fieldexists('wpdc_store',  'distance')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `distance` varchar(100) NOT NULL COMMENT '配送距离单位米';");
}
if(!pdo_fieldexists('wpdc_store',  'is_yy')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_yy` int(4) NOT NULL COMMENT '是否预约1是';");
}
if(!pdo_fieldexists('wpdc_store',  'is_wm')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_wm` int(4) NOT NULL COMMENT '是否外卖1是';");
}
if(!pdo_fieldexists('wpdc_store',  'is_dn')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_dn` int(4) NOT NULL COMMENT '是否店内1是';");
}
if(!pdo_fieldexists('wpdc_store',  'is_sy')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_sy` int(4) NOT NULL COMMENT '是否收银1是';");
}
if(!pdo_fieldexists('wpdc_store',  'is_pd')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_pd` int(4) NOT NULL COMMENT '是否排队1是';");
}
if(!pdo_fieldexists('wpdc_store',  'ps_mode')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `ps_mode` int(4) NOT NULL COMMENT '配送方式 1.蜂鸟，2商家';");
}
if(!pdo_fieldexists('wpdc_store',  'bq_logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `bq_logo` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_display')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_display` int(4) NOT NULL COMMENT '幻灯片是否显示,1是，2否';");
}
if(!pdo_fieldexists('wpdc_store',  'yyzz')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `yyzz` text NOT NULL COMMENT '营业资质';");
}
if(!pdo_fieldexists('wpdc_store',  'environment')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `environment` text NOT NULL COMMENT '商家环境';");
}
if(!pdo_fieldexists('wpdc_store',  'sd_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `sd_time` varchar(20) NOT NULL COMMENT '配送时间';");
}
if(!pdo_fieldexists('wpdc_store',  'md_logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `md_logo` varchar(200) NOT NULL COMMENT '门店logo';");
}
if(!pdo_fieldexists('wpdc_store',  'md_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `md_name` varchar(50) NOT NULL COMMENT '门店名称';");
}
if(!pdo_fieldexists('wpdc_store',  'md_area')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `md_area` int(11) NOT NULL COMMENT '门店区域id';");
}
if(!pdo_fieldexists('wpdc_store',  'md_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `md_type` int(11) NOT NULL COMMENT '门店类型id';");
}
if(!pdo_fieldexists('wpdc_store',  'md_content')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `md_content` varchar(300) NOT NULL COMMENT '门店简介';");
}
if(!pdo_fieldexists('wpdc_store',  'number')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `number` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'score')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `score` decimal(10,1) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'sales')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `sales` int(11) NOT NULL COMMENT '销量';");
}
if(!pdo_fieldexists('wpdc_store',  'is_jd')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_jd` int(11) NOT NULL COMMENT '1自动接单  2.手动接单';");
}
if(!pdo_fieldexists('wpdc_store',  'jd_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `jd_time` int(11) NOT NULL COMMENT '自动接单时间';");
}
if(!pdo_fieldexists('wpdc_store',  'source_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `source_id` int(11) NOT NULL COMMENT '商家';");
}
if(!pdo_fieldexists('wpdc_store',  'shop_no')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `shop_no` varchar(20) NOT NULL COMMENT '门店编号';");
}
if(!pdo_fieldexists('wpdc_store',  'is_mp3')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_mp3` int(11) NOT NULL COMMENT '1.开启 2.关闭';");
}
if(!pdo_fieldexists('wpdc_store',  'is_video')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_video` int(11) NOT NULL COMMENT '1.开启 2.关闭';");
}
if(!pdo_fieldexists('wpdc_store',  'store_mp3')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `store_mp3` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'store_video')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `store_video` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_yypay')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_yypay` int(11) NOT NULL COMMENT '是否开启预约付款1.是2.否';");
}
if(!pdo_fieldexists('wpdc_store',  'yy_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `yy_name` varchar(20) NOT NULL COMMENT '预约文本';");
}
if(!pdo_fieldexists('wpdc_store',  'yy_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `yy_img` varchar(100) NOT NULL COMMENT '预约图片';");
}
if(!pdo_fieldexists('wpdc_store',  'wm_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `wm_name` varchar(20) NOT NULL COMMENT '外卖文本';");
}
if(!pdo_fieldexists('wpdc_store',  'wm_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `wm_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'dn_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `dn_name` varchar(20) NOT NULL COMMENT '店内文本';");
}
if(!pdo_fieldexists('wpdc_store',  'dn_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `dn_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'sy_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `sy_name` varchar(20) NOT NULL COMMENT '收银文本';");
}
if(!pdo_fieldexists('wpdc_store',  'sy_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `sy_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'pd_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `pd_name` varchar(20) NOT NULL COMMENT '优惠券文本';");
}
if(!pdo_fieldexists('wpdc_store',  'pd_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `pd_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'box_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `box_name` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'storecode')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `storecode` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_czztpd')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_czztpd` int(11) NOT NULL DEFAULT '1' COMMENT '是否开启餐桌状态判断';");
}
if(!pdo_fieldexists('wpdc_store',  'is_chzf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_chzf` int(11) DEFAULT '1' COMMENT '是否开启餐后支付';");
}
if(!pdo_fieldexists('wpdc_store',  'time3')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `time3` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'time4')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `time4` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'hb_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `hb_img` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_open` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_jf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_jf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_wmjf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_wmjf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_yyjf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_yyjf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_dnjf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_dnjf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_dmjf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_dmjf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'poundage')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `poundage` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_jfpay')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_jfpay` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'is_yuejf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_yuejf` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'integral2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `integral2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_store',  'is_yue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `is_yue` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_store',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_store')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_storetype',  'type_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `type_name` varchar(50) NOT NULL COMMENT '类型名称';");
}
if(!pdo_fieldexists('wpdc_storetype',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `num` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `img` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'commission')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `commission` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'commission2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `commission2` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_storetype',  'poundage')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_storetype')." ADD `poundage` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_system',  'appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `appid` varchar(100) NOT NULL COMMENT 'appid';");
}
if(!pdo_fieldexists('wpdc_system',  'appsecret')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `appsecret` varchar(200) NOT NULL COMMENT 'appsecret';");
}
if(!pdo_fieldexists('wpdc_system',  'link')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `link` varchar(200) NOT NULL COMMENT '网址';");
}
if(!pdo_fieldexists('wpdc_system',  'mchid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `mchid` varchar(20) NOT NULL COMMENT '商户号';");
}
if(!pdo_fieldexists('wpdc_system',  'wxkey')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `wxkey` varchar(100) NOT NULL COMMENT '商户秘钥';");
}
if(!pdo_fieldexists('wpdc_system',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'url_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `url_name` varchar(20) NOT NULL COMMENT '网址名称';");
}
if(!pdo_fieldexists('wpdc_system',  'details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `details` text NOT NULL COMMENT '关于我们';");
}
if(!pdo_fieldexists('wpdc_system',  'url_logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `url_logo` varchar(100) NOT NULL COMMENT '网址logo';");
}
if(!pdo_fieldexists('wpdc_system',  'bq_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `bq_name` varchar(50) NOT NULL COMMENT '版权名称';");
}
if(!pdo_fieldexists('wpdc_system',  'link_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `link_name` varchar(30) NOT NULL COMMENT '网站名称';");
}
if(!pdo_fieldexists('wpdc_system',  'link_logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `link_logo` varchar(100) NOT NULL COMMENT '网站logo';");
}
if(!pdo_fieldexists('wpdc_system',  'more')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `more` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'default_store')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `default_store` int(11) NOT NULL COMMENT '默认门店id';");
}
if(!pdo_fieldexists('wpdc_system',  'support')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `support` varchar(20) NOT NULL COMMENT '技术支持';");
}
if(!pdo_fieldexists('wpdc_system',  'bq_logo')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `bq_logo` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'color')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `color` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'map_key')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `map_key` varchar(100) NOT NULL COMMENT '腾讯地图key';");
}
if(!pdo_fieldexists('wpdc_system',  'tz_appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tz_appid` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'tz_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tz_name` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'pt_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `pt_name` varchar(30) NOT NULL COMMENT '平台名称';");
}
if(!pdo_fieldexists('wpdc_system',  'dada_key')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `dada_key` varchar(50) NOT NULL COMMENT '达达key';");
}
if(!pdo_fieldexists('wpdc_system',  'dada_secret')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `dada_secret` varchar(50) NOT NULL COMMENT '达达secret';");
}
if(!pdo_fieldexists('wpdc_system',  'apiclient_cert')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `apiclient_cert` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'apiclient_key')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `apiclient_key` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'day')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `day` int(11) NOT NULL COMMENT '天数';");
}
if(!pdo_fieldexists('wpdc_system',  'username')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `username` varchar(20) NOT NULL COMMENT '邮箱用户名';");
}
if(!pdo_fieldexists('wpdc_system',  'password')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `password` varchar(50) NOT NULL COMMENT '邮箱密码';");
}
if(!pdo_fieldexists('wpdc_system',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `type` varchar(10) NOT NULL COMMENT '邮箱类型';");
}
if(!pdo_fieldexists('wpdc_system',  'sender')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `sender` varchar(50) NOT NULL COMMENT '发件人名称';");
}
if(!pdo_fieldexists('wpdc_system',  'signature')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `signature` varchar(200) NOT NULL COMMENT '邮件签名';");
}
if(!pdo_fieldexists('wpdc_system',  'is_email')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_email` int(11) NOT NULL COMMENT '1开启  2关闭';");
}
if(!pdo_fieldexists('wpdc_system',  'tx_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tx_money` decimal(10,2) NOT NULL COMMENT '最低提现金额';");
}
if(!pdo_fieldexists('wpdc_system',  'tx_rate')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tx_rate` int(11) NOT NULL COMMENT '手续费';");
}
if(!pdo_fieldexists('wpdc_system',  'tx_details')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tx_details` text NOT NULL COMMENT '提现详情';");
}
if(!pdo_fieldexists('wpdc_system',  'tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `tel` varchar(20) NOT NULL COMMENT '平台电话';");
}
if(!pdo_fieldexists('wpdc_system',  'dc_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `dc_name` varchar(20) NOT NULL COMMENT '点餐文本';");
}
if(!pdo_fieldexists('wpdc_system',  'wm_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `wm_name` varchar(20) NOT NULL COMMENT '外卖文本';");
}
if(!pdo_fieldexists('wpdc_system',  'yd_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `yd_name` varchar(20) NOT NULL COMMENT '预定文本';");
}
if(!pdo_fieldexists('wpdc_system',  'typeset')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `typeset` int(11) NOT NULL COMMENT '1开启  2.关闭(分类)';");
}
if(!pdo_fieldexists('wpdc_system',  'integral')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `integral` int(11) NOT NULL COMMENT '评论得积分';");
}
if(!pdo_fieldexists('wpdc_system',  'cjwt')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `cjwt` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'rzxy')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `rzxy` text NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'is_ruzhu')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_ruzhu` int(11) NOT NULL COMMENT '1.开启2关闭';");
}
if(!pdo_fieldexists('wpdc_system',  'is_yue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_yue` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'integral2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `integral2` int(11) NOT NULL COMMENT '消费得积分';");
}
if(!pdo_fieldexists('wpdc_system',  'is_jf')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_jf` int(11) NOT NULL DEFAULT '1' COMMENT '1开启2关闭';");
}
if(!pdo_fieldexists('wpdc_system',  'is_jfpay')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_jfpay` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'jf_proportion')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `jf_proportion` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'is_zfb')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_zfb` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'is_yhk')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_yhk` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'is_wx')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_wx` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'ip')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `ip` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'jfgn')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `jfgn` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'fxgn')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `fxgn` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'msgn')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `msgn` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_system',  'is_img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_img` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_system',  'is_psxx')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `is_psxx` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_system',  'kfw_appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `kfw_appid` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_system',  'kfw_appsecret')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_system')." ADD `kfw_appsecret` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_table',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_table',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `name` varchar(50) NOT NULL COMMENT '桌台号';");
}
if(!pdo_fieldexists('wpdc_table',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `num` int(4) NOT NULL COMMENT '就餐人数';");
}
if(!pdo_fieldexists('wpdc_table',  'type_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `type_id` varchar(50) NOT NULL COMMENT '桌台类型ID';");
}
if(!pdo_fieldexists('wpdc_table',  'tag')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `tag` varchar(50) NOT NULL COMMENT '标签';");
}
if(!pdo_fieldexists('wpdc_table',  'orderby')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `orderby` int(11) NOT NULL COMMENT '排序';");
}
if(!pdo_fieldexists('wpdc_table',  'status')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `status` int(4) NOT NULL COMMENT '状态，0 空闲，1开台，2已下单，3已支付';");
}
if(!pdo_fieldexists('wpdc_table',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `uniacid` varchar(50) NOT NULL COMMENT '公众号ID';");
}
if(!pdo_fieldexists('wpdc_table',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_table_type',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_table_type',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `name` varchar(50) NOT NULL COMMENT '名字';");
}
if(!pdo_fieldexists('wpdc_table_type',  'fw_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `fw_cost` decimal(10,2) NOT NULL COMMENT '服务费';");
}
if(!pdo_fieldexists('wpdc_table_type',  'zd_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `zd_cost` decimal(10,2) NOT NULL COMMENT '最低消费';");
}
if(!pdo_fieldexists('wpdc_table_type',  'yd_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `yd_cost` decimal(10,2) NOT NULL COMMENT '预付款';");
}
if(!pdo_fieldexists('wpdc_table_type',  'num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `num` int(11) NOT NULL COMMENT '数量';");
}
if(!pdo_fieldexists('wpdc_table_type',  'orderby')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `orderby` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_table_type',  'ss_seller')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `ss_seller` varchar(50) NOT NULL COMMENT '所属商家';");
}
if(!pdo_fieldexists('wpdc_table_type',  'seller_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `seller_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_table_type',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_table_type')." ADD `uniacid` varchar(50) NOT NULL COMMENT '公众号ID';");
}
if(!pdo_fieldexists('wpdc_traffic',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_traffic')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_traffic',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_traffic')." ADD `user_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_traffic',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_traffic')." ADD `store_id` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_traffic',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_traffic')." ADD `time` varchar(20) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_type',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_type',  'type_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `type_name` varchar(50) NOT NULL COMMENT '分类名称';");
}
if(!pdo_fieldexists('wpdc_type',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_type',  'order_by')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `order_by` int(4) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_type',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_type',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_type')." ADD `is_open` int(11) NOT NULL DEFAULT '1';");
}
if(!pdo_fieldexists('wpdc_user',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_user',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `name` varchar(100) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'join_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `join_time` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'img')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `img` varchar(500) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'openid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `openid` varchar(200) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'user_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `user_name` varchar(50) NOT NULL COMMENT '收货人姓名';");
}
if(!pdo_fieldexists('wpdc_user',  'user_tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `user_tel` varchar(50) NOT NULL COMMENT '收货人电话';");
}
if(!pdo_fieldexists('wpdc_user',  'user_address')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `user_address` varchar(100) NOT NULL COMMENT '收货人地址';");
}
if(!pdo_fieldexists('wpdc_user',  'total_score')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `total_score` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'wallet')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `wallet` decimal(10,2) NOT NULL COMMENT '钱包';");
}
if(!pdo_fieldexists('wpdc_user',  'commission')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `commission` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'day')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `day` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'order_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `order_money` decimal(10,2) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_user',  'order_number')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_user')." ADD `order_number` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_usercoupons',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_usercoupons')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_usercoupons',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_usercoupons')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_usercoupons',  'coupons_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_usercoupons')." ADD `coupons_id` int(11) NOT NULL COMMENT '优惠券id';");
}
if(!pdo_fieldexists('wpdc_usercoupons',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_usercoupons')." ADD `state` int(11) NOT NULL COMMENT '1使用  2未使用';");
}
if(!pdo_fieldexists('wpdc_usercoupons',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_usercoupons')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uservoucher',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uservoucher')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_uservoucher',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uservoucher')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_uservoucher',  'vouchers_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uservoucher')." ADD `vouchers_id` int(11) NOT NULL COMMENT '代金券id';");
}
if(!pdo_fieldexists('wpdc_uservoucher',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uservoucher')." ADD `state` int(11) NOT NULL COMMENT '1使用  2未使用';");
}
if(!pdo_fieldexists('wpdc_uservoucher',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uservoucher')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_uuset',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `store_id` int(11) NOT NULL COMMENT '门店id';");
}
if(!pdo_fieldexists('wpdc_uuset',  'appid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `appid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'appkey')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `appkey` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'account')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `account` varchar(30) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'OpenId')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `OpenId` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_uuset',  'is_open')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `is_open` int(4) NOT NULL DEFAULT '2' COMMENT '1开启,2关闭(uu跑腿)';");
}
if(!pdo_fieldexists('wpdc_uuset',  'is_check')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_uuset')." ADD `is_check` int(4) NOT NULL COMMENT '1自动,2手动确认订单价格';");
}
if(!pdo_fieldexists('wpdc_voucher',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_voucher',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `name` varchar(20) NOT NULL COMMENT '名称';");
}
if(!pdo_fieldexists('wpdc_voucher',  'start_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `start_time` varchar(20) NOT NULL COMMENT '开始时间';");
}
if(!pdo_fieldexists('wpdc_voucher',  'end_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `end_time` varchar(20) NOT NULL COMMENT '结束时间';");
}
if(!pdo_fieldexists('wpdc_voucher',  'preferential')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `preferential` varchar(10) NOT NULL COMMENT '优惠';");
}
if(!pdo_fieldexists('wpdc_voucher',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_voucher',  'voucher_type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `voucher_type` int(4) NOT NULL COMMENT '使用类型1:外卖，2店内,3都可使用';");
}
if(!pdo_fieldexists('wpdc_voucher',  'instruction')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `instruction` varchar(300) NOT NULL COMMENT '使用说明';");
}
if(!pdo_fieldexists('wpdc_voucher',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_voucher')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `id` int(11) NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `name` varchar(10) NOT NULL COMMENT '真实姓名';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'username')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `username` varchar(100) NOT NULL COMMENT '账号';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'type')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `type` int(11) NOT NULL COMMENT '1支付宝 2.微信 3.银行';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `time` varchar(20) NOT NULL COMMENT '申请时间';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'sh_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `sh_time` varchar(20) NOT NULL COMMENT '审核时间';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `state` int(11) NOT NULL COMMENT '1.待审核 2.通过  3.拒绝';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'tx_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `tx_cost` decimal(10,2) NOT NULL COMMENT '提现金额';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'sj_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `sj_cost` decimal(10,2) NOT NULL COMMENT '实际金额';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_withdrawal',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_withdrawal')." ADD `uniacid` int(11) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ydorder',  'id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `id` int(11) unsigned NOT NULL AUTO_INCREMENT;");
}
if(!pdo_fieldexists('wpdc_ydorder',  'xz_date')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `xz_date` varchar(30) NOT NULL COMMENT '选择日期';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'yjdd_date')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `yjdd_date` varchar(30) NOT NULL COMMENT '预计到店时间';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'table_type_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `table_type_id` int(11) NOT NULL COMMENT '桌位类型ID';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'link_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `link_name` varchar(50) NOT NULL COMMENT '联系人';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'link_tel')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `link_tel` varchar(50) NOT NULL COMMENT '联系电话';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'jc_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `jc_num` int(4) NOT NULL COMMENT '就餐人数';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'remark')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `remark` varchar(500) NOT NULL COMMENT '备注';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'state')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `state` int(4) NOT NULL COMMENT '状态 1,待审核，2已审核,3已拒绝,4取消';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'uniacid')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `uniacid` varchar(50) NOT NULL;");
}
if(!pdo_fieldexists('wpdc_ydorder',  'created_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `created_time` varchar(30) NOT NULL COMMENT '创建时间';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'time2')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `time2` int(11) NOT NULL COMMENT '时间撮';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'order_num')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `order_num` varchar(30) NOT NULL COMMENT '订单号';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'table_type_name')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `table_type_name` varchar(50) NOT NULL COMMENT '桌台类型名称';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'store_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `store_id` int(11) NOT NULL COMMENT '商家id';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'user_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `user_id` int(11) NOT NULL COMMENT '用户id';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'zd_cost')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `zd_cost` decimal(10,2) NOT NULL COMMENT '最低消费';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'pay_money')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `pay_money` decimal(10,2) NOT NULL COMMENT '付款金额';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'ydcode')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `ydcode` varchar(100) NOT NULL COMMENT '商户订单号';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'del')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `del` int(11) NOT NULL COMMENT '1.删除 2.未删除';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'is_yue')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `is_yue` int(11) NOT NULL DEFAULT '2';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'completion_time')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `completion_time` int(11) NOT NULL COMMENT '完成时间';");
}
if(!pdo_fieldexists('wpdc_ydorder',  'form_id')) {
	pdo_query("ALTER TABLE ".tablename('wpdc_ydorder')." ADD `form_id` varchar(100) NOT NULL;");
}

?>