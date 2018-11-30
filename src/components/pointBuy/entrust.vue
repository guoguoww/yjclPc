<template>
  <div>
    <div class="stock-sell-section">
      <div class="stock-buy container">
        <section class="play-area">
          <nav>
            <ul class="clearfix">
              <li><router-link :to="{name:'buy',params: {type: this.$route.params.type}}">点买区</router-link></li>
              <li><router-link :to="{name:'sell',params: {type: this.$route.params.type}}">点卖区</router-link></li>
              <li class="active"><router-link :to="{name:'entrust',params: {type: this.$route.params.type}}">委托区</router-link></li>
              <li><router-link :to="{name: 'settleAccount',params: {type: this.$route.params.type}}">结算区</router-link></li>
            </ul>
          </nav>
          <section id="stock-sell-record" class="stock-record-list">
            <ul id="sell-list" v-show="emptyContent">
              <div class="data-empty">
                <div id="stock-sell-no-record">
                  <p>暂无数据，请先创建策略</p>
                  <router-link to="/buy/1" class="color-btn">立即去点买</router-link>
                  <div>

                  </div>
                </div>
              </div>
            </ul>
            <ul class="listInfo" v-show="!emptyContent">
              <li class="clearfix">
                <div><span>买入时间</span></div>
                <div><span>策略金额</span></div>
                <div><span>股票名称</span></div>
                <div><span>委托价/当前价</span></div>
                <div><span>操作</span></div>
              </li>
              <li class="clearfix" v-for="(item, index) of entrustList" :key="index">
                <div><span>{{item.create_time}}</span><span>保证金：{{item.bail_money}}</span></div>
                <div><span>{{item.transaction_money}}</span><span>止损：{{item.stop_loss}}</span></div>
                <div><span>{{item.title}}</span><span>股数：{{item.amount}}</span></div>
                <div><span>{{item.bs_price}} -> {{item.price_now}}</span><span>盈亏：{{((item.price_now)-(item.bs_price))*(item.amount) | number2 }}</span></div>
                <div>
                    <span>
                      <button @click="cancelEntrust(item.id,item.title)">取消委托</button>
                    </span>
                </div>
              </li>
            </ul>

          </section>

          <div style="text-align: right;padding: 20px">
            <Page :total="totalList" size="small" show-total @on-change="changePage"/>
          </div>

          <pointBuyVue></pointBuyVue>
        </section>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "entrust",
    props: ['latestPrice'],
    data(){
      return {
        latestP: '',//父路由带过来的值
        curInfos: {},//获取初始化配置数据
        emptyContent: false,//当没有持仓的时候显示
        entrustList: [],//委托的订单列表
        curPage: 1,//当前页数
        pageNum: 10,//每页显示的条数
        totalList: 0,//总条数
      }
    },
    mounted(){
      this.curInfos = JSON.parse(window.localStorage.getItem('configInfos'));//获取初始化配置数据
      this.entrustOrderList();//调用委托订单


    },
    methods: {
      entrustOrderList(){//用户委托订单接口

        this.$axios.post('/api/trade/saleList', {token: window.localStorage.getItem('_auth'),type: 1,page:this.curPage,page_num: this.pageNum})
          .then(res => {
            if(res.data.code === 0){
              if(res.data.data.trade_list.data.length !== 0){

                this.entrustList = res.data.data.trade_list.data;
                this.totalList = +res.data.data.trade_list.total;

              }else {
                this.emptyContent = true;
              }
            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg,});
          })
      },
      cancelEntrust(itemId,title){//点卖按钮

        this.$Modal.confirm({
          title: title,
          content: '<p>确认取消委托？</p>',
          onOk: () => {
            this.delTradeOrder(itemId);
          },
          onCancel: () => {
          }
        });

      },
      delTradeOrder(itemId){//取消委托订单的接口
        this.$axios.post('/api/trade/delTradeOrder',{token: window.localStorage.getItem('_auth'),id: itemId})
          .then(res => {
            if(res.data.code === 0){
              this.$Notice.info({title: res.data.msg,});

              this.entrustOrderList();//调用持仓订单接口
            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
          .catch(err => {
            this.$Notice.error({title: err.data.msg,});
          })
      },
      changePage(p){//点击分页的事件
        this.curPage = p;
        this.entrustOrderList();
      },
    },
    filters: {
      //保留2位小数点过滤器 不四舍五入
      number2(value) {
        var toFixedNum = Number(value).toFixed(3);
        var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
        return realVal;
      },
      number4(value) {
        var toFixedNum = Number(value).toFixed(5);
        var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
        return realVal;
      }
    },
    computed: {

      configMsgs (){

        return this.$store.state.NewMsg;

      },
    },
    watch: {
      latestPrice:{
        handler: 'entrustOrderList',
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
  .stock-record-list {
    position: relative;
  }
  .stock-record-list > ul {
    width: 100%;
    margin-top: 20px;
  }
  .data-empty {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #bbb;
    padding-top: 40px;
  }
  #stock-sell-no-record {
    background-color: white;
    margin-top: -60px;
    text-align: center;
    height: 640px;
    box-shadow: 0 1px 5px 0 rgba(143,38,14,0.1);
  }
  #stock-sell-no-record p {
    color: #ff4519;
    font-size: 24px;
    line-height: 70px;
    padding-top: 112px;
  }
  .color-btn {
    display: block;
    height: 40px;
    line-height: 40px;
    background-color: #ff4519;
    border-radius: 5px;
    color: white;
    font-size: 20px;
    position: relative;
    cursor: pointer;
    width: 220px;
    margin: 30px auto;
  }
  .color-btn:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    -moz-transform: skewX(-15deg);
    -webkit-transform: skewX(-15deg);
    -o-transform: skewX(-15deg);
    -ms-transform: skewX(-15deg);
    transform: skewX(-15deg);
    background-color: #ff7807;
  }
  .color-btn:after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 34px;
    width: 6px;
    height: 40px;
    -moz-transform: skewX(-15deg);
    -webkit-transform: skewX(-15deg);
    -o-transform: skewX(-15deg);
    -ms-transform: skewX(-15deg);
    transform: skewX(-15deg);
    background-color: #ff7807;
  }
  .listInfo li {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  .listInfo li > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    line-height: 30px;

  }
  .listInfo li > div button {
    background: #0088f1;
    padding: 5px;
    color: #fff;
    text-align: center;
    margin-right: 5px;
    border-radius: 3px;
  }
</style>
