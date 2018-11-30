<template>
  <div>
    <!--轮播-->
    <section id="carousel" class="index-header">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <!--<swiper-slide><img src="../../static/imgs/banner1.jpg" alt=""></swiper-slide>-->
        <!--<swiper-slide><img src="../../static/imgs/banner2.jpg" alt=""></swiper-slide>-->
        <!--<swiper-slide><router-link to="/buy/2"><img src="../../static/imgs/banner3.jpg" alt=""></router-link></swiper-slide>-->
        <swiper-slide v-for="(item,index) in banner" :key="index"><router-link :to="index === 1?'/buy/2':(index === 2? '/reg':'/')"><img :src="item.bannerVal" alt=""></router-link></swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev icon-chevron-thin-left" slot="button-prev"></div>
        <div class="swiper-button-next icon-right" slot="button-next"></div>
      </swiper>
      <!--轮播上的登录-->
      <div class="container" id="index-login-form">
        <div class="index-login un-login" v-if="!loginState">
          <h4>请登录赢家策略</h4>
          <router-link class="login-btn" id="login-btn" to="/login">前往登录</router-link>
          <p class="index-reg">还没账号？<router-link class="link-reg" to="/reg">立即注册</router-link></p>
          <!--<div class="notice clearfix">-->
            <!--<p class="fl wangzhangonggao"><router-link to="/">2018国庆节赢家策略平台放假通知</router-link></p>-->
            <!--<router-link class="fr paddingRight" to="/">更多</router-link>-->
          <!--</div>-->
        </div>
        <div class="index-login login" v-if="loginState">
          <h3>您好！<span id="index-login-form-nickname">{{userData.user_name}}</span></h3>
          <p class="welcome">欢迎回来</p>

          <p class="money-title">账户余额(元)<router-link class="recharge" to="/user/topUp">充值</router-link></p>
          <p class="p-money" id="index-login-form-mb">{{balance}} 元</p>
          <ul class="clearfix">
            <li>
              <p>抵用券（元）</p>
              <p id="diyongquan">{{tradeInfo.money || 0}}</p>
            </li>
            <li>
              <p>今日买入策略（元）</p>
              <p id="today-buy">{{tradeInfo.today_money || 0}}</p>
            </li>
          </ul>
          <router-link class="login-btn" to="/buy/1">点买策略</router-link>
          <div class="notice2 clearfix" id="goToVerify" v-if="getRealNameStatus === 0 || getRealNameStatus === 3">
            <p class="fl">保障资金安全，确认策略人身份，请先进行实名认证。</p>
            <router-link class="fr" to="/user/security">马上认证</router-link>
          </div>
          <!--<div class="notice clearfix" id="goToNotice" v-else>-->
            <!--<p class="fl wangzhangonggao"><a href="/company/noticemore">2018国庆节赢家策略平台放假通知</a></p>-->
            <!--<a class="fr paddingRight" href="/company/noticemore">更多</a>-->
          <!--</div>-->
        </div>
      </div>
    </section>
    <!--概览-->
    <section class="overall">
      <div class="container">
        <ul class="clearfix">
          <li>
            <i class="icomoon icon-active-num"></i>
            <div>
              <h4 id="user_count">5573</h4>
              <p>活跃用户人数</p>
            </div>
          </li>
          <li>
            <i class="icomoon icon-profit-num"></i>
            <div>
              <h4 id="total_profit">43315174.59</h4>
              <p>累计盈利金额</p>
            </div>
          </li>
          <li>
            <i class="icomoon icon-strategy-num"></i>
            <div>
              <h4 id="stockplan_count">88267</h4>
              <p>累计匹配策略</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!--贸易列表-->
    <section class="tradelist">
      <div class="sec_header">
        <h3>
          活动公告
          <span >
            <router-link to="/reg">1.注册即送3000元操作模拟金</router-link> |
            <router-link to="/user/topUp">2.实盘充值5000，即送500递延费折扣券等值收益（多充多送）</router-link>
        </span>
        </h3>
      </div>
      <div class="container clearfix">
        <h4>交易动态</h4>
        <div id="trading" class="trade-scroll" @mouseover="stopTop('trading')" @mouseout="continueTop('trading')">
          <ul id="trading1" v-show="tradingList.length > 0">
            <li class="clearfix" v-for="item in tradingList">
              <span>{{item.nick_name}}</span>
              <span>{{item.create_time}}</span>
              <span>{{item.title}} {{item.code}}</span>
              <span>{{item.amount}}</span>
              <span>{{item.transaction_money}}</span>
              <router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>
            </li>
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
          </ul>
          <ul id="trading2" v-show="tradingList.length > 5">
            <li class="clearfix" v-for="item in tradingList">
              <span>{{item.nick_name}}</span>
              <span>{{item.create_time}}</span>
              <span>{{item.title}} {{item.code}}</span>
              <span>{{item.amount}}</span>
              <span>{{item.transaction_money}}</span>
              <router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>
            </li>
            <!--<li class="clearfix">-->
              <!--<span>炫烨2</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
            <!--<li class="clearfix">-->
              <!--<span>炫烨</span>-->
              <!--<span>3分钟前</span>-->
              <!--<span>青岛海尔 600690</span>-->
              <!--<span>50</span>-->
              <!--<span>$6000</span>-->
              <!--<router-link class="goToBuyNow" to="/buy/1">立即点买</router-link>-->
            <!--</li>-->
          </ul>
        </div>
      </div>
    </section>
    <section class="mewsList">
      <div class="container">
        <div class="item">
          <h4>财经新闻</h4>
          <div class="groupnews_insideL" style="width:100%;height: 300px;overflow:hidden;position:relative;">
            <iframe width="188%" height="270%" frameborder="0" style="position:relative; top:-512px; float:left; left:-366px;" scrolling="no" src="https://finance.sina.com.cn/stock/"></iframe>
          </div>
          <!--<div id="financeNews" class="trade-scroll" @mouseover="stopTop('financeNews')" @mouseout="continueTop('financeNews')">-->
            <!--<ul id="financeNews1" v-show="newsList.length > 0">-->
              <!--<li class="clearfix" v-for="item in newsList" @click="openContentDetails(item)">-->
                <!--<p>{{item.title}}</p>-->
              <!--</li>-->
            <!--</ul>-->
            <!--<ul id="financeNews2" v-show="newsList.length > 5">-->
              <!--<li class="clearfix" v-for="item in newsList" @click="openContentDetails(item)">-->
                <!--<p>{{item.title}}</p>-->
              <!--</li>-->
            <!--</ul>-->
            <!--<p class="thereNo" v-show="newsList.length === 0">暂无信息...</p>-->
          <!--</div>-->
        </div>
        <div class="item">
          <h4>公司新闻 <router-link class="fr" to="/article/1">更多</router-link></h4>
          <div id="conNews" class="trade-scroll">
            <ul id="conNews1" v-show="newsList.length > 0">
              <li class="clearfix" v-for="item in newsList" @click="openContentDetails(item)">
                <p>
                  <a href="javascript: void (0)" class="fl" :title="item.title">{{item.title}}</a>
                  <span class="fr">{{item.create_time}}</span>
                </p>
              </li>
            </ul>
            <!--<ul id="conNews2" v-show="newsList.length > 5">-->
              <!--<li class="clearfix" v-for="item in newsList" @click="openContentDetails(item)">-->
                <!--<p>{{item.title}}</p>-->
              <!--</li>-->
            <!--</ul>-->
            <p class="thereNo" v-show="newsList.length === 0">暂无信息...</p>
          </div>
        </div>
        <div class="item">
          <h4>专业机构 <router-link class="fr" to="/article/2">更多</router-link></h4>
          <div id="proIns" class="trade-scroll">
            <ul id="proIns1" v-show="proInsList.length > 0">
              <li class="clearfix" v-for="item in proInsList" @click="openContentDetails(item)">
                <p>
                  <a href="javascript: void (0)" class="fl" :title="item.title">{{item.title}}</a>
                  <span class="fr">{{item.create_time}}</span>
                </p>
              </li>
            </ul>
            <!--<ul id="proIns2" v-show="proInsList.length > 5">-->
              <!--<li class="clearfix" v-for="item in proInsList" @click="openContentDetails(item)">-->
                <!--<p>{{item.title}}</p>-->
              <!--</li>-->
            <!--</ul>-->
            <p class="thereNo" v-show="proInsList.length === 0">暂无信息...</p>
          </div>
        </div>
      </div>
    </section>
    <!--产品介绍-->
    <section class="product-info">
      <div class="container">
        <div class="sec_header">
          <h3>策略动态<span>第一时间了解大神们的策略！</span></h3>
        </div>
        <ul>
          <li class="bg-red clearfix">
            <div class="left-info">
              <h3>赢家策略</h3>
              <!--<h4>200%</h4>-->
              <p>5倍 - 10倍</p>
            </div>
            <div class="right-info clearfix">
              <div class="part1">
                <router-link id="question-exp-guide" to="/help">如何点买？</router-link>
              </div>
              <div class="part2">
                <h5>持仓时间</h5>
                <p><span>T</span>+n个交易日</p>
              </div>
              <div class="part3">
                <p><span>1000</span>元起</p>
                <router-link to="/buy/1">创建策略</router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!--客户端下载-->
    <!--<section class="app-info">-->
      <!--<div class="container">-->
        <!--<div class="sec_header"><h3>客户端下载<span>随时随地抓住行情！</span></h3></div>-->
      <!--</div>-->
    <!--</section>-->
    <!--合作伙伴-->
    <section class="cooperation">
      <div class="container">
        <div class="sec_header">
          <h3>合作伙伴</h3>
        </div>
        <img src="../../static/imgs/cooperation.jpg" alt="">
      </div>
    </section>

    <!--朦版-->
    <div class="mask" id="mask"></div>
    <!--财经新闻/专业机构 内容详情-->
    <div class="popup" id="popupCon">
      <div class="bar-percentage">
        <i class="icomoon icon-error" id="close-popupCon" @click="closeContentDetails()"></i>
      </div>
      <h3>{{contentDetails.title}}</h3>
      <div class="details" v-html="contentDetails.content"></div>

    </div>

  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: "index",
    data() {
      return {
        banner: [], //获取banner图
        loginState: false, //登录状态
        userData: {}, //个人信息
        realNameStatus: 0, //实名认证状态
        balance: 0, //余额
        tradeInfo: {}, //策略信息
        tradingList: [], //交易动态
        swiperOption: {
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　　　　　　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          autoplay: true, //自动轮播
          delay: 2000, //两秒切换
          loop: true,
          grabCursor: true,
          setWrapperSize: true,
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          paginationType: 'bullets',
          paginationClickable: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          observeParents: true,
        },
        tradingTimer: null,
        // proInsTimer: null,
        // conNewsTimer: null,
        tradinglist: [], //交易动态列表
        proInsList: [], //专业机构列表
        newsList: [],// 公司新闻列表
        contentDetails: {}, //财经新闻 专业机构详情内容
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    created() {
      this.configData.then(() => {
        this.curWebInfos = this.$store.state.NewMsg;//获取初始化配置数据
        this.banner.push(
          {bannerVal: `${process.env.API_HOST}${this.curWebInfos.banner_one.value}`},
          {bannerVal: `${process.env.API_HOST}${this.curWebInfos.banner_two.value}`},
          {bannerVal: `${process.env.API_HOST}${this.curWebInfos.banner_three.value}`},
        );
      })
      if(localStorage.getItem('_auth')) {
        this.loginState = true;
        this.getUserData();
        this.getRealNameStatus();
        this.getShowBalance();
        this.getTradeInfo();
      }else {
        this.loginState = false;
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      },
    },
    mounted() {
      this.getInfoList(1);
      this.getInfoList(2);
      this.getTradingList();
      this.upTop('trading');
      // this.upTop('proIns');
      // this.upTop('conNews')
    },
    beforeDestroy() { //销毁组件前 清除计时器
      clearInterval(this.tradingTimer);
      // clearInterval(this.proInsTimer);
      // clearInterval(this.conNewsTimer);
    },
    methods: {
      getUserData() { //获取个人信息
        this.$axios.post('/api/user/userInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.userData = res.data.data
          }
        })
      },
      getRealNameStatus() { //获取实名状态
        this.$axios.post('/api/user/getRealNameStatus', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.realNameStatus = res.data.data.status;
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
      getTradingList() { //获取交易动态
        this.$axios.post('/api/common/getIndexInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.tradingList = res.data.data.data
          }
        })
      },
      getInfoList(type) {
        this.$axios({
          url: '/api/article/getInfoByType',
          method: 'post',
          data: {
            type: type
          },
        }).then(res => {
          if(res.data.code === 0) {
            if(type === 1) { //1 公司新闻
              if(res.data.data.length > 8) {
                this.newsList = res.data.data.slice(0, 8)
              }else {
                this.newsList = res.data.data
              }
            }
            if(type === 2) { //2 专业机构
              if(res.data.data.length > 8) {
                this.proInsList = res.data.data.slice(0, 8)
              }else {
                this.proInsList = res.data.data
              }
            }
          }
        })
      },
      upTop(id) { //盒子向上
        const timer = setInterval(() => {
          if (document.getElementById(id + "2").offsetTop - document.getElementById(id).scrollTop <= 0){
            document.getElementById(id).scrollTop -= document.getElementById(id + "1").offsetHeight
          }else {
            document.getElementById(id).scrollTop++
          }
        }, 50);
        switch (id) {
          case 'trading':
            this.tradingTimer = timer
            break;
          // case  'proIns':
          //   this.proInsTimer = timer
          //   break;
          // case  'conNews':
          //   this.conNewsTimer = timer
          //   break;
        }
      },
      stopTop(that) { //停止滑中盒子
        switch (that) {
          case 'trading':
            clearInterval(this.tradingTimer)
            break;
          // case  'proIns':
          //   clearInterval(this.proInsTimer)
          //   break;
          // case  'conNews':
          //   clearInterval(this.conNewsTimer)
          //   break;
        }
      },
      continueTop(that) { //开启滑中盒子
        switch (that) {
          case 'trading':
            this.upTop('trading')
            break;
          // case  'proIns':
          //   this.upTop('proIns')
          //   break;
          // case  'conNews':
          //   this.upTop('conNews')
          //   break;
        }
      },
      openContentDetails(conDetails) { //获取详情
        // console.log(this.$aaa)

        this.contentDetails = conDetails;
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
      },
      closeContentDetails() {
        this.contentDetails = {};
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popupCon').css({'display': 'none'});
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  /*轮播登录*/
  .index-header .index-login {
    height: 470px;
    width: 318px;
    background-color: rgba(0,0,0,0.6);
    border-radius: 5px;
    color: white;
    position: absolute;
    bottom: 40px;
    right: 0;
  }
  /*未登录*/
  .index-header .index-login h4 {
    font-size: 24px;
    font-weight: normal;
    line-height: 100px;
    text-align: center;
    margin-top: 50px
  }
  .index-header .index-login input {
    background-color: white;
    padding-left: 22px;
    border-radius: 5px;
    width: 260px;
    height: 40px;
    line-height: 40px;
    color: #4c4c4c;
    font-size: 16px;
    border: none;
    display: block;
    margin: 0 auto;
  }
  .index-header .index-login input.sec-input {
    margin-top: 20px;
  }
  .index-header .un-login .index-forget {
    padding-right: 20px;
  }
  .index-header .un-login a {
    display: block;
    line-height: 54px;
    color: white;
    font-size: 16px;
  }
  .index-header .index-login .login-btn {
    display: block;
    background-color: #ff4519;
    color: white;
    cursor: pointer;
    width: 260px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
  }
  .index-header .index-login .index-reg {
    text-align: center;
    line-height: 1;
    padding: 38px 0;
  }
  .index-header .index-login .index-reg a {
    display: inline-block;
    padding-bottom: 2px;
    border-bottom: 1px solid #fff;
    line-height: 1;
    padding-right: 0;
  }
  .index-header .index-login .notice {
    background: url('../../static/imgs/notice-bg.png') no-repeat center center;
    position: absolute;
    z-index: 102;
    bottom: 38px;
    left: -42px;
    height: 78px;
    width: 400px;
  }
  .index-header .index-login .notice p {
    width: 320px;
    line-height: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .index-header .index-login .notice a {
    line-height: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .index-header .index-login .notice a:nth-child(1) {
    padding-left: 86px;
  }
  .index-header .index-login .notice a.paddingRight {
    padding-right: 40px;
  }
  /*已登录*/
  .index-header .login h3 {
    margin-top: 38px;
    text-align: center;
    font-size: 24px;
    line-height: 1;
    font-weight: normal;
  }
  .index-header .login p {
    font-size: 16px;
    width: 260px;
    margin: 0 auto;
  }
  .index-header .login .welcome {
    padding-bottom: 18px;
    border-bottom: 1px solid white;
    text-align: center;
    line-height: 38px;
  }
  .index-header .login .money-title {
    padding-top: 20px;
  }
  .index-header .login .recharge {
    display: inline-block;
    width: 38px;
    height: 20px;
    border-radius: 3px;
    background-color: #ff4519;
    color: white;
    text-align: center;
    line-height: 20px;
    margin-left: 20px;
  }
  .index-header .login .p-money {
    font-size: 30px;
  }
  .index-login ul {
    width: 260px;
    margin: 20px auto;
  }
  .index-login ul li:nth-child(1) {
    float: left;
    width: 108px;
    border-right: 1px solid rgba(255,255,255,0.3);
  }
  .index-login ul li:nth-child(2) {
    width: 134px;
    float: right;
  }
  .index-header .index-login .login-btn {
    display: block;
    background-color: #ff4519;
    color: white;
    cursor: pointer;
    width: 260px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
  }
  .index-header #goToNotice a {
    color: white !important;
  }
  /*未实名*/
  .index-header .login .notice2 {
    background: url('../../static/imgs/verify-bg.png') no-repeat center center;
    position: absolute;
    z-index: 102;
    bottom: 38px;
    left: -42px;
    height: 78px;
    width: 400px;
  }
  .index-header .login .notice2 p {
    width: 210px;
    padding-left: 34px;
    padding-top: 16px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .index-header .login .notice2 a {
    display: block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: white;
    text-align: center;
    color: #ff4519;
    border-radius: 5px;
    margin-top: 22px;
    margin-right: 40px;
  }
  /*概览*/
  .overall ul {
    position: absolute;
    z-index: 100;
    width: 1180px;
    height: 120px;
    top: -25px;
    left: 10px;
    color: white;
    background: #ffc300;
    /*background: linear-gradient(left, #ffc300,#ff9100);*/
    /*background: -moz-linear-gradient(left, #ffc300,#ff9100);*/
    /*background: -webkit-linear-gradient(left,#ffc300,#ff9100);*/
    /*background: -o-linear-gradient(left,#ffc300,#ff9100);*/
    text-align: center;
  }
  .overall ul li {
    float: left;
    width: 33.33%;
  }
  .overall ul li i {
    display: inline-block;
    font-size: 60px;
    line-height: 120px;
    padding-right: 10px;
  }
  .overall ul li > div {
    display: inline-block;
  }
  .overall ul li h4 {
    font-size: 30px;
    font-weight: normal;
  }
  .overall ul li p {
    font-size: 16px;
  }
  /*贸易列表*/
  .tradelist, .mewsList {
    background-color: #fff;
  }
  .tradelist .sec_header {
    background-color: #f7f7f7;
    padding: 120px 0 18px;
  }
  .sec_header {
    width: 100%;
  }
  .sec_header h3 {
    color: #4c4c4c;
    font-size: 24px;
    width: 1200px;
    margin: 0 auto;
    line-height: 24px;
  }
  .sec_header h3:before {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    height: 24px;
    width: 4px;
    background-color: #ff4519;
    margin-right: 10px;
  }
  .sec_header h3 span {
    padding-left: 10px;
    font-size: 16px;
    color: #808080;
    font-weight: normal;
  }
  .mewsList .item {
    float: left;
    width: calc(100% / 3);
  }
  /*.mewsList .item + .item {*/
    /*margin-left: 8%;*/
  /*}*/
  .tradelist h4,
  .mewsList h4 {
    font-size: 20px;
    color: #4c4c4c;
    padding: 20px 0 7px;
    line-height: 1;
  }
  .mewsList h4 a {
    font-size: 12px;
    margin: 5px 10px 0;
    color: #ccc;
  }
  .tradelist h4 {
    border-top: 1px solid #eaeaea;
    /*text-align: center;*/
  }
  .tradelist h4:before,
  .mewsList h4:before {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    height: 12px;
    width: 2px;
    background-color: #808080;
    margin-right: 10px;
  }
  .trade-scroll {
    height: 450px;
    overflow: hidden;
  }
  .mewsList .item .trade-scroll {
    height: 326px;
  }
  .tradelist li,
  .mewsList .item li {
    line-height: 90px;
    text-align: center;
    font-size: 14px;
    color: #4c4c4c;
  }
  .mewsList .item li {
    line-height: 40px;
  }
  .tradelist li:not(:last-child),
  .mewsList .item li:not(:last-child) {
    border-bottom: 1px dashed #f2f2f2;
  }
  .tradelist li span{
    display: block;
    float: left;
    width: calc(100% / 6);
  }
  .tradelist li a{
    display: block;
    width: 98px;
    height: 40px;
    border: 1px solid #ff4519;
    color: #ff4519;
    font-size: 14px;
    line-height: 40px;
    float: right;
    margin-top: 24px;
    border-radius: 5px;
  }
  .mewsList .item li p {
    width: 100%;
    text-align: left;
    padding-left: 5%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .mewsList .item li p a {
    width: 60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .mewsList .item li p span {
    width: 40%;
    text-align: right;
  }
  /*产品介绍*/
  .product-info {
    height: 320px;
  }
  .product-info .sec_header {
    padding: 32px 0 20px;
  }
  .product-info li {
    width: 100%;
  }
  .product-info li .left-info {
    width: 268px;
    height: 220px;
    float: left;
    position: relative;
    color: white;
    line-height: 1;
    text-align: center;
  }
  .bg-red .left-info {
    background: url('../../static/imgs/bg-red.jpg') no-repeat center center;
  }
  .product-info li .left-info h3 {
    font-size: 34px;
    padding: 50px 0 35px;
  }
  .product-info li .left-info h4 {
    font-size: 24px;
    font-weight: normal;
  }
  .product-info li .left-info p {
    font-size: 16px;
    padding-top: 44px;
  }
  .bg-red .left-info:after {
    display: block;
    content: " ";
    width: 0;
    height: 0;
    border-bottom: 20px solid #af3317;
    border-right: 10px solid transparent;
    position: absolute;
    top: 0;
    right: -10px;
    z-index: 100;
  }
  .product-info li .right-info {
    float: right;
    width: 930px;
    height: 200px;
    margin-top: 18px;
    background-color: white;
    border: 1px solid #e6e6e6;
    font-size: 16px;
    line-height: 1;
    color: #4c4c4c;
  }
  .product-info .right-info .part1 {
    width: 310px;
    float: left;
    text-align: center;
  }
  .bg-red .right-info .part1 a {
    border: 1px solid #ff4b21;
    color: #ff4b21;
  }
  .bg-red .right-info .part1 a:hover {
    background: #ff4b21;
    color: #fff;
  }
  .product-info .right-info .part1 a {
    display: block;
    width: 180px;
    height: 40px;
    line-height: 40px;
    margin: 80px auto 0;
    font-size: 16px;
    border-radius: 5px;
  }
  .product-info .right-info .part2 {
    float: left;
    width: 270px;
    margin-top: 18px;
    padding: 0 20px;
    border-left: 1px solid #f2f2f2;
    height: 170px;
  }
  .product-info .right-info .part2 h5 {
    font-size: 16px;
    font-weight: normal;
    border-bottom: 1px solid #f2f2f2;
    padding: 29px 0 40px;
    text-align: center;
  }
  .product-info .right-info .part2 p {
    padding-top: 30px;
    padding-left: 15px;
    text-align: center;
  }
  .product-info .right-info .part2 p span {
    font-size: 30px;
  }
  .product-info .right-info .part3 {
    float: left;
    width: 266px;
    margin: 18px 0;
    padding: 0 20px;
    border-left: 1px solid #f2f2f2;
    height: 170px;
    text-align: center;
  }
  .product-info .right-info .part3 p {
    border-bottom: 1px solid #f2f2f2;
    padding: 15px 0 40px;
  }
  .product-info .right-info .part3 p span {
    font-size: 30px;
    padding-right: 5px;
  }
  .bg-red .right-info .part3 a {
    background-color: #ff4b21;
  }
  .product-info .right-info .part3 a {
    margin: 30px auto 0;
    display: block;
    width: 180px;
    height: 40px;
    color: white;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    border-radius: 5px;
  }
  /*客户端下载*/
  /*.app-info {*/
    /*background: url('../../static/imgs/appInfo-bg.jpg') no-repeat center center;*/
    /*height: 400px;*/
  /*}*/
  /*.app-info .sec_header h3 {*/
    /*color: white;*/
    /*padding-top: 20px;*/
  /*}*/
  /*.app-info .sec_header h3 span {*/
    /*color: white;*/
  /*}*/
  /*合作伙伴*/
  .cooperation {
    background: #fff;
  }
  .cooperation .sec_header {
    padding: 32px 0 10px;
  }
  .cooperation img {
    width: 100%;
  }
  /*暂无消息*/
  .thereNo {
    text-align: center;
    line-height: 200px;
    font-size: 16px;
    color: #808080;
  }

  /*朦版*/
  .mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.4);
  }
  /*弹出框*/
  .popup {
    display: none;
    position: fixed;
    z-index: 1001;
    left: 50%;
    top: 0;
    width: 500px;
    background-color: #ffffff;
    box-shadow: 0 0 6px 0 #ffd9d0;
    -moz-transition-duration: .4s;
    -webkit-transition-duration: .4s;
    transition-duration: .4s;
    border-radius: 10px;
  }
  #popupCon {
    width: 800px;
    margin-left: -400px;
    max-height: 600px;
    z-index: 1003;
    overflow-y: auto;
    overflow-x: hidden;
  }
  #popupCon .bar-percentage {
    width: 440px;
    height: 6px;
    border-radius: 3px;
    margin: 40px auto 0;
    position: relative;
  }
  #popupCon .bar-percentage .icon-error {
    position: absolute;
    top: -30px;
    right: -160px;
    font-size: 30px;
    /*color: white;*/
    cursor: pointer;
  }
  #popupCon h3 {
    text-align: center;
  }
  #popupCon .details {
    line-height: 22px;
    font-size: 14px;
    padding: 30px;
  }

</style>
