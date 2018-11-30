<template>
  <div>
    <div class="stock-sell-section">
      <div class="stock-buy container">
        <section class="play-area">
          <nav>
            <ul class="clearfix">
              <li><router-link :to="{name:'buy',params: {type: this.$route.params.type}}">点买区</router-link></li>
              <li><router-link :to="{name:'sell',params: {type: this.$route.params.type}}">点卖区</router-link></li>
              <li><router-link :to="{name:'entrust',params: {type: this.$route.params.type}}">委托区</router-link></li>
              <li class="active"><router-link :to="{name: 'settleAccount',params: {type: this.$route.params.type}}">结算区</router-link></li>
            </ul>
          </nav>

          <pointBuyVue></pointBuyVue>
        </section>
        <section class="stock-settle-search">
          <form >
            <div class="clearfix">
              <div class="left-search">
                <span>按月查询</span>
                <select id="chooseByYear" v-model="selYear" @change="searchYear">
                  <option disabled value="">选择年</option>
                  <option v-for="(item,index) of years" :key="index">{{item}}年</option>
                </select>
                <select id="chooseByMonth" v-model="selMonth" @change="searchMonth">
                  <option disabled value="">选择月</option>
                  <option v-for="(item, index) of months" :key="index">{{item}}月</option>
                </select>
              </div>
              <div class="right-search fliter">
                <span>最近：</span>
                <a href="javascript:;" :class="{active: curIndex == index}" v-for="(item, index) of rightDete" :key="index" @click="rightSel(item.i,index)">{{item.name}}</a>
              </div>
            </div>
          </form>

          <div class="stock-record-list" >

            <ul class="settleList" v-show="IsInitShow">
              <li class="clearfix">
                <div><span>卖出时间</span></div>
                <div><span>股票名称</span></div>
                <div><span>买入价</span></div>
                <div><span>卖出价</span></div>
                <div><span>操作</span></div>
              </li>
              <li class="clearfix" v-for="(item, index) of settleListInfo" :key="index">
                <div><span>{{item.sale_time}}</span><span>保证金：{{item.bail_money}}</span></div>
                <div><span>{{item.title}}</span><span>股数：{{item.amount}}</span></div>
                <div><span>{{item.bs_price}}</span><span>交易盈亏：{{item.loss_money}}</span></div>
                <div><span>{{item.sale_price}}</span><span></span></div>
                <div><span><button @click="viewDetail(item)">查看详情</button></span></div>
              </li>
            </ul>


            <ul id="settle-list" v-show="!IsInitShow">
              <div class="data-empty">
                <div id="stock-sell-no-record">
                  <p>暂无数据，请先创建策略</p>
                  <router-link to="/buy/1" class="color-btn">立即去点买</router-link>
                </div>
              </div>
            </ul>

            <div style="text-align: right;padding: 20px">
              <Page :total="totalList" show-total size="small" @on-change="changePage"/>
            </div>
          </div>

          <Modal v-model="modal11"  title="结算详情信息" class-name="vertical-center-modal">
            <div class="settleDetailInfo">
              <ul>
                <li>
                  <p>交易合作</p>
                  <div><span>点买人:{{pointUser}}</span></div>
                </li>
                <li>
                  <p>交易明细</p>
                  <div><span>交易本金:{{tradeMoney}}</span><span>交易品种:{{tradeCode}}</span><span>交易数量:{{tradeNum}}</span></div>
                  <div><span>买入价格:{{tradeBuyPrice}}</span><span>卖出价格:{{tradeSalePrice}}</span><span>点买类型:{{tradeType}}</span></div>
                  <div><span style="width: 50%">买入时间:{{createTime}}</span><span style="width: 50%">卖出时间:{{tradeSaleTime}}</span></div>
                </li>
                <li>
                  <p>交易盈亏分配</p>
                  <div>
                    <span>交易盈亏:{{tradeProfitLoss}}</span>
                    <!--<span>盈利分配:</span>-->
                  </div>
                </li>
                <li>
                  <p>管理费</p>
                  <div><span>交易综合费:{{transCost}}</span><span>递延次数:{{defferNum}}</span><span>递延费用:{{defferFee}}</span></div>
                </li>
              </ul>
            </div>
          </Modal>
        </section>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "settleAccount",
    props: ['latestPrice'],
    data(){
      return {
        modal11: false,
        curIndex: -1,
        IsInitShow: true,
        selYear: '',//年份
        selMonth: '',//月份
        years: [2016,2017,2018],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        rightDete: [
          {i: 0, name: '今天'},
          {i: 1, name: '一周'},
          {i: 2, name: '一个月'},
          {i: 3, name: '三个月'},
          {i: 4, name: '六个月'}
        ],//0 今天 1 一周 2 一个月 3 三个月 4 六个月
        settleListInfo: [],//
        curPage: 1,//当前页数
        pageNum: 10,//每页显示的条数
        totalList: 0,//总条数

        pointUser: '',//点买人
        tradeMoney: '',//交易本金
        tradeCode: '',//交易品种
        tradeNum: '',//交易数量
        tradeBuyPrice: '',//买入价格
        tradeSalePrice: '',//卖出价格
        tradeType: '',//点买类型
        createTime: '',//买入时间
        tradeSaleTime: '',//卖出时间
        tradeProfitLoss: '',//交易盈亏金额
        transCost: '',//交易综合费
        defferNum: '',//递延次数
        defferFee: '',//递延费用
      }
    },
    mounted(){
      this.settleList();//调用结算接口
      //如果不选择年份，就不能选择月份


      if(!this.selYear){
        this.months = [];
      }
    },
    methods: {
      searchYear(){

        this.curIndex = -1;

        //当选择年的时候，默认月份选中第一个月
        this.selMonth = `1月`;
        this.months = [1,2,3,4,5,6,7,8,9,10,11,12];

        this.yearMonSettleList(parseFloat(this.selYear),parseFloat(this.selMonth));


      },
      searchMonth(){
        this.yearMonSettleList(parseFloat(this.selYear),parseFloat(this.selMonth));
      },
      rightSel(curDate,index){

        this.selYear = '';
        this.selMonth = '';
        this.curIndex = index;

        this.selCurDaySettleList(curDate);

      },
      settleList(){//结算订单接口
        this.$axios.post('/api/trade/settleList', {token: window.localStorage.getItem('_auth'),page:this.curPage,page_num: this.pageNum})
          .then(res => {
            if(res.data.code === 0){

              if(res.data.data.data.length !== 0){
                this.settleListInfo = res.data.data.data;
                this.totalList = +res.data.data.total;
              }

            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg,});
          })
      },
      yearMonSettleList(year,month){//按照年月的查询
        this.$axios.post('/api/trade/settleList', {token: window.localStorage.getItem('_auth'),year,month,page:this.curPage,page_num: 10})
          .then(res => {
            if(res.data.code === 0){

              this.settleListInfo = [];
              this.totalList = +res.data.data.total;

              if(res.data.data.data.length !== 0){
                this.settleListInfo = res.data.data.data;

              }

            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg,});
          })

      },
      selCurDaySettleList(day){//选择今天的数据列表
        this.$axios.post('/api/trade/settleList', {token: window.localStorage.getItem('_auth'),day,page:this.curPage,page_num: 10})
          .then(res => {
            if(res.data.code === 0){

              this.settleListInfo = [];
              this.totalList = +res.data.data.total;

              if(res.data.data.data.length !== 0){
                this.settleListInfo = res.data.data.data;

              }

            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg,});
          })

      },
      viewDetail(item){//查看详情按钮
        this.modal11 = true;

        this.pointUser = item.user_name;//点买人
        this.createTime = item.create_time;//买入时间
        this.tradeBuyPrice = item.bs_price;//买入价格
        this.tradeSalePrice = item.sale_price;//卖出价格
        this.tradeNum = item.amount;//交易数量
        this.tradeCode = item.title;//交易品种
        this.tradeMoney = item.bail_money;//交易本金
        this.tradeProfitLoss = item.loss_money;//交易盈亏
        this.transCost = item.transaction_fee;//交易综合费
        this.defferNum = item.deferred_times;//递延次数
        this.defferFee = item.deferred_charge;//递延费用
        this.tradeType = item.update_type == 1?'立即买卖':'限价委托';
        this.tradeSaleTime = item.sale_time;//卖出时间
      },
      changePage(p){//点击分页的事件
        this.curPage = p;
        this.settleList();
      },
    },
    watch: {
      latestPrice:{
        handler: 'settleList',
        // immediate: true,
      }
    },

  }
