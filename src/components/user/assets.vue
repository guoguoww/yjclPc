<template>
  <section class="mem-overview">
    <div class="mem-top-section clearfix">
      <div class="left-info">
        <h4>安全等级</h4>
        <div class="safe-level-line clearfix">
          <div class="line">
            <div class="choose-line"></div>
          </div>
          <p class="level" id="safe-level">{{realNameStatus === 2? '高' : '中'}}</p>
        </div>
        <div>
          <i class="icomoon icon-phone-info active"></i>
          <i class="icomoon icon-psw-info active"></i>
          <i class="icomoon icon-real-info" :class="realNameStatus === 2? 'active' : ''"></i>
        </div>
        <p class="loginDate">上次登录时间：{{loginDate}}</p>
      </div>
      <div class="right-info">
        <h4>可用余额</h4>
        <div class="money clearfix">
          <span id="总资产">{{balance}}元</span>
          <router-link class="withdraw" to="/user/withdrawal">提现</router-link>
          <router-link class="recharge" to="/user/topUp">充值</router-link>
        </div>
      </div>
    </div>
    <div class="mem-middle-section">
      <ul class="clearfix">
        <li class="fl">
          <h6>今日买入策略</h6>
          <p>{{tradeInfo.today_money || 0}}</p>
        </li>
        <li class="fl">
          <h6>总买点策略</h6>
          <p>{{tradeInfo.total_money || 0}}</p>
        </li>
        <li class="fl">
          <h6>抵用券</h6>
          <p>{{tradeInfo.money || 0}}</p>
        </li>
      </ul>
      <ul class="clearfix">
        <li class="fl">
          <h6>持仓盈亏</h6>
          <p>{{tradeInfo.float_fee || 0}}</p>
        </li>
        <li class="fl">
          <h6>履约保证金</h6>
          <p>{{tradeInfo.bail_money || 0}}</p>
        </li>
        <li class="fl">
          <h6>持仓递延费</h6>
          <p>{{tradeInfo.fee || 0}}</p>
        </li>
      </ul>
    </div>
    <div class="mem-down-section">
      <h3 class="page_member-title">资金明细</h3>
      <!--筛选条件-->
      <div class="filtrate clearfix">
        <div class="filtrate-tab fl">
          <p>资金流向：</p>
          <ul>
            <li class="active">全部</li>
            <!--<li>收入</li>-->
            <!--<li>支出</li>-->
          </ul>
        </div>
        <div class="filtrate-date fr">
          <select name="" id="" v-model="capitalData.search" @change="changeSearch()">
            <option value="0">全部</option>
            <option value="1">最近一周</option>
            <option value="2">最近一月</option>
            <option value="3">最近三月</option>
            <option value="4">最近半年</option>
            <option value="5">最近一年</option>
          </select>
        </div>
      </div>
      <!--列表头部-->
      <div class="header clearfix">
        <span>时间</span>
        <span>金额</span>
        <span>内容</span>
      </div>
      <!--列表-->
      <ul class="list" id="member_bh_list">
        <li v-for="item in capital.capitalList" v-if="capital.total > 0">
          <span>{{item.create_time}}</span>
          <span>{{item.money}}</span>
          <span>{{item.remarks}}</span>
        </li>
      </ul>
      <!--分页器-->
      <div class="page" v-if="capital.total > 10">
        <Page :total="capital.total" :page-size="capitalData.pageNum" size="small" show-total show-elevator @on-change="pageChange"/>
      </div>
      <!--暂无数据-->
      <div class="data-empty" v-if="capital.total === 0">
        <div class="data-empty">暂无数据,请先创建策略</div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: "assets",
    data() {
      return {
        userData: {},
        realNameStatus: 0, //实名认证状态
        balance: 0, //可用余额
        tradeInfo: {}, //策略信息
        capitalData: { //资金流水
          token: localStorage.getItem('_auth') || '', //登录用户
          page: 1, //页码
          pageNum: 10, //页容量
          search: 0, //筛选时间
        },
        capital: {
          capitalList: [], //列表
          total: 0, //总条数
        },
        loginDate: '',
        damicPice: 0, //最新动态价格
        curWebInfos: {},
      }
    },
    created() {
      this.getUserData();
      this.getRealNameStatus();
      this.getShowBalance();
      this.getTradeInfo();
      this.getUserCapital();
      if(localStorage.getItem('loginDate')) {
        this.loginDate = localStorage.getItem('loginDate')
      }
      this.curWebInfos = JSON.parse(window.localStorage.getItem('configInfos'));//获取初始化配置数据
      //页面刚进入时开启长连接
      this.initWebSocket();
    },
    destroyed: function() {
      //页面销毁时关闭长连接,离开路由之后断开websocket连接
      this.websocketclose();
    },
    methods: {
      getUserData() { //获取父路由的个人信息
        this.$parent.userData.then((userData) => {
          this.userData = userData
        })
      },
      getRealNameStatus() { //获取实名状态
        this.$axios.post('/api/user/getRealNameStatus', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.realNameStatus = res.data.data.status;
            if(this.realNameStatus === 2) {
              $('.choose-line').css('width', '100%')
            }else {
              $('.choose-line').css('width', '66.66%')
            }
          }
        })
      },
      getShowBalance() { //获取可用余额
        this.$axios.post('/api/user/showBalance', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.balance = res.data.data.balance
          }
        })
      },
      getTradeInfo() { //获取策略信息
        this.$axios.post('/api/user/tradeInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.tradeInfo = res.data.data
          }
        })
      },
      getUserCapital() { //获取用户资金流水
        this.$axios({
          url: '/api/user/getUserCapital',
          method: 'post',
          data: this.capitalData,
        }).then(res => {
          if(res.data.code === 0) {
            this.capital.total = res.data.data.total;
            this.capital.capitalList = res.data.data.data
          }
        })
      },
      pageChange(page) { //分页
        this.capitalData.page = page;
        this.getUserCapital()
      },
      changeSearch() { //更改时间
        this.capitalData.page = 1;
        this.capitalData.pageNum = 10;
        this.getUserCapital()
      },

      initWebSocket(){ //初始化weosocket
        const wsurl = "ws://yjcl.yjcl88.com:8025";//ws地址
        this.websock = new WebSocket(wsurl);
        this.websock.onopen = this.websocketonopen;//WebSocket 事件 open事件
        this.websock.onerror = this.websocketonerror;//WebSocket 事件 error事件
        this.websock.onmessage = this.websocketonmessage;//WebSocket 事件 message事件
        this.websock.onclose = this.websocketclose;//WebSocket 事件 close事件
      },
      websocketonopen() {//连接建立之后执行send方法发送数据,连接建立时触发
        // 使用 send() 方法发送数据
        // this.$Notice.info({title:"WebSocket连接成功"});
      },
      websocketonmessage(e){ //数据接收,客户端接收服务端数据时触发
        const redata = JSON.parse(e.data).data;
        //注意：长连接我们是后台直接1秒推送一条数据，
        //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
        //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
        if(redata.client_id){
          this.setClientId(redata.client_id);//调用注册client_id接口，获取服务器主动推送的数据
        }
        this.damicPice = Number(redata.price_now).toFixed(2);//从ws中拿去最新的动态价格
      },
      websocketonerror() { //错误,通信发生错误时触发
        this.$Notice.error({title:"WebSocket连接发生错误 "});
      },
      websocketclose(){ //关闭,连接关闭时触发
        // this.$Notice.error({title:"connection closed"});
      },
      setClientId(client_id){//注册client_id。请求成功后，才能收到websocket主动推送的数据
        this.$axios.post('/api/ws/setClientId',{client_id:client_id})
          .then(res => {
            if(res.data.code === 0){
              //这里处理ws服务器端推送的数据
              this.setTradeCode(this.curWebInfos.trade_code.value);//从配置接口中拿去当前用户的股票代码
            }
          })
      },
      setTradeCode(code){//设置要推送哪只股票的数据接口
        this.$axios.post('/api/ws/setTradeCode',{code:code})
          .then(res => {
            if(res.data.code === 0){
              //这里设置要推送哪支股票的推送数据

            }else {
              this.$Notice.error({title: res.data.msg})
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg})
          })
      },
    },
    watch: {
      damicPice(val) {
        this.getTradeInfo();
      }
    },
  }
