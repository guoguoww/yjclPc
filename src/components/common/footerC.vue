<template>
  <footer class="page-footer">
    <div class="container">
      <ul class="clearfix">
        <li class="a-left">
          <p>全国客服热线（{{workTime}}）</p>
          <h4>TEL: {{hotLine}}</h4>
          <p>{{copyright}}</p>
        </li>
        <li class="a-center clearfix">
          <div class="item">
            <a target="_blank" :href="qqUrl">
              <i class="icomoon icon-qq"></i>
            </a>
          </div>
          <div class="item item1">
            <i class="icomoon icon-wechat"></i>
            <div class="showtip">
              <img :src="weChatImg">
            </div>
          </div>
          <div class="item item2">
            <i class="icomoon icon-app"></i>
            <div class="showtip">
              <img :src="appImg">
            </div>
          </div>
        </li>
        <li class="a-right">
          <div class="footer-menu">
            <router-link to="/">首页</router-link>
            |
            <router-link to="/company">关于我们</router-link>
            |
            <a id="contact-us" @click="contactus">联系我们</a>
          </div>
          <p>{{address}}</p>
          <div>
            <a id="_pingansec_bottomimagelarge_p2p" href="javascript:;">
              <img src="../../../static/imgs/trustutn.jpg">
            </a>
            <img src="../../../static/imgs/webscan.png">
          </div>
        </li>
      </ul>
    </div>
    <!--/.footer-->

    <div class="mask" v-show="initShow"></div>

    <div id="popup-p-contact" class="popup" style="top: 104px;" v-show="initShow" >
      <h4>{{contactUsInfo.title}}<i class="icomoon icon-error" id="close-p-contact" @click="closePop"></i></h4>
      <div class="text" v-html="contactUsInfo.content">
      </div>
    </div>

  </footer>
</template>

<script>
    export default {
      name: "footerC",
      data(){
        return {
          initShow: false,
          curWebInfos:'',
          hotLine: '',//服务热线
          workTime: '',//工作时间
          contactUsInfo: '',
          copyright: '',
          weChatImg: '',
          appImg: '',
          qqUrl: '',
          address: '', //地址
        }
      },
      created() {
          console.log(this.configData)


        this.configData.then(() => {
          this.curWebInfos = this.$store.state.NewMsg;//获取初始化配置数据
          this.hotLine = this.curWebInfos.service_hotline.value;
          this.workTime = this.curWebInfos.work_time.value;
          this.copyright = this.curWebInfos.copyright.name + ' ' + this.curWebInfos.copyright.value;
          this.weChatImg =  `${process.env.API_HOST}${this.curWebInfos.weixin_logo.value}`;
          this.appImg = `${process.env.API_HOST}${this.curWebInfos.app_qrcode.value}`;
          this.qqUrl = `http://wpa.qq.com/msgrd?v=3&uin=${this.curWebInfos.qq.value}&site=qq&menu=yes`;
          this.address = this.curWebInfos.address.value;
        })
      },
      mounted(){

        this.contactUsA();
      },
      methods: {
        contactus(){
          this.initShow = true;
        },
        closePop(){
          this.initShow = false;
        },
        contactUsA(){
            this.$axios.post('api/article/getInfoByType/type/5')
                .then(res => {
                    if(!res.data.code){
                        this.contactUsInfo = res.data.data[0];
                    }
                })
                .catch(err => {})
        },
      }
    }
</script>

<style scoped>
  .page-footer {
    padding-top: 34px;
    font-size: 14px;
    color: white;
    background-color: #808080;
    min-width: 1200px;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .page-footer ul {
    margin-bottom: 24px;
  }
  .page-footer li:nth-child(1) {
    width: 37%;
  }
  .page-footer li {
    float: left;
    width: 31%;
    height: 90px;
  }
  .a-left {
    text-align: left;
  }
  .a-right {
    text-align: right;
  }
  .page-footer p {
    line-height: 1;
  }
  .page-footer h4 {
    font-size: 24px;
    line-height: 45px;
    font-weight: normal;
  }
  .page-footer li + li {
    border-left: 1px solid #c7c7c7;
  }
  .page-footer li:nth-child(2) > div {
    margin-left: 56px;
    margin-top: 12px;
  }
  .page-footer li .item {
    float: left;
    width: 66px;
    height: 66px;
    position: relative;
  }
  .page-footer li i {
    display: block;
    width: 66px;
    height: 66px;
    line-height: 66px;
    font-size: 46px;
    background-color: white;
    border-radius: 50%;
    color: #808080;
    cursor: pointer;
  }
  .page-footer li .item + .item {
    margin-left: 30px;
  }
  .page-footer li .showtip {
    display: none;
    position: absolute;
    top: -30px;
    left: 80px;
    width: 120px;
    height: 120px;
    background-color: white;
    z-index: 100;
  }
  .page-footer li .showtip img {
    width: 106px;
    height: 106px;
    margin: 6px;
  }
  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .page-footer li + li {
    border-left: 1px solid #c7c7c7;
  }
  .page-footer li {
    float: left;
    width: 31%;
    height: 90px;
    text-align: center;
  }
  .group:after, .container:after, .field-wrapper:after, .row:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  .page-footer .footer-menu a {
    color: white;
    font-size: 14px;
    padding: 0 6px;
    line-height: 1;
    cursor: pointer;
  }
  .page-footer li:nth-child(3) p {
    line-height: 34px;
  }
  .page-footer li:nth-child(3) img {
    width: 96px;
  }
  .page-footer li .item:hover i {
    background-color: #ff4519;
    color: white;
  }
  .page-footer li .item1:hover > .showtip {
    display: block;
  }
  .page-footer li .item2:hover > .showtip {
    display: block;
  }
  #popup-p-contact {
    width: 860px;
    min-width: 864px;
    margin-left: -430px;
    height: 322px;
    color: #808080;
    font-size: 18px;
    text-align: center;
    position: fixed;
    z-index: 1001;
    left: 50%;
    background-color: #ffffff;
    transition-duration: .4s;
    border-radius: 10px;
  }
  #popup-p-contact h4 {
    line-height: 70px;
    height: 70px;
    font-size: 24px;
    color: white;
    font-weight: normal;
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: -moz-linear-gradient(left, rgba(255,140,0,0.8),rgba(255,69,25,0.8));
    background: -webkit-linear-gradient(left,rgba(255,140,0,0.8),rgba(255,69,25,0.8));
    background: -o-linear-gradient(left,rgba(255,140,0,0.8),rgba(255,69,25,0.8));
    background: linear-gradient(left, rgba(255,140,0,0.8),rgba(255,69,25,0.8));
  }
  #popup-p-contact .icon-error {
    position: absolute;
    top: 0;
    right: -40px;
    font-size: 30px;
    color: white;
  }
  #popup-p-contact .text {
    padding: 0 40px;
  }
  #popup-p-contact h5 {
    font-weight: normal;
    text-align: left;
    line-height: 90px;
  }
  #popup-p-contact p {
    line-height: 30px;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.4);
  }
  .page-footer .footer-menu a:hover {
    color: #5cb1ff;
  }
</style>