</script>

<style scoped>
  .stock-sell-section {
    /*padding-top: 40px;*/
    padding-bottom: 40px;
    /*background: url(../../../static/imgs/product-bg.jpg) no-repeat center center;*/
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .play-area {
    background-color: white;
    box-shadow: 0 0 5px 1px rgba(143,38,14,0.1);
  }
  .stock-buy .play-area > nav {
    height: 70px;
    line-height: 66px;
  }
  .stock-buy .play-area > nav li.active {
    border-bottom: 4px solid #ff4519;
  }
  .stock-buy .play-area > nav li {
    width: 25%;
    float: left;
    text-align: center;
  }
  .stock-buy .play-area > nav li.active > a {
    color: #ff4519;
  }
  .stock-buy .play-area > nav a {
    font-size: 30px;
    color: #c7c7c7;
    display: block;
  }
  .stock-settle-search {
    padding-top: 30px;
    background: #fff;
  }
  .stock-settle-search form {
    background-color: white;
    padding: 30px 40px 30px;
    color: #4c4c4c;
    font-size: 16px;
  }
  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .stock-settle-search form .left-search {
    float: left;
  }
  .stock-settle-search form .left-search select {
    width: 120px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    height: 26px;
    margin-left: 8px;
    padding-left: 5px;
    background: transparent;
  }
  .stock-settle-search form .left-search select {
    width: 120px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    height: 26px;
    margin-left: 8px;
    padding-left: 5px;
    background: transparent;
  }
  .stock-settle-search form .right-search {
    float: right;
  }
  .stock-settle-search form .right-search a {
    margin-left: 4px;
  }
  .stock-settle-search form .right-search a.active {
    color: #ff4519;
  }
  .stock-record-list {
    position: relative;
  }
  .stock-record-list > ul {
    width: 100%;
  }
  .data-empty {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #bbb;
    padding-top: 40px;
  }
  #stock-sell-no-record,.settleList {
    background-color: white;
    text-align: center;
    min-height: 640px;
    box-shadow: 0 1px 5px 0 rgba(143,38,14,0.1);
  }
  #stock-sell-no-record p {
    color: #ff4519;
    font-size: 24px;
    line-height: 70px;
    padding-top: 112px;
  }
  .color-btn {
    width: 100%;
    display: block;
    height: 40px;
    line-height: 40px;
    margin-top: 16px;
    background-color: #ff4519;
    border-radius: 5px;
    color: white;
    font-size: 20px;
    position: relative;
    cursor: pointer;
  }
  #stock-sell-no-record .color-btn {
    width: 220px;
    margin: 30px auto;
  }
  .color-btn:hover {
    /*background: -moz-linear-gradient(left, #ff4b54,#ff7300);*/
    background: -webkit-linear-gradient(left,#ff4b54,#ff7300);
    /*background: -o-linear-gradient(left,#ff4b54,#ff7300);*/
  }
  #stock-sell-no-record .color-btn:hover {
    color: white;
  }

  .settleList li {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  .settleList li > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    line-height: 30px;

  }
  .settleList li > div button {
    background: #0088f1;
    padding: 5px;
    color: #fff;
    text-align: center;
    margin-right: 5px;
    border-radius: 3px;
  }
  .settleDetailInfo p {
    font-weight: bold;
  }
  .settleDetailInfo ul li{
    line-height: 3;
  }
  .settleDetailInfo ul li div{
    text-indent: 10px;
    display: flex;
    justify-content: space-between;

  }
  .settleDetailInfo ul li div span {
    width: 33.3%;
    /*text-align: center;*/
  }
</style>
