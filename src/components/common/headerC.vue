<template>
    <div>
      <header class="page-header" :class="pointBuy? 'page-header2': ''">
        <div class="top-bar group" :class="pointBuy? 'top-bar2': ''">
          <div class="container">
            <ul class="f-left">
              <li class="service-tel">服务热线：<label id="m_basic_mobile">{{hotLine}}</label></li>
              <li class="qq">
                <a target="_blank" :href="qqUrl">
                  <i class="icon icon-qq"></i>
                </a>
              </li>
            </ul>
            <ul id="page_shared_layout_unlogin" class="top-links f-right" :class="pointBuy? 'top-links2': ''">
              <li class="show-logout" v-if="initShow"><router-link to="/reg" >注册</router-link></li>
              <li class="show-logout" v-if="initShow"><router-link to="/login" class="active" >登录</router-link></li>

              <li class="show-login" v-if="!initShow">您好！&nbsp;&nbsp;{{nickName}}</li>
              <li class="show-login top-user-wrapper" v-if="!initShow" @mouseover="toggleShowHide">
                <span class="top-username"><router-link id="page_shared_layout_login_name" to="/member"> </router-link><i class="icomoon icon-arrow-drop-down"></i></span>
                <div class="overlay-account" style="display: none">
                  <div class="group account-group">
                    <span class="f-left">账户余额：<b class="account-val" id="shared_header_mb">{{showBalance}}</b></span>
                    <router-link name="realnameAuth" class="f-right" to="/user/topUp">充值</router-link>
                  </div>
                  <div class="account-links group">
                    <router-link class="a-left" to="/user">个人中心</router-link>
                    <a href="javascript:;" class="a-right js-logout" @click="exit">安全退出</a>
                  </div>
                </div>
              </li>
              <li class="show-help">|</li>
              <li class="show-help"><router-link to="/help">帮助中心</router-link></li>

            </ul>
          </div>
        </div>
        <div class="banner group"   :class="pointBuy? 'banner2': ''">
          <div class="container">
            <router-link to="/"><h1 class="site-logo f-left"><img :src="loginImg" alt="" width="100%"></h1></router-link>

            <ul class="top-nav clearfix"  :class="pointBuy? 'top-nav2': ''">
              <li class=""><router-link to="/" exact >首页</router-link></li>

              <li class=""><router-link to="/buy/1">A股点买</router-link></li>

              <li class=""><router-link to="/buy/2">模拟体验</router-link></li>

              <li class=""><router-link to="/weixin">手机客户端</router-link></li>

              <li class=""><router-link id="headGrzxA" to="/user">个人中心</router-link></li>
              <li>
                <a>
                  <img src="../../../static/imgs/hot.png" id="show-ewm-tip">
                  <span class="hot">Hot</span>
                  <div class="showEwm">
                    <img :src="appImg">
                  </div>
                </a>

              </li>
            </ul>
          </div>
          <!--/.banner-->

        </div>

        <div class="side-bar-scroll">
          <div>
            <a target="_blank" :href="qqUrl">
              <i class="icomoon icon-qq"></i>
              <p>在线咨询</p>
            </a>
            <a class="item1">
              <i class="icomoon icon-wechat"></i>
              <p>公众号</p>
              <div class="sideImg">
                <img :src="weChatImg">
              </div>
            </a>
            <a class="item2">
              <i class="icomoon icon-app"></i>
              <p>APP下载</p>
              <div class="sideImg">
                <img :src="appImg">
              </div>
            </a>
            <router-link to="/Help">
              <i class="icomoon icon-question"></i>
              <p>常见问题</p>
            </router-link>
            <div class="hide" id="goTop">
              <a>
                <i class="icomoon icon-top"></i>
                <p>返回顶部</p>
              </a>
            </div>
            <div class="hide" id="goBefore">
              <a class="goBefore" href="javascript:history.back(-1)">
                <span>返回上页</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
</template>