</script>

<style scoped>
  a {
    color: #5cb1ff;
    cursor: pointer;
  }
  /*头部*/
  .mem-top-section {
    background-color: white;
    padding: 20px 40px;
  }
  /*头部左侧安全等级*/
  .mem-overview .mem-top-section .left-info {
    width: 368px;
    float: left;
  }
  /*标题*/
  .mem-overview .mem-top-section h4 {
    line-height: 38px;
    font-weight: normal;
    font-size: 16px;
  }
  /*安全等级*/
  .safe-level-line {
    width: 382px;
  }
  .safe-level-line .line {
    width: 332px;
    margin: 16px 0 18px;
    height: 6px;
    background-color: #ffccc2;
    border-radius: 3px;
    float: left;
  }
  /*安全等级长度*/
  .safe-level-line .choose-line {
    /*width: 66.66%;*/
    box-shadow: 0 0 5px 0 #ff4519;
    background-color: #ff4519;
    height: 6px;
    border-radius: 3px;
  }
  .safe-level-line .choose-line {
    width: 66.66%;
    box-shadow: 0 0 5px 0 #ff4519;
    background-color: #ff4519;
    height: 6px;
    border-radius: 3px;
  }
  .safe-level-line .level {
    float: right;
    color: #ff4519;
    font-size: 16px;
    vertical-align: middle;
    margin-top: 6px;
  }
  /*已完成的安全验证*/
  .mem-overview .mem-top-section .left-info i.active {
    color: #ff4519;
  }
  .mem-overview .mem-top-section .left-info i {
    font-size: 32px;
    color: #c7c7c7;
    margin-right: 14px;
  }
  .loginDate {
    margin-top: 10px;
  }
