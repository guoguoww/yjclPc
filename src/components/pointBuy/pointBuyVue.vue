<template>
    <section>
      <!--左侧按钮-->
      <div class="nav-left">
        <ul>
          <li>
            <router-link to="/buy/1">A股点买</router-link>
          </li>
          <li>
            <router-link to="/buy/2">注册领操作金</router-link>
          </li>
          <li>
            <a href="javascript: void (0)" @click="regORopen()">充5000送500</a>
          </li>
        </ul>
      </div>
      <!--抽奖-->
      <div class="luckydraw">
        <img src="../../../static/imgs/luckydraw.png" alt="">
      </div>

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

    </section>
</template>

<script>
  export default {
    name: "pointBuyVue",
    data() {
      return {
        contentDetails: {},
      }
    },
    methods: {
      regORopen() {
        if(window.localStorage.getItem('_auth')) {
          this.$axios.post('/api/article/getInfoByType/type/7').then(res => {
            if(res.data.code === 0) {
              this.contentDetails = res.data.data[0];
            }
          })
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
        }else {
          this.$router.push('/reg')
        }
      },
      closeContentDetails() { //关闭详情
        this.contentDetails = {};
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popupCon').css({'display': 'none'});
      }
    }
  }
</script>

<style scoped>
  section{margin: 0 !important;padding: 0 !important;}
  /*左侧菜单*/
  .nav-left {
    position: absolute;
    width: 220px;
    height: 330px;
    left: -190px;
    /*top: 10.5%;*/
    top: 95px;
    overflow: hidden;
    box-shadow: -2px 0px 5px rgba(143,38,14,0.1);
    background: url(../../../static/imgs/linkBG.png) no-repeat center top;
    background-size: 100% 100%;
    z-index: 1;
  }
  .nav-left ul {
    padding-left: 13px;
    width: 100%;
    /*height: 100%;*/
  }
  .nav-left ul li {
    width: 100%;
    text-align: center;
    height: 54px;
    padding: 6px 20px;
    line-height: 42px;
    margin-top: 50px;
  }
  .nav-left ul li:first-child {
    margin-top: 56px;
  }
  .nav-left ul li a {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 22px;
    background: #fff;
    color: #ff0000;
  }
  /*.nav-left ul li a.router-link-active {*/
  /*background: initial;*/
  /*color: #fff;*/
  /*}*/
  /*抽奖*/
  .luckydraw {
    position: absolute;
    right: -220px;
    /*top: 620px;*/
    top: 49%;
    overflow: hidden;
    cursor: pointer;
  }

  /*公告详情*/
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