<script>
    export default {
      name: "headerC",
      data(){
        return {
          loginImg: '', //logo
          // initShow: true,
          nickName: '',//用户的昵称
          showBalance: '',//用户的余额信息
          curWebInfos: '',
          hotLine: '',//服务热线
          weChatImg: '',
          appImg: '',
          qqUrl: '',
          pointBuy: false
        }
      },
      created() {
        this.configData.then(() => {
          this.curWebInfos = this.$store.state.NewMsg;//获取初始化配置数据
          this.hotLine = this.curWebInfos.service_hotline.value;
          this.weChatImg =  `${process.env.API_HOST}${this.curWebInfos.weixin_logo.value}`;
          this.appImg = `${process.env.API_HOST}${this.curWebInfos.app_qrcode.value}`;
          this.qqUrl = `http://wpa.qq.com/msgrd?v=3&uin=${this.curWebInfos.qq.value}&site=qq&menu=yes`;
          this.getLogo()

        })
      },
      mounted(){
        this.scrollTop();

        if(!this.initShow){
          this.getUserInfo();
          this.getShowBalance();
        }


      },
      methods: {
        getLogo() {
          this.loginImg = `${process.env.API_HOST}` + this.$store.state.NewMsg.web_logo.value;
        },
        toggleShowHide(){//鼠标放上去和移开

          $(".top-user-wrapper").mouseenter(function () {
            $(this).addClass("top-user-hovered");
            $(".overlay-account", $(this)).stop().fadeIn(200);
          }).mouseleave(function () {
            $(this).removeClass("top-user-hovered");
            $(".overlay-account", $(this)).stop().fadeOut(200);
          });
        },
        scrollTop(){
            var t;
            window.onscroll = function () {
              t = document.documentElement.scrollTop || document.body.scrollTop;
              if (t > 200) {
                $(".side-bar-scroll #goTop").show();
              } else {
                $(".side-bar-scroll #goTop").hide();
              }
            }

            $(".side-bar-scroll #goTop").click(function () {
              var sub = setInterval(function () {
                t -= 50;
                if (t > 0) {
                  window.scrollTo(0, t);
                } else {
                  window.scrollTo(0, 0);
                  clearInterval(sub);
                }
              }, 10);
            });

            //显示返回上页
            var href_now = window.location.href;
            if (href_now.indexOf("company/market") > 0 || href_now.indexOf("Policy/protocol") > 0 || href_now.indexOf("policy/restricted") > 0) {
              $(".side-bar-scroll #goBefore").show();
            }
        },
        exit(){
          this.$store.commit('logout');
          this.$store.commit('changeStatus', true);
          this.$router.push('/login');
        },
        getUserInfo(){//获取用户的昵称信息
          this.$axios.post('/api/user/userInfo',{token: window.localStorage.getItem('_auth')})
            .then(res => {
              if(res.data.code === 0){
                this.nickName = res.data.data.user_name;
              }else {
                this.$Notice.error({title: res.data.msg,});
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,});
            })
        },
        getShowBalance(){//获取用户的余额信息
          this.$axios.post('/api/user/showBalance',{token: window.localStorage.getItem('_auth')})
            .then(res => {
              if(res.data.code === 0){
                this.showBalance = res.data.data.balance;
              }else {
                this.$Notice.error({title: res.data.msg,});
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,});
            })
        },
      },
      computed:{
        initShow(){
          if(window.localStorage.getItem('_auth')){
            // this.username = window.localStorage.getItem('_auth');
            this.$store.commit('changeStatus', false);

          }else {
            this.$store.commit('changeStatus', true);
          }
          return this.$store.state.status;
        }
      },
      watch: {
        $route(){ //判断进入点买 更改公共头部样式
          if(this.$route.name === 'buy' || this.$route.name === 'sell' || this.$route.name === 'entrust' || this.$route.name === 'settleAccount') {
            this.pointBuy = true;
          }else {
            this.pointBuy = false;
          }
        }
      }
    }
</script>

