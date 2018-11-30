<template>
    <div class="stock-sell-section">
      <router-view v-show="childShow" :latestPrice="damicPice"></router-view>
      <div class="stock-buy container" v-show="!childShow">
        <section class="play-area" >
          <nav>
            <ul class="clearfix">

              <li class="active"><router-link :to="{name:'buy',params: {type: this.$route.params.type}}">点买区</router-link></li>
              <li><router-link :to="{name:'sell',params: {type: this.$route.params.type}}">点卖区</router-link></li>
              <li><router-link :to="{name:'entrust',params: {type: this.$route.params.type}}">委托区</router-link></li>
              <li><router-link :to="{name: 'settleAccount',params: {type: this.$route.params.type}}">结算区</router-link></li>

            </ul>
          </nav>

          <section class="clearfix">

            <div class="left-info">
              <header>
                <div class="change-stock clearfix">
                  <i class="icomoon icon-search"></i>
                  <input id="searchTxt" class="search_txt" type="text" placeholder="请输入股票名称/代码/拼音" v-model.trim="curVal" @focus="focusPoint" @blur="blurPoint">
                  <button id="searchConfirm" class="searchConfirm" type="button" @click="searchCode">搜索</button>
                  <div id="search_history" class="search-table" v-show="focusShow">
                    <table>
                      <thead><tr><th>名称</th><th>代码</th><th>简拼</th></tr></thead>
                      <tbody></tbody>
                    </table>
                  </div>
                  <div id="search_cue" class="search-table" v-show="mhSearchShow">
                    <table>
                      <thead><tr><th>名称</th><th>代码</th><th>简拼</th></tr></thead>
                      <tbody>
                        <tr v-for="(item, index) of mhSearchInfos" :key="index" @click="targetSearch(item.code)">
                          <td>{{item.title}}</td>
                          <td>{{formert(item.code)}}</td>
                          <td>{{item.logogram}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="stock-name clearfix">
                  <div class="stock-name-left">
                    <h4>{{searchCodeInfo.title}}</h4>
                    <p>{{searchCodeInfo.code}}</p>
                  </div>
                  <div class="stock-name-right " :class="[ diff > 0 ?'red': 'green' ]">
                    <h5 class="new">{{damicPice}} <i class="icomoon " :class="[ diff > 0 ?'icon-up': 'icon-down' ]"></i></h5>
                    <p>
                      <span class="top"><span v-show="diff<0"></span>{{diff}}</span>
                      <span class="bottom"><span v-show="diff<0"></span>{{diffRate}}%</span>
                    </p>
                  </div>

                </div>
              </header>

              <section class="stock-figure">
                <ul class="row">
                  <li v-for="(item,index) of tabs" :key="index" :class="{active: index == defaultIndex}" @click="tabClick(index,item)">{{item}}</li>
                </ul>
                <div class="figure" id="chart" v-show="toggleShow">
                  <div style="position: relative; overflow: hidden; width: 520px; ">

                    <div class = "chart">
                      <div id = "fEcharts" style = "height: 17.5rem;width: 520px;"></div>
                    </div>

                  </div>
                </div>
                <div class="figure" id="chartk" v-show="!toggleShow">
                  <div style="position: relative; overflow: hidden; width: 520px; ">

                    <div class = "chart">
                      <div id = "kEcharts" style = "height: 17.5rem;width: 520px;"></div>
                    </div>

                  </div>
                </div>
              </section>

              <section class="stock-info">
                <ul class="clearfix">
                  <li class="open"><span>今开</span><span class="r">{{todayOpen}}</span></li>
                  <li class="amplitude"><span>振幅</span><span class="r">{{amplitude}}</span></li>
                  <li class="high"><span>最高</span><span class="r">{{highest}}</span></li>
                  <li class="low"><span>最低</span><span class="r">{{lowest}}</span></li>
                  <li class="max"><span>涨停价</span><span class="r">{{hardenPrice}}</span></li>
                  <li class="min"><span>跌停价</span><span class="r">{{dropStopPrice}}</span></li>
                  <li class="volume"><span>成交量</span><span class="r">{{tradingVolume}}万</span></li>
                  <li class="amount"><span>成交额</span><span class="r">{{volumeMoney}}万</span></li>
                </ul>
              </section>

              <section class="stock-detail">
                <div class="stock-percentage clearfix">
                  <div class="buy">
                    <p>买盘</p>
                  </div>
                  <div class="sell">
                    <p>卖盘</p>
                  </div>
                </div>
                <div class="stock-price clearfix">
                  <ul class="buy" >
                    <li v-for="(item, index) of applyBuyList" :key="index"><em>{{item.id + 1}}</em><b class="red">{{item.price}}</b><i>{{item.num}}</i></li>

                  </ul>
                  <ul class="sell">
                    <li v-for="(item, index) of applySellList" :key="index"><em>{{item.id + 1}}</em><b class="red">{{item.price}}</b><i>{{item.num}}</i></li>

                  </ul>
                </div>
              </section>

            </div>

            <!--A股点买中的右边部分-->
            <div class="right-buy" @mouseover="showHideInfo" v-show="!isModel">
              <div class="buy_price">
                <p class="top">点买金额
                  <select class="f-right" v-model="buyType" style="border: none" @click="selBuyType(buyType)">
                    <option value="" disabled>请先选择购买方式</option>
                    <option :value="item.val" v-for="(item, index) of buyTypeList" :key="index" >{{item.name}}</option>
                  </select>
                  <span class="f-right">购买方式：</span>

                </p>
                <ul id="buy_price_ul" class="ul-list">
                  <li v-for="(item, index) of buyPriceList" :class="{active: initIndex == index || item == customMoney}" :key="index" @click="buyPointType(index,item)">{{item}}万</li>
                </ul>
              </div>
              <div>
                <p class="efficiency" v-show="isLimitBuyType"><span>限&nbsp;价&nbsp;价&nbsp;格</span><input type="text" placeholder="请输入限价价格" v-model="limitPrice" ></p>
                <!--<p class="efficiency"><span>谋&nbsp;略&nbsp;金&nbsp;额</span><input type="text" placeholder="请输入整数金额（整数）" v-model="customMoney" @input="watchInput" >万元</p>-->
                <p class="efficiency"><span>谋&nbsp;略&nbsp;金&nbsp;额</span><input type="text" placeholder="请输入整数金额（整数）" v-model="customMoney" >万元</p>
                <p class="efficiency"><span>资金使用率</span> 可买入{{buyCodeNum}}股，资金利用率{{moneyRate}}%</p>
              </div>

              <div class="open-time">
                <span>持&nbsp;仓&nbsp;时&nbsp;间</span>
                <div class="delay_tip"><i class="icomoon icon-help"></i><div class="showtip">最短2天，最长60天，交易综合费按天支付，默认每天自动延期，自动从账户余额扣除交易综合费(余额不足时自动终止)</div></div>
                <ul class="work-interval">
                  <li class="active">T+1|D</li>
                </ul>
              </div>
              <div class="check-surplus">
                <span>触&nbsp;发&nbsp;止&nbsp;盈</span>
                <div class="delay_tip">
                  <i class="icon icon-help"></i><div class="showtip">当合作交易品种的浮动盈亏率达到特定数值时，投资人有权即时卖出交易品种全部持有数量进行止盈。</div>
                </div>
                <ul id="check-surplus_ul"><li class="active">{{(initSelVal*10000 * (1 + Number(zyRadio))) | keepTwoNum}}</li></ul>
              </div>
              <div class="stop-loss choose-loss" id="stop-loss">
                <span>触&nbsp;发&nbsp;止&nbsp;损</span>
                <div class="delay_tip"><i class="icomoon icon-help"></i><div class="showtip">当合作交易品种的浮动盈亏率达到特定数值时，投资人有权即时卖出交易品种全部持有数量进行止损。</div></div>
                <ul id="stop-loss_ul" class="ul-list" >
                  <li v-for="(item, index) of stopLoss" :class="{active: initSel == index}" :key="index" @click="selZhiSunMoney(index,item.i)">{{item.tit}}</li>
                </ul>
              </div>
              <div class="com_fee">
                <span>交易综合费</span>
                <div class="delay_tip"><i class="icomoon icon-help"></i><div class="showtip">交易综合费包含第一天的交易费，第二天的递延费，每万元点买金的交易综合费为45元，每万元点买金的递延费18元/天。</div></div>
                <span class="old" style="display: none;"></span>
                <strong>{{Number(((zhFee * initSelVal*10000)/10000))}}</strong>元（含前两个交易日的费用）
              </div>
              <div class="perf_bond">
                <span>履约保证金</span>
                <div class="delay_tip"><i class="icomoon icon-help"></i><div class="showtip">履约保证金为点买人委托平台冻结用于履行交易亏损赔付义务的保证金，结束时根据策略盈亏结算。保证金越低风险也越大，保证金越高抗风险也越高。</div></div>
                <strong>{{parseInt((initSelVal*10000)/leverage)}}</strong>元
              </div>
              <div class="delay_condition">
                <span>递&nbsp;延&nbsp;条&nbsp;件</span>
                <div class="delay_tip"><i class="icomoon icon-help"></i><div class="showtip">满足以下两个条件，自动递延：1、不在黑名单股票，2、当策略满足公式：（浮动盈亏+保证金）/交易本金&gt;6%,并且余额够缴纳递延费。</div></div>
                浮动盈亏大于<em>{{parseInt(((initSelVal*10000)/leverage) * (dyTJ))}}</em>
              </div>
              <div class="delay_fee">
                <span style="margin-right: 50px;">递&nbsp;延&nbsp;费&nbsp;用</span><span class="old"></span> <em>{{((dyFee * initSelVal* 10000)/10000)| keepTwoNum}}</em>元/天
                <Checkbox v-model="single" class="red" style="margin-left: 20px" @on-change = 'useCharge'>使用递延费折扣券</Checkbox>
              </div>
              <button id="btn_buy" class="color-btn" :class="{disabled: !this.isWorkTime()}" @click="pointBuy(0)">点买</button>
              <div class="protocol_row">
                <h4>点买时间段： 交易日 09:30-11:30 | 13:00-14:55</h4>
                <p class="protocol_row-agree"><input type="checkbox" id="agree_pro" checked="" name="agree_pro"><label for="agree_pro"></label>我已阅并签署以下协议</p>
                <ul>
                  <li v-for="(item, index) of agreementList" :key="index"><router-link :to="'/Policy/' + item.id">《{{item.title}}》</router-link></li>
                </ul>
              </div>
            </div>





            <!--模拟体验中的右边部分-->

            <div class="right-buy" v-show="isModel">
              <div class="buy_price">
                <p class="top">点买金额
                  <span>（操作提示:免费体验限额3000元,更多金额请到A股点买区操作）</span>
                </p>
                <ul class="ul-list">
                  <li class=active >3000</li>
                </ul>
              </div>
              <p class="efficiency"><span>资金使用率</span> 可买入{{parseInt((3000/damicPice)/100)*100}}股，资金利用率{{parseFloat((parseInt((3000/damicPice)/100)*100)/(3000/damicPice)).toFixed(2)}}%</p>
              <div class="open-time">
                <span>持&nbsp;仓&nbsp;时&nbsp;间</span>
                <ul class="work-interval" style="margin-left: 50px;">
                  <li class="active">T+1|D</li>
                </ul>
              </div>
              <div class="check-surplus">
                <span>触&nbsp;发&nbsp;止&nbsp;盈</span>
                <ul style="margin-left: 50px"><li class="active" data-val="50">{{moniZYRate}}%</li></ul>
              </div>
              <div class="com_fee">
                <span>交易综合费</span>
                <strong style="margin-left:50px;">0</strong> 元
              </div>
              <div class="perf_bond">
                <span>履约保证金</span>
                <strong style="margin-left:50px;">免费</strong>
              </div>
              <button class="color-btn"  @click="moNiPointBuy(1)" :class="{disabled: !this.isWorkTime()}">模拟点买</button>
              <div class="protocol_row">
                <h4>点买时间段： 交易日 09:30-11:30 | 13:00-14:55</h4>
                <p class="protocol_row-agree"><input type="checkbox" id="agree_pro1" checked="" name="agree_pro"><label for="agree_pro1"></label>我已阅并签署以下协议</p>
                <ul>
                  <li v-for="(item, index) of agreementList" :key="index"><router-link :to="'/Policy/' + item.id ">《{{item.title}}》</router-link></li>
                </ul>
              </div>
            </div>

          </section>

          <pointBuyVue></pointBuyVue>
        </section>
      </div>

    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
      name: "buy",
      data(){

        return {
          single: false,//复选框的选中与否
          latestPrice: '',//
            // buyType: -1,//选择股票的购买方式
          buyType: 1,//选择股票的购买方式
          limitPrice: '',//限价价格
          isLimitBuyType: false,//是否选择的是限价价格方式
          moniZYRate: '',//模拟体验中的止盈
          buyTypeList: [{name:'市价',val: 1},{name:'限价价格',val: 2}],//股票购买的方式列表
          applyBuyList: [
            {id:0,price:'--',num:'--',name:'买五'},
            {id:1,price:'--',num:'--',name:'买四'},
            {id:2,price:'--',num:'--',name:'买三'},
            {id:3,price:'--',num:'--',name:'买二'},
            {id:4,price:'--',num:'--',name:'买一'},
          ],
          applySellList: [//申卖数据列表
            {id:0,price:'--',num:'--',name:'卖五'},
            {id:1,price:'--',num:'--',name:'卖四'},
            {id:2,price:'--',num:'--',name:'卖三'},
            {id:3,price:'--',num:'--',name:'卖二'},
            {id:4,price:'--',num:'--',name:'卖一'},
          ],
          fsChart: null,//分时图的chart
          kchart: null,//k线的chart
          curWebInfos: {},
          curWebInfosNew: {},
          websock: null,//websocket
          toggleShow: true,//默认页面初始化时显示分时图
          tabs: ['分时图', 'k线图'],
          defaultIndex: 0,//默认显示分时图的下标
          childShow: this.$store.state.secondRouteSta,//子路由不显示
          buyPriceList: [1,2,3,5,10,20,30,50],
          initIndex: 0,
          zhiSunList: [],//触发止损的数据
          initSel: 0,//触发止损初始化选中
          leverage: 10,//默认杠杆倍数
          isModel: false, //是否选择模拟体验
          customMoney: 1,//A股点买中的输入谋略金额
          initSelVal: '',//页面初始化默认选中的项
          agreementList: [],//用户协议数据列表
          focusShow: false,//默认获取焦点时的状态
          mhSearchShow: false,//
          curVal: '',//查询的value值
          mhSearchInfos: [],//模糊查询出来的数据列表
          searchCodeInfo: '',//当点击搜索出来的数据列表中的任何一条数据 信息集合

          zyRadio: '',//止盈费率
          zhFee: '',//综合费
          dyFee: '',//递延费用
          dyTJ: '',//递延条件


          lineSeries : //面积图 图表设置
          {
            type: 'line',
            smooth:true,
            itemStyle:{
              color:'#354162',
              opacity:0.1
            },
            lineStyle:{
              width:1,
              color:'#354162'
            },
            areaStyle: {
              color:'#EEEEEE'
            },
            grid: {
              top: 10,
              bottom: 20,
              left: 10,
              right: 10,
            },
            xAxis: {
              data: [],
              scale: true,
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            yAxis: {
              scale: true,
              position: 'left',
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
                inside: true,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#EEEEEE',
                },
              },
            },
            series: [
              {
                name: '',
                type: 'line',
                // data: [1,2]
                data: []
              }
            ],
          },



          candleSeries: //K线图 图表设置
          {
            type: 'candlestick',
            // barWidth:5,
            itemStyle: {
              normal: {
                color: '#D73F43',
                color0: '#2AB180',
                borderColor: '#D73F43',
                borderColor0: '#2AB180',
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              top: 10,
              bottom: 20,
              left: 10,
              right: 10,
            },
            xAxis: {
              data: [],
              scale: true,
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
            },
            yAxis: {
              scale: true,
              position: 'left',
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
                inside: true,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#EEEEEE',
                },
              },
            },
            series: [{
              name: '日K',
              type: 'candlestick',
              data: [],
            }],

          },

          todayOpen: '',//今开
          amplitude: '',//振幅
          highest: '',//最高
          lowest: '',//最低
          hardenPrice: '',//涨停价
          dropStopPrice: '',//跌停价
          tradingVolume: '',//成交量
          volumeMoney: '',//成交额


          damicPice: '',//股票最新的动态价格
          diff: '',//动态的涨跌值
          diffRate: '',//动态的涨跌幅
          buyCodeNum: '',//可购买的股票数
          moneyRate: '',//资金利用率
          discountCharge: '',//递延费折扣券金额
        }
      },
      created(){
        //页面刚进入时开启长连接
        this.initWebSocket();
      },
      destroyed: function() {
        document.querySelector('#app').style.background= 'none'
        //页面销毁时关闭长连接,离开路由之后断开websocket连接

        this.websocketclose();

        //组件销毁前先销毁 ECharts 实例
        if (!this.fsChart) { return }
        // this.fsChart.dispose()
        // this.fsChart = null
      },
      mounted(){
        document.querySelector('#app').style.background= '#eedbcd'
        //初始化 ECharts 实例，不能在created生命周期内初始化，因为那时候DOM还没有渲染，是找不到元素的
        this.initFsChart();//初始化分时图

        this.initKChart();//初始化k线图


        this.curWebInfos = JSON.parse(window.localStorage.getItem('configInfos'));//获取初始化配置数据

        this.zyRadio = this.curWebInfos.interference_ratio.value;
        this.zhFee = this.curWebInfos.comprehensive_fee.value;
        this.dyFee = this.curWebInfos.deferred_charge.value;//获取后台返回的递延费  (交易金额*系统配置的递延费)/10000
        this.dyTJ = this.curWebInfos.deferred_loss.value;


        this.moniZYRate = this.curWebInfos.experience_gain.value;//模拟体验中的止盈

        this.$router.push(`/buy/${this.$route.params.type}`);//当全局整体刷新时的跳转


        if(this.$route.params.type == 1){
          this.isModel = false;
        }else if (this.$route.params.type == 2){
          this.isModel = true;

        }
        this.initSelVal = this.buyPriceList[0] | 0;//页面初始化默认选中的金额

        this.getAgreementTit();//获取协议标题

        //页面初始化时调用获取当日用户所持有的股票信息
        this.getTradeInfo(this.curWebInfos.trade_code.value);

        this.getQuotationNow(this.curWebInfos.trade_code.value);//调用分时图的最新数据接口

        this.getTimeSharing(this.curWebInfos.trade_code.value);//获取分时图的历史数据

        this.getKlineHistory(this.curWebInfos.trade_code.value);//获取k线历史数据


      },
      methods: {
        selBuyType(cVal){


          if(cVal == 2){
            this.initIndex = -1;
            this.isLimitBuyType = true;
          }else {
            this.isLimitBuyType = false;
          }
        },

        pointBuy(isMNpoint){//A股点买中的 点买按钮
          //当用户点击 点买按钮时，先判断是否在购买时间内
          if(!this.isWorkTime()){
            this.$Notice.info({title: '不在交易时间内',});
            return;
          }

          //根据购买股票的方式来判断 购买价格，如果是限价购买则需要用户自行填写价格，市价购买就是当前最新价
          if(localStorage.getItem('_auth')){
            if(this.buyType == 2){
             var bs_price = this.limitPrice;

            }else if(this.buyType == 1){
             var bs_price = this.damicPice;
            }else {
              return this.$Notice.error({title: '请先选择购买方式',});
            }
            if(this.buyType == 1 && this.buyCodeNum == 0){
              this.$Notice.info({title: '可买入的数量为0，不能购买，换其他股票',});
              return;
            }

            console.log(this.initSelVal)
            let is_coupon = this.single? 1 : 0;

            this.$axios({
              method: 'post',
              url: '/api/trade/submitTrade',
              data: {
                token: localStorage.getItem('_auth'),
                trade_code:this.searchCodeInfo.code,
                update_type: this.buyType,
                bs_price,
                amount: this.buyCodeNum,
                is_experience: isMNpoint,
                multiple: this.leverage,
                transaction_money: this.initSelVal*10000,
                is_coupon,
              }
            })
              .then(res => {
                if(res.data.code === 0){

                  this.$Notice.info({title: res.data.msg,});

                  this.limitPrice = '';//让限购价格清空
                  this.customMoney = '';//让自定义金额清空

                  this.initIndex = 0;//交易成功后让重新选择交易金额
                  this.isLimitBuyType = false;
                  this.buyType = 1;//交易成功后，让重新选择交易方式

                }else if(res.data.code ===3){

                  this.$Notice.info({title: res.data.msg,});

                  this.$router.push('/user/security');//跳转到实名认证页面去实名认证

                }else {
                  this.$Notice.error({title: res.data.msg,});
                }
              })
              .catch(err => {
                this.$Notice.error({title: err.data.msg,});
              })
          }else {
            this.$router.push('/login');
          }
        },
        moNiPointBuy(isMNpoint){//A股点买中的 点买按钮
          //当用户点击 点买按钮时，先判断是否在购买时间内
          if(!this.isWorkTime()){
            this.$Notice.info({title: '不在交易时间内',});
            return;
          }
          //根据购买股票的方式来判断 购买价格，如果是限价购买则需要用户自行填写价格，市价购买就是当前最新价
          if(localStorage.getItem('_auth')) {
            if (parseInt((3000 / this.damicPice) / 100) * 100 > 0) {
              var moniBuyNum = parseInt((3000 / this.damicPice) / 100) * 100;

            } else {
              return this.$Notice.error({title: '请换其他股票购买',});
            }

            var bs_price = this.damicPice;


            this.$axios({
              method: 'post',
              url: '/api/trade/submitTrade',
              data: {
                token: localStorage.getItem('_auth'),
                trade_code: this.searchCodeInfo.code,
                update_type: 1,
                bs_price,
                amount: moniBuyNum,
                is_experience: isMNpoint,
                multiple: 0,
                transaction_money: 3000,
              }
            })
              .then(res => {
                if (res.data.code === 0) {

                  this.$Notice.info({title: res.data.msg,});

                }else if (res.data.code === 3) {

                  this.$Notice.info({title: res.data.msg,});

                  this.$router.push('/user/security');//跳转到实名认证页面去实名认证

                }else {
                  this.$Notice.error({title: res.data.msg,});
                }
              })
              .catch(err => {
                this.$Notice.error({title: err.data.msg,});
              })
          }else {

            this.$router.push('/login');
          }
        },
        initFsChart () {

          this.fsChart = echarts.init(document.getElementById('fEcharts'), 'light', {renderer: 'svg'});//分时图

          this.fsChart.setOption(this.lineSeries)

        },
        initKChart(){
          // 基于准备好的dom，初始化echarts实例,移动端建议使用 svg模式
          this.kchart = echarts.init(document.getElementById('kEcharts'), 'light', {renderer: 'svg'});//k线图

          this.kchart.setOption(this.candleSeries);
        },



        tabClick(index,itemC){//分时图和k的点击事件
          this.defaultIndex = index;

          if(itemC == '分时图'){

            this.toggleShow = true;

          }else {
            this.toggleShow = false;

          }
        },
        buyPointType(index,item){//点击不同的金额选项的事件

          this.customMoney = item;

          this.initIndex = index;
          this.initSelVal = item;//页面初始化默认选中的项

          if(this.damicPice){
            this.buyCodeNum = parseInt(((this.initSelVal*10000) / (this.damicPice))/100)*100;//初始化计算可购买的股票数，默认的股票数是1万  当前资金/当前股票的最新价格
            this.moneyRate = parseFloat(this.buyCodeNum/(this.initSelVal*10000 / (this.damicPice)) * 100).toFixed(2);

          }else {
            this.buyCodeNum = '--';
            this.moneyRate = '--';
          }

        },
        showHideInfo(){//鼠标放上去显示出提示信息
          $(".delay_tip").mouseenter(function () {
            $(this).find("div.showtip").show();
          }).mouseleave(function () {
            $(this).find("div.showtip").hide();
          })
        },
        selZhiSunMoney(index,curIndex){//触发止损的点击事件
          this.initSel = index;
          this.leverage = curIndex;
          // console.log(this.leverage)
        },
        getAgreementTit(){//获取协议标题
          this.$axios.post('/api/contract/getInfo')
            .then(res => {
              if(res.data.code === 0){
                if(res.data.data && res.data.data.length != 0){

                  this.agreementList = res.data.data;

                }else {
                  this.$Notice.error({title: res.data.msg,});
                }
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,});
            })
        },
        focusPoint(){//查询的输入框获取焦点时，下面的内容显示框要出来
          this.focusShow = true;
        },
        blurPoint(){//查询的输入框失去焦点时，下面的内容显示框要出来
          this.focusShow = false;
        },
        selectTradeInfo(trade_code){//模糊查询接口
          this.$axios.post('/api/trade/selectTradeInfo',{trade_code:trade_code,token: localStorage.getItem('_auth')})
            .then(res => {
              if(res.data.code === 0){
                if(res.data.data && res.data.data.length!== 0){

                  this.mhSearchInfos = res.data.data;
                }
              }else {
                this.$Notice.error({title: res.data.msg,})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,})
            })
        },
        searchCode(){//点击搜索按钮
          if(!this.curVal){
            this.$Notice.info({title: '请输入股票名称/代码/拼音'})
          }else {
            this.selectTradeInfo(this.curVal);//调用模糊查询接口
          }

        },
        targetSearch(curCode){//点击模糊查询出来的数据，进行详细信息查询
          this.focusShow = false;
          this.mhSearchShow = false;
          this.curVal = '';

          this.getTradeInfo(curCode);//对股票的详情信息接口调用

          this.getQuotationNow(curCode);

          this.setTradeCode(curCode);//切换股票代码的ws推送
          this.getKlineHistory(curCode);
          this.getTimeSharing(curCode);

        },
        useCharge(){
          if(localStorage.getItem('_auth')){
            if(this.single){
              this.tradeInfo()
            }

          }else {
            this.$Notice.info({title: '请先登录账户',});

            setTimeout(() => {
              this.$router.push('/login');
            },1000)
          }
        },
        tradeInfo() { //获取策略信息
          this.$axios.post('/api/user/tradeInfo', {token: localStorage.getItem('_auth')}).then(res => {
            if (res.data.code === 0) {
              console.log(res.data.data.money);
              let dyfy = ((this.dyFee * this.initSelVal* 10000)/10000);
              if(res.data.data.money >= dyfy){
                this.single = true;
              }else {
                this.$Notice.info({title: '不能使用递延费用折扣券',});
                this.single = false;
              }
            }
          })
        },
        getTradeInfo(trade_code){//精确查询 获取股票行情信息接口
          this.$axios.post('/api/trade/getTradeInfo',{trade_code:trade_code})
            .then(res => {
              if(res.data.code === 0){

                this.searchCodeInfo = res.data.data;

              }else {
                this.$Notice.error({title: res.data.msg,})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,})
            })
        },
        //格式化数据
        formert(data){
          let newData = data.replace(/[a-zA-Z]/g,'');//'xbcdx'
          return newData
        },
        number1(){
          this.customMoney=this.customMoney.replace(/[^\.\d]/g,'');
          this.customMoney=this.customMoney.replace('.','');
        },
        initWebSocket(){ //初始化weosocket

          const wsurl = "ws://yjcl.yjcl88.com:8025";//ws地址

          this.websock = new WebSocket(wsurl);

          this.websock.onopen = this.websocketonopen;//WebSocket 事件 open事件
          //
          this.websock.onerror = this.websocketonerror;//WebSocket 事件 error事件
          //
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


          if(redata.price_now){
            this.damicPice = Number(redata.price_now).toFixed(2);//从ws中拿去最新的动态价格

            this.diff = Number(redata.diff).toFixed(2);//从ws中拿取的涨跌值
            this.diffRate = Number(redata.diff_rate * 100).toFixed(2);//从ws中拿取的涨跌幅


          }

          if(this.damicPice){

            this.buyCodeNum = parseInt(((this.initSelVal*10000) / (this.damicPice))/100)*100;//初始化计算可购买的股票数，默认的股票数是1万  当前资金/当前股票的最新价格
            this.moneyRate = parseFloat(this.buyCodeNum/(this.initSelVal*10000 / (this.damicPice)) * 100).toFixed(2);
          }else {
            this.buyCodeNum = '--';
            this.moneyRate = '--';
          }

          // 更新分时图
          if(redata.price_now){


            this.lineSeries.xAxis.data.push(redata.update_time);
            this.lineSeries.series[0].data.push(+redata.price_now);


            this.fsChart.setOption(this.lineSeries);


            this.todayOpen=Number(redata.price_first).toFixed(2); //今开
            this.amplitude=Number(redata.amplitude).toFixed(2); //振幅
            this.highest=Number(redata.price_high).toFixed(2); //最高
            this.lowest=Number(redata.price_low).toFixed(2); //最低
            this.hardenPrice=Number(redata.price_harden).toFixed(2); //涨停价
            this.dropStopPrice=Number(redata.price_fall_stop).toFixed(2); //跌停价
            this.tradingVolume=Number(redata.trade_count).toFixed(2); //成交量
            this.volumeMoney=Number(redata.trade_sum).toFixed(2); //成交额


            //申卖 申卖
            this.applyBuyList[4].price = Number(redata.bs.b5_price).toFixed(2)
            this.applyBuyList[4].num = Number(redata.bs.b5_count).toFixed(0)
            this.applyBuyList[3].price = Number(redata.bs.b4_price).toFixed(2)
            this.applyBuyList[3].num = Number(redata.bs.b4_count).toFixed(0)
            this.applyBuyList[2].price = Number(redata.bs.b3_price).toFixed(2)
            this.applyBuyList[2].num = Number(redata.bs.b3_count).toFixed(0)
            this.applyBuyList[1].price = Number(redata.bs.b2_price).toFixed(2)
            this.applyBuyList[1].num = Number(redata.bs.b2_count).toFixed(0)
            this.applyBuyList[0].price = Number(redata.bs.b1_price).toFixed(2)
            this.applyBuyList[0].num = Number(redata.bs.b1_count).toFixed(0)




            this.applySellList[4].price = Number(redata.bs.s5_price).toFixed(2)
            this.applySellList[4].num = Number(redata.bs.s5_count).toFixed(0)
            this.applySellList[3].price = Number(redata.bs.s4_price).toFixed(2)
            this.applySellList[3].num = Number(redata.bs.s4_count).toFixed(0)
            this.applySellList[2].price = Number(redata.bs.s3_price).toFixed(2)
            this.applySellList[2].num = Number(redata.bs.s3_count).toFixed(0)
            this.applySellList[1].price = Number(redata.bs.s2_price).toFixed(2)
            this.applySellList[1].num = Number(redata.bs.s2_count).toFixed(0)
            this.applySellList[0].price = Number(redata.bs.s1_price).toFixed(2)
            this.applySellList[0].num = Number(redata.bs.s1_count).toFixed(0)






          }




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


              }else {
                this.$Notice.error({title: res.data.msg})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg})
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
        getQuotationNow(code){//获取最新行情数据
          this.$axios.post('/api/ws/getQuotationNow',{code: code})
            .then(res => {
              if(res.data.code === 0){
                let curData = res.data.data.data;
                if(Object.keys(curData).length !== 0 && res.data.data.data.bs !== null){


                  this.lineSeries.xAxis.data = [];
                  this.lineSeries.series[0].data = [];
                  this.fsChart.setOption(this.lineSeries);


                  this.damicPice = Number(curData.price_now).toFixed(2);//从ws中拿去最新的动态价格
                  this.diff = Number(curData.diff).toFixed(2);//从ws中拿取的涨跌值
                  this.diffRate = Number(curData.diff_rate * 100).toFixed(2);//从ws中拿取的涨跌幅

                  if(this.damicPice){
                    this.buyCodeNum = parseInt(((this.initSelVal*10000) / (this.damicPice))/100)*100;//初始化计算可购买的股票数，默认的股票数是1万  当前资金/当前股票的最新价格
                    this.moneyRate = parseFloat(this.buyCodeNum/(this.initSelVal*10000 / (this.damicPice)) * 100).toFixed(2);
                  }else {
                    this.buyCodeNum = '--';
                    this.moneyRate = '--';
                  }

                  this.todayOpen=Number(curData.price_first).toFixed(2); //今开
                  this.amplitude=Number(curData.amplitude).toFixed(2); //振幅
                  this.highest=Number(curData.price_high).toFixed(2); //最高
                  this.lowest=Number(curData.price_low).toFixed(2); //最低
                  this.hardenPrice=Number(curData.price_harden).toFixed(2); //涨停价
                  this.dropStopPrice=Number(curData.price_fall_stop).toFixed(2); //跌停价
                  this.tradingVolume=Number(curData.trade_count).toFixed(2); //成交量
                  this.volumeMoney=Number(curData.trade_sum).toFixed(2); //成交额



                  //申卖 申卖
                  this.applyBuyList[4].price = Number(curData.bs.b5_price).toFixed(2)
                  this.applyBuyList[4].num = Number(curData.bs.b5_count).toFixed(0)
                  this.applyBuyList[3].price = Number(curData.bs.b4_price).toFixed(2)
                  this.applyBuyList[3].num = Number(curData.bs.b4_count).toFixed(0)
                  this.applyBuyList[2].price = Number(curData.bs.b3_price).toFixed(2)
                  this.applyBuyList[2].num = Number(curData.bs.b3_count).toFixed(0)
                  this.applyBuyList[1].price = Number(curData.bs.b2_price).toFixed(2)
                  this.applyBuyList[1].num = Number(curData.bs.b2_count).toFixed(0)
                  this.applyBuyList[0].price = Number(curData.bs.b1_price).toFixed(2)
                  this.applyBuyList[0].num = Number(curData.bs.b1_count).toFixed(0)




                  this.applySellList[4].price = Number(curData.bs.s5_price).toFixed(2)
                  this.applySellList[4].num = Number(curData.bs.s5_count).toFixed(0)
                  this.applySellList[3].price = Number(curData.bs.s4_price).toFixed(2)
                  this.applySellList[3].num = Number(curData.bs.s4_count).toFixed(0)
                  this.applySellList[2].price = Number(curData.bs.s3_price).toFixed(2)
                  this.applySellList[2].num = Number(curData.bs.s3_count).toFixed(0)
                  this.applySellList[1].price = Number(curData.bs.s2_price).toFixed(2)
                  this.applySellList[1].num = Number(curData.bs.s2_count).toFixed(0)
                  this.applySellList[0].price = Number(curData.bs.s1_price).toFixed(2)
                  this.applySellList[0].num = Number(curData.bs.s1_count).toFixed(0)


                }else {
                  this.damicPice = '--';//从ws中拿去最新的动态价格
                  this.diff = '--';//从ws中拿取的涨跌值
                  this.diffRate = '--';//从ws中拿取的涨跌幅

                  this.todayOpen='--'; //今开
                  this.amplitude='--'; //振幅
                  this.highest='--'; //最高
                  this.lowest='--'; //最低
                  this.hardenPrice='--'; //涨停价
                  this.dropStopPrice='--'; //跌停价
                  this.tradingVolume='--'; //成交量
                  this.volumeMoney='--'; //成交额


                  this.applyBuyList= [//申买数据列表
                      {id:0,price:'--',num:'--',name:'买五'},
                      {id:1,price:'--',num:'--',name:'买四'},
                      {id:2,price:'--',num:'--',name:'买三'},
                      {id:3,price:'--',num:'--',name:'买二'},
                      {id:4,price:'--',num:'--',name:'买一'},
                    ]
                    this.applySellList = [//申卖数据列表
                      {id:0,price:'--',num:'--',name:'卖五'},
                      {id:1,price:'--',num:'--',name:'卖四'},
                      {id:2,price:'--',num:'--',name:'卖三'},
                      {id:3,price:'--',num:'--',name:'卖二'},
                      {id:4,price:'--',num:'--',name:'卖一'},
                    ]
                }


              }else {
                this.$Notice.error({title: res.data.msg})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg})
            })
        },
        getTimeSharing(code){//获取分时图的历史数据
          this.$axios.post('/api/ws/getTimeSharing',{code:code})
            .then(res => {
              if(res.data.code === 0){

                this.lineSeries.xAxis.data = [];
                this.lineSeries.series[0].data = [];
                this.fsChart.setOption(this.lineSeries);

                res.data.data.list.forEach((val, index)=>{

                  this.lineSeries.xAxis.data.push((val.update_time));//x轴时间

                  this.lineSeries.series[0].data.push(+val.price_now);//y轴数据

                })
                this.fsChart.setOption(this.lineSeries)



              }else {
                this.$Notice.error({title: res.data.msg})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg});
            })
        },
        getKlineHistory(code){//获取历史k线数据
          this.$axios.post('/api/ws/getKlineHistory',{code:code,interval:'1d',})
            .then(res => {
              if(res.data.code === 0){

                this.candleSeries.series[0].data = [];

                this.candleSeries.xAxis.data = [];
                this.kchart.setOption(this.candleSeries);

                res.data.data.list.forEach((val, index) =>{

                  this.candleSeries.xAxis.data.push(val.time);

                  this.candleSeries.series[0].data.push([+val.open, +val.close, +val.low, +val.high]);

                })

                this.kchart.setOption(this.candleSeries);


              }else {
                this.$Notice.error({title: res.data.msg})
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg})
            })
        },
      },
      beforeRouteUpdate (to, from, next) {//当路径不变，只有参数query或param改变时，用watch监控不到，可以用导航守卫beforeRouteUpdate。
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`

        if(to.name == 'buy'){

          this.childShow = false;
        }else {
          this.childShow = true;
        }



        next();

      },
      watch:{
        '$route'(){
          if(this.$route.params.type == 1){

            this.isModel = false;

          }else if (this.$route.params.type == 2){

            this.isModel = true;

          }
        },
        curVal(val){
          if(val.length != 0){
            this.focusShow = false;
            this.mhSearchShow = true;
            this.selectTradeInfo(this.curVal);//调用模糊查询接口
          }
        },
        limitPrice(){
          //当是限价购买的时候，也要计算出可购买的数量和利用率this.limitPrice
          if(this.limitPrice){
            this.buyCodeNum = parseInt(((this.initSelVal*10000) / (this.limitPrice))/100)*100;//初始化计算可购买的股票数，默认的股票数是1万  当前资金/当前股票的最新价格
            this.moneyRate = parseFloat(this.buyCodeNum/(this.initSelVal*10000 / (this.limitPrice)) * 100).toFixed(2);
          }else {
            this.buyCodeNum = '--';
            this.moneyRate = '--';
          }
        },
        customMoney(curC){
          if(curC){
            this.initIndex = -1;

            this.customMoney = this.customMoney.replace(/[^0-9]*$/,"");
            this.initSelVal = +this.customMoney;

          }else {
            this.initSelVal = 1;
            this.initIndex = 0;

          }



        },
      },
      computed: {

        configMsgs (){

          return this.$store.state.NewMsg;

        },
        stopLoss (){

          let five = parseInt(-(this.initSelVal*10000 / 5) / (1 + Number(this.configMsgs.stop_loss.value)));

          let six = parseInt(-(this.initSelVal*10000 / 6) / (1 + Number(this.configMsgs.stop_loss.value)));

          let eight = parseInt(-(this.initSelVal*10000 / 8) / (1 + Number(this.configMsgs.stop_loss.value)));

          let ten = parseInt(-(this.initSelVal*10000 / 10) / (1 + Number(this.configMsgs.stop_loss.value)));


            return [{tit: ten, i: 10}, {tit: eight,i: 8}, {tit: six, i: 6}, {tit: five, i: 5} ]
        }
      },


    }
</script>

<style scoped>

  .stock-sell-section {
    padding-top: 20px;
    padding-bottom: 40px;
    background: url(../../../static/imgs/buyBG.png) no-repeat left top;
    background-size: 100%;
    min-width: 1585px;
  }
  .stock-buy {
     height: 970px;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .stock-buy .play-area {
    background-color: white;
    box-shadow: 0 0 5px 1px rgba(143,38,14,0.1);
    padding-left: 4px;
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
  .stock-buy .play-area > section {
    padding: 40px 50px 20px;
    box-sizing: border-box;
  }
  .stock-buy .left-info {
    width: 570px;
    float: left;
    border-right: 1px solid #f1f1f1;
    position: relative;
    padding-right: 50px;
    box-sizing: border-box;
  }
  .stock-buy .right-buy {
    width: 480px;
    float: right;
    color: #4c4c4c;
    font-size: 16px;
  }
  .stock-buy .change-stock {
    width: 520px;
    height: 40px;
    margin: 0px auto;
    font-size: 16px;
  }
  .stock-buy .left-info .stock-name {
    margin-top: 30px;
    vertical-align: middle;
  }
  .change-stock .icon-search {
    display: block;
    width: 40px;
    text-align: right;
    font-size: 18px;
    color: #c7c7c7;
    float: left;
    line-height: 40px;
    border-top: 1px solid #ff4519;
    border-left: 1px solid #ff4519;
    border-bottom: 1px solid #ff4519;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .change-stock .search_txt {
    width: 310px;
    line-height: 38px;
    border-radius: 0px;
    float: left;
    border-top: 1px solid #ff4519;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #ff4519;
    padding: 1px 0;
    padding-left: 10px;
  }
  .change-stock .searchConfirm {
    float: left;
    display: block;
    width: 158px;
    color: white;
    line-height: 40px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #ff4519;
    border: 1px solid #ff4519;
    cursor: pointer;
    outline: none;
    padding: 0;
  }
  .search-table {
    width: 460px;
    top: 50px;
    border: 1px solid #ff4519;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    position: absolute;
    z-index: 10;
    background-color: white;
    padding: 0 30px;
  }
  #search_cue {
    max-height: 450px;
    overflow: auto;
  }
  .search-table table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }
  .search-table table th {
    font-size: 16px;
    color: #808080;
    line-height: 44px;
    font-weight: 500;
    border-bottom: 1px solid #c7c7c7;
    width: 33.33%;
  }
  .search-table table tbody tr {
    cursor: pointer;
    color: rgba(0,0,0,0.8);
  }
  .search-table table tbody tr:hover {
    color: #ff4519;
  }
  .stock-buy .change-stock .empty td {
    border: none;
    cursor: default;
    text-align: center;
  }
  .search-table table td {
    text-align: center;
    width: 33.33%;
    line-height: 40px;
  }
  .search-table {
    width: 460px;
    top: 50px;
    border: 1px solid #ff4519;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    position: absolute;
    z-index: 10;
    background-color: white;
    padding: 0 30px;
  }
  .hide {
    display: none;
  }
  .stock-buy .left-info .stock-name {
    margin-top: 30px;
    vertical-align: middle;
  }
  .stock-buy .left-info .stock-name-left {
    float: left;
  }
  .stock-buy .left-info .stock-name-left h4 {
    font-size: 30px;
    color: #4c4c4c;
    font-weight: normal;
  }
  .stock-buy .left-info .stock-name label {
    font-size: 20px;
    margin-left: 10px;
  }
  .stock-buy .left-info .stock-name-left p {
    font-size: 18px;
    color: #808080;
  }
  .stock-buy .left-info .stock-name-right {
    float: right;
    text-align: right;
  }
  .red {
    color: #ff4519 !important;
  }
  .stock-buy .left-info .stock-name-right h5 {
    font-size: 30px;
    font-weight: normal;
  }
  .stock-buy .left-info .stock-name-right p {
    font-size: 18px;
    line-height: 1;
  }
  .stock-buy .left-info .stock-name-right span {
    padding-left: 20px;
  }
  .stock-buy .left-info i.icon-refresh {
    float: right;
    display: block;
    font-size: 30px;
    padding-top: 14px;
    color: #808080;
    cursor: pointer;
  }
  .stock-buy .stock-figure {
    width: 520px;
    margin-top: 10px;
  }
  .stock-buy .stock-figure li {
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    color: #c7c7c7;
    width: 60px;
    text-align: center;
    line-height: 30px;
    position: relative;
  }
  .stock-buy .stock-figure li.active {
    color: #ff4519;
  }
  .group:after, .container:after, .field-wrapper:after, .row:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  .stock-buy .figure {
    width: 520px;
    margin-top: 16px;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    background: none;
    cursor: default;
  }
  .stock-buy .stock-info {
    margin-top: 20px;
    color: #808080;
    font-size: 14px;
  }
  .stock-buy .stock-info li {
    width: 25%;
    margin-bottom: 8px;
    float: left;
  }
  .stock-buy .stock-info span.l {
    margin-right: 10px;
  }
  .stock-buy .right-buy {
    width: 480px;
    float: right;
    color: #4c4c4c;
    font-size: 16px;
  }
  .stock-buy .buy_price .top {
    font-size: 18px;
  }
  .stock-buy .buy_price .top > span {
    font-size: 14px;
    color: #ff4519;
  }
  .f-right {
    float: right;
  }
  .stock-buy .play-area .right-buy select, .stock-buy .play-area .right-buy ul, .stock-buy .play-area .right-buy li, .stock-buy .play-area .right-buy label, .stock-buy .play-area .right-buy em, .stock-buy .play-area .right-buy b, .stock-buy .play-area .right-buy i {
    display: inline-block;
    font-style: normal;
    font-weight: normal;
  }
  .stock-buy .buy_price b {
    width: 22px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background-color: #ffdad1;
    color: #ff4519;
    margin: 0 5px;
    border-radius: 3px;
  }
  .right-buy .buy_price ul {
    width: 490px;
    margin-top: 10px;
  }
  .right-buy .ul-list li {
    width: 110px;
    float: left;
    height: 40px;
    margin-top: 8px;
    margin-right: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    cursor: pointer;
  }
  .right-buy p.efficiency {
    line-height: 20px;
    margin-top: 10px;
  }
  .right-buy .efficiency> span {
    margin-right: 50px;
  }
  .right-buy .efficiency> input {
    padding: 6px ;
    border: 1px solid #ff4519;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 16px;
  }
  .right-buy .open-time {
    margin-top: 10px;
  }
  .right-buy .open-time > span, .right-buy .check-surplus > span, .right-buy .stop-loss > span, .right-buy .com_fee > span, .right-buy .perf_bond > span, .right-buy .delay_condition span, .right-buy .delay_fee span, .right-buy .efficiency > span {
    line-height: 44px;
    font-size: 18px;
  }
  .delay_tip {
    position: relative;
    display: inline-block;
    margin-right: 10px;
  }
  .delay_tip i {
    margin-right: 6px;
    vertical-align: middle;
    color: #5cb1ff;
    font-size: 30px;
  }
  .delay_tip > div.showtip {
    display: none;
    font-size: 12px;
    position: absolute;
    width: 242px;
    line-height: 18px;
    padding: 10px;
    top: -20px;
    left: 40px;
    color: #666;
    border-radius: 5px;
    border: 1px solid #F2DF1C;
    z-index: 999;
    background-color: #FFFDE7;
    text-align: justify;
  }
  .delay_tip > div.showtip {
    display: none;
    font-size: 12px;
    position: absolute;
    width: 242px;
    line-height: 18px;
    padding: 10px;
    top: -20px;
    left: 40px;
    color: #666;
    border-radius: 5px;
    border: 1px solid #F2DF1C;
    z-index: 999;
    background-color: #FFFDE7;
    text-align: justify;
  }
  .right-buy .open-time li.active, .right-buy .check-surplus li.active, .right-buy .com_fee strong, .right-buy .perf_bond strong, .right-buy .delay_condition em {
    color: #ff4519;
    font-size: 20px;
    font-weight: normal;
  }
  .right-buy .ul-list li.active {
    background-color: #ff4519;
    border: 1px solid #ff4519;
    color: #fff;
  }
  .right-buy .com_fee .old, .right-buy .delay_fee .old {
    text-decoration: line-through;
    color: #ff4519;
    font-size: 20px;
  }
  .right-buy .delay_fee em {
    color: #ff4519;
    font-size: 20px;
    font-weight: normal;
  }
  .disabled {
    background: #c7c7c7 !important;
    color: #fff !important;
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
  .color-btn.disabled:before,.color-btn.disabled:after {
    background-color: #eeeeee;
  }
  .color-btn:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 55px;
    width: 20px;
    height: 40px;
    -moz-transform: skewX(-45deg);
    -webkit-transform: skewX(-45deg);
    -o-transform: skewX(-45deg);
    -ms-transform: skewX(-45deg);
    transform: skewX(-45deg);
    background-color: #ff7807;
  }
  .color-btn:after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 84px;
    width: 6px;
    height: 40px;
    -moz-transform: skewX(-45deg);
    -webkit-transform: skewX(-45deg);
    -o-transform: skewX(-45deg);
    -ms-transform: skewX(-45deg);
    transform: skewX(-45deg);
    background-color: #ff7807;
  }
  .stock-buy .right-buy > div.protocol_row {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .protocol_row-agree {
    position: relative;
    line-height: 46px;
    padding-left: 10px;
    font-size: 14px;
    color: #808080;
  }
  .protocol_row-agree input[type='checkbox'] {
    width: 16px;
    height: 16px;
    opacity: 0;
  }
  .protocol_row-agree input:checked + label {
    background-color: #ff4519;
  }
  .protocol_row-agree label {
    position: absolute;
    left: 4px;
    top: 14px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #c7c7c7;
  }
  .protocol_row-agree input + label:after {
    position: absolute;
    content: " ";
    width: 3px;
    height: 6px;
    top: 4px;
    left: 6px;
    border: 2px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
  .protocol_row a {
    display: block;
    font-size: 14px;
    line-height: 1.9;
    color: #5cb1ff;
  }
  input:focus {
    outline: none;
  }
  .right-buy .ul-list li:hover {
    border: 1px solid #ff4519;
    color: #ff4519;
  }
  .right-buy .ul-list li.active {
    background-color: #ff4519;
    border: 1px solid #ff4519;
    color: #fff;
  }
  .protocol_row h4 {
    font-size: 16px;
    color: #4c4c4c;
    line-height: 60px;
    font-weight: normal;
  }
  .stock-buy .stock-detail{
    margin-top: 20px;
  }
  .stock-buy .stock-percentage .buy {
    float: left;
    text-align: left;
    color: #ff4519;
    width: 50%;
  }
  .stock-buy .stock-percentage .sell {
    float: right;
    text-align: right;
    color: #00d47d;
    width: 50%;
  }
  .stock-buy .stock-percentage p {
    font-size: 16px;
  }
  .stock-buy .stock-price {
    margin-top: 8px;
  }
  .stock-buy .stock-detail ul {
    width: 50%;
    float: left;
  }
  .stock-buy .stock-detail em {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    color: white;
    text-align: center;
    border-radius: 3px;
    margin-left: 16px;
  }
  .stock-buy .stock-detail .buy em {
    background-color: #ff4519;
  }
  .stock-buy .stock-detail b {
    font-size: 14px;
    padding-left: 10px;
    line-height: 16px;
  }
  .stock-buy .stock-detail i {
    float: right;
    color: #4d4d4d;
    font-size: 14px;
    padding-right: 10px;
  }
  .stock-buy .stock-detail em {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    color: white;
    text-align: center;
    border-radius: 3px;
    margin-left: 16px;
  }
  .stock-buy .stock-detail .sell em {
    background-color: #00d47d;
  }
  .green {
    color: green !important;
  }
  .stock-buy .buy_price .top > select{
    font-size: 14px;
    color: #ff4519;
  }

</style>