/*头部右侧 余额*/
  .mem-overview .mem-top-section .right-info {
    float: right;
    padding-left: 30px;
    min-width: 40%;
    max-width: 50%;
    border-left: 1px solid #f2f2f2;
  }
  .mem-overview .mem-top-section .right-info .money {
    margin-top: 10px;
  }
  /*余额多少*/
  .mem-overview .mem-top-section .right-info .money span {
    font-size: 30px;
    color: #ff4519;
    line-height: 1;
  }
  /*充值提现按钮*/
  .mem-overview .mem-top-section .right-info .money a {
    display: inline-block;
    width: 50px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 16px;
    border-radius: 3px;
    vertical-align: top;
    float: right;
    border: 1px solid #ff4519;
  }
  .mem-overview .mem-top-section .right-info .recharge {
    color: white;
    background-color: #ff4519;
  }
  .mem-overview .mem-top-section .right-info .withdraw {
    color: #ff4519;
    margin-left: 10px;
  }
  .mem-overview .mem-top-section .right-info .records {
    font-size: 16px;
    line-height: 1;
    margin-top: 16px;
    display: block;
  }
  /*中间内容*/
  .mem-middle-section {
    margin-top: 20px;
    background-color: white;
  }
  .mem-middle-section ul {
    width: 100%;
    padding: 10px 40px;
    border-bottom: 1px dashed #eaeaea;
  }
  .mem-middle-section ul:last-child {
    border-bottom: 0;
  }
  .mem-middle-section ul li {
    width: calc(100% / 3);
    text-align: center;
  }
  .mem-middle-section ul li h6 {
    font-weight: normal;
    font-size: 14px;
  }
  .mem-middle-section ul li p {
    font-size: 18px;
    margin-top: 8px;
  }
/*资金明细*/
  .mem-down-section {
    margin-top: 20px;
    min-height: 360px;
    background-color: white;
  }
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 40px;
  }
  /*筛选条件*/
  .filtrate {
    padding: 20px 40px;
  }
  .filtrate .filtrate-tab  p, .filtrate .filtrate-tab ul, .filtrate .filtrate-tab ul li {
    float: left;
  }
  .filtrate .filtrate-tab ul li {
    margin: 0 20px;
    cursor: pointer;
  }
  .filtrate .filtrate-tab ul li.active {
    color: #ff4519;
  }
  .filtrate-date select {
    cursor: pointer;
  }
  .filtrate-date select:focus {
    outline: none;
  }
  /*明细列表*/
  /*头部*/
  .mem-down-section .header {
    border-top: 1px solid #f2f2f2;
    background-color: #fafafa;
    height: 39px;
    line-height: 40px;
    font-size: 16px;
    color: #4c4c4c;
    padding: 0 40px;
  }
  .mem-down-section .header span,  .mem-down-section .list li span {
    display: block;
    float: left;
    text-align: center;
    width: 25%;
  }
  .mem-down-section .header span:last-child, .mem-down-section .list li span:last-child {
    width: 50%;
  }
  .mem-down-section .list {
    padding: 0 40px;
  }
  .mem-down-section .list li {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #4c4c4c;
    border-bottom: 1px dashed #eaeaea;
  }
  .mem-down-section .list li:last-child {
    border-bottom: 1px solid #ededed;
  }
  .mem-down-section .list li span {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  /*分页*/
  .page {
    text-align: center;
    padding: 10px 0;
  }
  /*暂无数据*/
  .data-empty {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #bbb;
    padding-top: 40px;
  }
</style>