<style scoped>
  a.router-link-active {
    color: #ff4519 !important;
    font-weight: bold;
  }
  li.router-link-active a {
    color: #ff4519;
  }
  .page-header {
    background-color: white;
  }
  .top-bar {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #808080;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .group:after, .container:after, .field-wrapper:after, .row:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  .f-left {
    float: left;
  }
  .top-bar li {
    display: inline-block;
  }
  .top-links {
    position: relative;
  }
  .f-right {
    float: right;
  }
  .top-links li {
    float: left;
    display: list-item;
  }
  .top-links .show-logout a {
    height: 20px;
    line-height: 20px;
    width: 54px;
    color: #ff4519;
    border: 1px solid #ff4519;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    border-radius: 5px;
    margin-top: 5px;
  }
  .top-links .show-logout + .show-logout {
    margin-left: 10px;
  }
  .top-links .show-logout a.active {
    color: white !important;
    background-color: #ff4519;
  }
  .top-links .top-user-wrapper {
    position: relative;
  }
  .top-links .show-help {
    margin-left: 20px;
  }
  .top-links .show-help a {
    font-size: 14px;
    color: #808080;
  }
  .banner {
    /*background-color: #ffffff;*/
    height: 80px;
    z-index: 90;
    position: relative;
  }
  h1.site-logo {
    display: block;
    overflow: hidden;
    margin-top: 8px;
    /*background-image: url(../../../static/imgs/logo.png);*/
    width: 160px;
    height: 55px;
  }
  .top-nav {
    line-height: 82px;
    font-size: 20px;
    color: #4c4c4c;
    position: absolute;
    right: 0;
  }
  .top-nav li {
    float: left;
    display: inline-block;
  }
  .top-nav li a {
    color: #4c4c4c;
  }
  .top-nav > li + li {
    margin-left: 50px;
  }
  .top-nav li:nth-last-child(1) {
    position: relative;
  }
  .top-nav li:nth-last-child(1) #show-ewm-tip {
    -webkit-animation: icon-bounce 3s infinite;
    -moz-animation: icon-bounce 3s infinite;
    -o-animation: icon-bounce 3s infinite;
    animation: icon-bounce 3s infinite;
    margin-right: 6px;
    margin-top: 32px;
    display: block;
  }
  /*动画*/
  @keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-webkit-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-moz-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-o-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }

  .top-nav li:nth-last-child(1) span {
    position: absolute;
    right: 0;
    top: 14px;
    line-height: 12px;
    width: 22px;
    display: block;
    color: white;
    background-color: #ff4519;
    font-size: 10px;
    text-align: center;
    border-radius: 2px;
  }
  .top-nav li a:hover {
    color: #ff4519;
  }
  .top-nav li:nth-last-child(1) .showEwm {
    display: none;
    position: absolute;
    z-index: 100;
    top: 59px;
    right: 0;
    background-color: white;
    box-shadow: 0 -1px 4px 1px #ffe8e2;
    height: 150px;
  }
  .top-nav li:nth-last-child(1) .showEwm img {
    height: 150px;
  }
  .side-bar-scroll {
    position: fixed;
    top: 28%;
    right: 20px;
    z-index: 999;
    width: 70px;
    border-radius: 5px;
    background-color: white;
  }
  .side-bar-scroll a {
    display: block;
    text-align: center;
    position: relative;
    height: 72px;
    color: #a6a6a6;
  }
  .side-bar-scroll a i {
    font-size: 40px;
    color: #a6a6a6;
    line-height: 70px;
  }
  .side-bar-scroll a p {
    display: none;
    font-size: 16px;
    color: white;
    width: 40px;
    margin: 0 auto;
    padding-top: 12px;
  }
  .top-bar .qq a i {
    display: block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    background-color: #808080;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    font-size: 16px;
    color: white;
  }
  .side-bar-scroll a:hover {
    background-color: #ff4b21;
    border-radius: 5px;
  }
  .side-bar-scroll a .sideImg {
    display: none;
    position: absolute;
    top: -30px;
    left: -140px;
    width: 120px;
    height: 120px;
    background-color: white;
    z-index: 100;
    box-shadow: 0 0 4px 1px #ffe8e2;
  }
  .side-bar-scroll .item1:hover .sideImg {
    display: block;
  }
  .side-bar-scroll a .sideImg img {
    width: 106px;
    height: 106px;
    margin: 6px;
  }
  .side-bar-scroll a p {
    display: none;
    font-size: 16px;
    color: white;
    width: 40px;
    margin: 0 auto;
    padding-top: 12px;
  }
  .side-bar-scroll a:hover p {
    display: block;
  }
  .side-bar-scroll a:hover i {
    display: none;
  }
  .side-bar-scroll .item2:hover .sideImg {
    display: block;
  }
  .side-bar-scroll a .sideImg:after {
    position: absolute;
    top: 60px;
    right: -5px;
    content: " ";
    width: 10px;
    height: 10px;
    background-color: white;
    transform: rotate(45deg);
  }
  .side-bar-scroll a span {
    display: block;
    font-size: 16px;
    color: #5cb1ff;
    width: 40px;
    margin: 0 auto;
    padding-top: 12px;
  }
  .side-bar-scroll a.goBefore:hover {
    background-color: #5cb1ff;
  }
  .side-bar-scroll a.goBefore:hover span {
    color: white;
  }
  .hide {
    display: none;
  }
  .top-nav li:nth-last-child(1) a:hover .showEwm {
    display: block;
  }
  .top-links .show-help a:hover {
    color: #ff4519;
  }
  .top-bar .qq a:hover i {
    background-color: #ff4519;
  }
  .show-login {
    /*display: block;*/
    color: #C8C8C8;
  }
  .overlay-account {
    position: absolute;
    z-index: 100;
    top: 30px;
    right: 0;
    width: 204px;
    height: 80px;
    box-shadow: 0 0 4px 1px #ffe8e2;
    border: 1px solid #ffe8e2;
    padding: 0 30px;
    background-color: #fff;
    box-sizing: content-box;
    /* display: none; */
  }
  .top-links .top-username a {
    color: #ff4519;
  }
  .top-links .top-username i {
    font-size: 12px;
    color: #ff4519;
    padding-left: 2px;
    transition: transform 0.5s ease 0s;
    display: inline-block;
  }
  .overlay-account .group {
    line-height: 40px;
  }
  .overlay-account .account-val {
    color: #4c4c4c;
  }
  .overlay-account .account-group a {
    color: #ff4519;
  }
  .overlay-account .group + .group {
    border-top: 1px solid #ffe8e2;
  }
  .overlay-account .account-links a {
    font-size: 14px;
    color: #808080;
    width: 49%;
    display: inline-block;
    float: left;
  }
  .overlay-account .account-links a + a {
    border-left: 1px solid #ffe8e2;
  }
  .top-links .top-user-hovered i {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
    margin-left: 3px;
  }

  .top-links .top-user-hovered .top-username {
    border-top: 1px solid #ffe8e2;
    border-left: 1px solid #ffe8e2;
    border-right: 1px solid #ffe8e2;
    box-shadow: 0 -1px 4px 1px #ffe8e2;
  }

  .top-links .top-user-hovered .top-username:after {
    display: block;
    position: absolute;
    z-index: 120;
    width: 99%;
    height: 10px;
    top: 24px;
    content: " ";
    left: 0;
    background-color: white;
  }
  .a-right {
    text-align: right;
  }
  .overlay-account .account-links a:hover {
    color: #ff4519;
  }

  /*进入点买后样式*/
  .page-header2, .banner2 {
    min-width: 1200px;
    background-color: black;
  }
  .top-bar2, .top-links2 li, .top-links2 li a {
    color: #fff !important;
  }
  .top-links2 .show-login .overlay-account {
    background-color: black;
    color: #fff;
  }
  .top-links2 .show-login .overlay-account span b,.top-links2 .show-login .overlay-account a {
    color: #fff;
  }
  .top-nav2 li a {
    color: #fff;
  }


</style>
