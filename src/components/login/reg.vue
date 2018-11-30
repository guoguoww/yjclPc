<template>
  <section class="section section-form page_auth" id="page_auth_reg">
    <div class="container">
      <div class="section-border fr">
        <h2>赢家策略注册</h2>
        <!--提交表单-->
        <div id="reg-form-step1" class="reg-form-step" v-if="mobileNext.box">
          <div class="form">
            <div class="field-wrapper">
              <i class="icomoon icon-phone2"></i>
              <input type="text" class="text" placeholder="请输入11位手机号" name="phone" id="phone" data-error-msg="请输入用户名" v-model="submitData.phone" @input="detectionMob">
            </div>
            <p class="name-err1" :class="!!errCallback.errMob? '': 'hide'"><i class="err-warning">!</i>请输入正确的手机号</p>
            <div class="field-wrapper">
              <i class="icomoon icon-psw-again"></i>
              <input type="text" name="verifyCode" id="verifyCode" class="text input-short1" placeholder="请输入短信验证码" v-model="submitData.phoneCode" @input="detectionSMSYZM">
              <button id="get-Psw" class="input-short2 get-Psw" :class="!!mobileNext.SMSYzmBtn? '':'disabled'" :disabled='!mobileNext.SMSYzmBtn' @click="openYZM()" >{{isNaN(codetext) ? codetext : codetext + '秒'}}</button>
            </div>
            <p class="psw-err1" :class="!!errCallback.errSMSYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确短信验证码</p>
          </div>
          <div style="text-align:center;margin-top:20px;">
            <p class="protocol_row-agree reg-checkbox">
              <input type="checkbox" id="agree_pro" checked="" name="agree_pro" v-model="mobileNext.readAgi">
              <label for="agree_pro"></label>
              我已阅读并同意<a id="reg_agree" @click="getAgreement()">《用户服务协议》</a>
            </p>
            <p>已有账号? 直接<router-link to="/login">登录</router-link></p>
          </div>
          <a class="confirm-btn next-btn1" id="reg-next-btn1" :class="!!mobileNext.nextBtn? '':'disabled'" :disabled='!mobileNext.nextBtn' @click="mobNext">下一步</a>
        </div>
        <div id="reg-form-step2" class="reg-form-step" v-if="userNext.box">
          <div class="form">
            <div class="field-wrapper">
              <i class="icomoon icon-user"></i>
              <input type="text" class="text" placeholder="请设置您的用户名" name="userName" id="userName" v-model="submitData.username" @input="detectionNick">
            </div>
            <p class="userName-err" :class="!!errCallback.errNick? '': 'hide'"><i class="err-warning">!</i>请输入您的用户名</p>
            <div class="field-wrapper">
              <i class="icomoon icon-password"></i>
              <input type="password" class="text" placeholder="密码为6-16位数字和字母组成" name="password" id="password" v-model="submitData.password" @input="detectionPwd">
            </div>
            <p class="password-err" :class="!!errCallback.errPwd? '': 'hide'"><i class="err-warning">!</i>密码必须为6-16位数字和字母组成</p>
            <div class="field-wrapper">
              <i class="icomoon icon-password"></i>
              <input type="password" class="text" placeholder="请再次输入密码" name="pswAgain" id="pswAgain" v-model="contrastPwd" @input="detectionPwdContrast">
            </div>
            <p class="pswAgain-err" :class="!!errCallback.errPwdContrast? '': 'hide'"><i class="err-warning">!</i>两次输入的密码不一致</p>
            <div class="field-wrapper">
              <i class="icomoon icomoon icon-real-info"></i>
              <input type="text" class="text" placeholder="请输入邀请码（必填)" name="invitat" id="invitat" v-model="submitData.qrcode">
            </div>
          </div>
          <a class="confirm-btn next-btn2" id="reg-next-btn2" :class="!!userNext.btn? '':'disabled'" :disabled='!userNext.btn' @click="submit">下一步</a>
        </div>
        <div id="reg-form-step3" class="reg-form-step finish" v-if="regSuccess">
          <i class="icomoon icon-finish"></i>
          <p class="finish-info">您已成功注册赢家策略</p>
          <router-link class="confirm-btn" to="/login">完成</router-link>
        </div>
      </div>
    </div>
    <!--朦版-->
    <div class="mask" id="mask"></div>
    <!--验证码填写-->
    <div class="popup" id="popup-getVefifyCode">
      <div>
        <span>验证码</span>
        <div class="inbox">
          <input placeholder="4位验证码" name="capcha" id="capcha" type="text" v-model="submitData.code" @input="detectionYZM">
          <img id="forgot_passImg" class="captcha-img" alt="" :src="mobileNext.yamPic? mobileNext.yamPic:''">
        </div>
        <i class="icomoon icon-refresh captcha-img" @click="getYzm"></i>
      </div>
      <p id="capcha_err1" :class="!!errCallback.errYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确的验证码</p>
      <a class="confirm-btn" id="verifyCode_btn" :class="!!mobileNext.yzmBtn? '':'disabled'" :disabled='!mobileNext.yzmBtn' @click="getCode">确定</a>
    </div>
    <!--错误提示-->
    <div id="popup-p-error" class="popup popup-small">
      <div>
        <i class="icomoon icon-warning"></i>
        <p id="popup-p-error-msg">{{errModal.errorCode}}</p>
      </div>
      <div class="btn-div clearfix" style="display:block;">
        <a class="js-close-popup width100" @click="closeErr()">确定</a>
      </div>
    </div>
    <!--用户注册协议-->
    <div class="popup" id="popupCon">
      <div class="bar-percentage">
        <i class="icomoon icon-error" id="close-popupCon" @click="closeContentDetails()"></i>
      </div>
      <!--<h3>{{agreement.title}}</h3>-->
      <div class="details" v-html="agreement.content"></div>

    </div>
  </section>
</template>

<script>
    export default {
      name: "reg",
      data() {
        return {
          agreement: { //协议
            title: '',
            content: '',
          },
          mobileNext: { //手机号填写
            box: true, //盒子显示
            mobFlag: false, //手机号验证
            yzmFlag: false, //验证码验证
            yzmBtn: false, //验证码确定
            yamPic: '', //验证码
            SMSYzmBtn: false, //短信验证码按钮
            SMSYzmFlag: false, //短信验证码验证
            readAgi: true, //是否阅读同意协议
            nextBtn: false, //下一步按钮
          },
          userNext: { //用户名填写
            box: false, //盒子显示
            btn: false, //下一步按钮
          },
          regSuccess: false, //注册成功
          // 验证码填写
          sucCallback: false, //成功回调
          errCallback: { //错误提示
            errMob: false, //手机号错误
            errSMSYzm: false, //错误短信验证码
            errYzm: false, //错误验证码
            errNick: false, //昵称错误
            errPwd: false, //密码错误
            errPwdContrast: false, //验证密码错误
          },
          errModal: { //错误模态框
            show: false,
            errorCode: '',
          },
          timer: null, //短信验证码定时器
          codetext: '短信验证码', //短信验证码文字信息
          submitData: {
            phone: '', //手机号
            code: '', //验证码
            phoneCode: '', //短信验证码
            username: '', //用户名
            password: '', //密码
            qrcode: this.$route.query.qrcode || "", //邀请码
          },
          contrastPwd: '', //验证两次密码
        }
      },
      methods: {

        getAgreement() {
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
          this.$axios.post('/api/contract/getInfo').then(res => {
            if(res.data.code === 0) {
              this.agreement.title = res.data.data[3].title
              this.openContentDetails(res.data.data[3].id)
            }
          })
        },
        openContentDetails(conDetails) { //获取协议详情
          // console.log(this.$aaa)
          this.$axios.post('/api/contract/getContent',{id: conDetails}).then(res => {
            if(res.data.code === 0) {
              this.agreement.content = res.data.data.content
            }
          })

        },
        closeContentDetails() {
          $('#mask').css({'display':'none','zIndex': '1000'});
          $('#popupCon').css({'display': 'none'});
        },

        detectionMob() {  //手机号验证
          if(this.submitData.phone.length > 10) {
            this.mobileNext.mobFlag = true;
          }
          if(this.mobileNext.mobFlag) {
            if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitData.phone)) {
              this.errCallback.errMob = true;
              this.mobileNext.SMSYzmBtn = false;
            }else {
              this.errCallback.errMob = false;
              this.mobileNext.SMSYzmBtn = true;
            }
          }
        },
        openYZM() { //获取验证码
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popup-getVefifyCode').css({'display': 'block'}).animate({top: "317px"},100);
          this.getYzm()
        },
        getYzm() {
          this.mobileNext.yamPic = `${process.env.API_HOST}/api/common/verify?v=${Math.random()}`;
        },
        detectionYZM() { //验证码验证
          if(this.submitData.code.length > 3) {
            this.mobileNext.yzmFlag = true;
          }
          if(this.mobileNext.yzmFlag) {
            if(this.submitData.code.length === 4) {
              this.mobileNext.yzmBtn = true;
              this.errCallback.errYzm = false;
            }else {
              this.mobileNext.yzmBtn = false;
              this.errCallback.errYzm = true;
            }
          }
        },
        getCode() { //获短信验证码 验证码窗口确认后
          $('#mask').css({'display':'none','zIndex': '1000'});
          $('#popup-getVefifyCode').css({'display': 'none'})
          this.$axios({
            url: "/api/common/sendCode",
            method: "post",
            params: {
              phone: this.submitData.phone,
              code: this.submitData.code,
            }
          }).then(res=>{
            if (res.data.code === 0) {
              this.mobileNext.SMSYzmBtn = false;
              this.codetext = 300;
              this.timer = setInterval(()=>{
                if(this.codetext > 0 && this.codetext <= 300 > 0 && this.codetext <= 300){
                  this.codetext--
                }else{
                  this.mobileNext.SMSYzmBtn = true;
                  this.mobileNext.nextBtn = false;
                  this.codetext = '重新获取'
                  this.submitData.phoneCode = '';
                  clearInterval(this.timer)
                  this.timer = null
                }
              },1000)
            }else {
              $('#mask').css({'display':'block','zIndex': '1002'});
              $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
              this.errModal.errorCode = res.data.msg;
            }
          })

        },
        detectionSMSYZM() { //短信验证码检测
          if(this.mobileNext.SMSYzmBtn === false) {
            if(this.submitData.phoneCode.length > 5) {
              this.mobileNext.SMSYzmFlag = true;
            }
            if(this.mobileNext.SMSYzmFlag) {
              if(this.submitData.phoneCode.length === 6) {
                this.mobileNext.nextBtn = true;
                this.errCallback.errSMSYzm = false;
              }else {
                this.mobileNext.nextBtn = false;
                this.errCallback.errSMSYzm = true;
              }
            }
          }
        },
        mobNext() { //手机号验证码输入后下一步
          if(!this.mobileNext.readAgi) {
            $('#mask').css({'display':'block','zIndex': '1002'});
            $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
            this.errModal.errorCode = '请先阅读并同意协议'
            return
          }
          this.mobileNext.box = false;
          this.userNext.box = true;
          this.regSuccess = false;
        },
        closeErr() { //关闭错误模态提示
          $('#mask').css({'display':'none','zIndex': '1000'});
          $('#popup-p-error').css({'display': 'none'});
          this.errModal.errorCode = ''
        },
        detectionNick() { //用户名检测
          if(!this.submitData.username) {
            this.errCallback.errNick = true;
          }else {
            this.errCallback.errNick = false;
          }
          this.detectionInf()
        },
        detectionPwd() { //密码检测
          if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.submitData.password)) {
            this.errCallback.errPwd = true;
          }else {
            this.errCallback.errPwd = false;
          }
          this.detectionInf()
        },
        detectionPwdContrast() { //确认密码
          if(this.contrastPwd !== this.submitData.password) {
            this.errCallback.errPwdContrast = true;
          }else {
            this.errCallback.errPwdContrast = false;
          }
          this.detectionInf()
        },
        detectionInf() { //注册按钮是否可点击验证
          if(!!this.submitData.username && !!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.submitData.password) && this.contrastPwd === this.submitData.password) {
            this.userNext.btn = true;
          }else {
            this.userNext.btn = false;
          }
        },
        submit() { //注册 提交数据
          if(!this.submitData.qrcode) {
            this.$Notice.error({
              title: '邀请码必填',
            });
            return
          }
          this.$axios({
            url: '/api/user/register',
            method: 'post',
            data: this.submitData,
          }).then(res => {
            if(res.data.code === 0) {
              this.mobileNext.box = false;
              this.userNext.box = false;
              this.regSuccess = true;
            }else {
              $('#mask').css({'display':'block','zIndex': '1002'});
              $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
              this.errModal.errorCode = res.data.msg;
              // 数据初始
              this.mobileNext.box = true;
              this.userNext.box = false;
              this.regSuccess = false;
              this.submitData.phone = '';
              this.submitData.code = '';
              this.submitData.phoneCode = '';
              this.submitData.username = '';
              this.submitData.password = '';
              this.contrastPwd = '';
              this.submitData.qrcode = this.$route.query.qrcode || "";
              clearInterval(this.timer)
              this.timer = null;
              this.codetext = '短信验证码';
            }
          })
        },
      }
    }
</script>

<style scoped>
  /*容器*/
  .page_auth {
    background: url('../../../static/imgs/login-bg.jpg') no-repeat center top;
    background-size: cover;
    min-height: 608px;
    width: 100%;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  /*登录盒子*/
  .page_auth .section-border {
    width: 400px;
    background-color: white;
    margin-top: 84px;
    border: 10px solid #fffbfa;
    border-radius: 10px;
  }
  /*标题*/
  .page_auth .section-border h2 {
    line-height: 72px;
    color: white;
    text-align: center;
    font-size: 24px;
    font-weight: normal;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /*background: -webkit-linear-gradient(left,rgba(255,140,0,0.8),rgba(255,69,25,0.8));*/
    /*background: -moz-linear-gradient(left, rgba(255,140,0,0.8),rgba(255,69,25,0.8));*/
    /*background: -o-linear-gradient(left,rgba(255,140,0,0.8),rgba(255,69,25,0.8));*/
    /*background: linear-gradient(left,rgba(255,140,0,0.8),rgba(255,69,25,0.8));*/
    background: rgba(255,69,25,0.8);
  }
  /*表单提交*/
  .page_auth .form {
    margin: 0 30px;
  }
  .page_auth .form p, #popup-forgetPsw .reg-form-step p {
    margin-top: 5px;
    color: #ff4519;
  }
  .page_auth .err-warning, #popup-forgetPsw .err-warning, #popup-getVefifyCode .err-warning {
    width: 16px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: #ff4519;
    color: white;
    margin-right: 2px;
  }
  .page_auth .field-wrapper {
    border-bottom: 1px solid #f2f2f2;
    margin-top: 24px;
    font-size: 16px;
    color: #808080;
    line-height: 55px;
    text-align: left;
  }
  .page_auth .field-wrapper i {
    padding-right: 10px;
    color: #c7c7c7;
  }
  #page_auth_reg .input-short1 {
    width: 180px !important;
  }
  .field-wrapper input {
    border: none;
    width: 250px;
    height: 30px;
    font-size: 16px;
    outline: none;
    border: 0;
  }
  input.text {
    background-color: #ffffff;
  }
  #page_auth_reg .input-short2 {
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: white;
    background-color: #ff4519;
    border-radius: 10px;
    margin-top: 5px;
    text-align: center;
    cursor: pointer;
  }
  .hide {
    display: none;
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
  #page_auth_reg .reg-checkbox label {
    top: 14px;
    left: 80px;
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
  /*成功回调*/
  #page_auth_reg .finish {
    text-align: center;
    margin-top: 48px;
    font-size: 16px;
  }
  #page_auth_reg .finish i {
    color: #00d47d;
    font-size: 70px;
    display: block;
  }
  .icon-finish:before {
    content: "\e914";
  }
  #page_auth_reg .finish .finish-info {
    line-height: 56px;
    color: #4c4c4c;
  }

  .page_auth .confirm-btn {
    display: block;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: white;
    line-height: 70px;
    text-align: center;
    margin-top: 14px;
    font-size: 20px;
    /*background: -moz-linear-gradient(left, rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: -webkit-linear-gradient(left,rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: -o-linear-gradient(left,rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: linear-gradient(left, rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    background: rgba(255,69,25,0.8);
    cursor: pointer;
  }
  a {
    color: #5cb1ff;
    cursor: pointer;
  }
  /*按钮*/
  .page_auth .confirm-btn {
    display: block;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: white;
    line-height: 70px;
    text-align: center;
    margin-top: 14px;
    font-size: 20px;
    /*background: -moz-linear-gradient(left, rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: -webkit-linear-gradient(left,rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: -o-linear-gradient(left,rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    /*background: linear-gradient(left, rgba(255,69,25,0.8),rgba(255,140,0,0.8));*/
    background: rgba(255,69,25,0.8);
    cursor: pointer;
  }
  .disabled {
    background: #c7c7c7 !important;
    color: #fff !important;
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
  .popup input.text:focus,
  .popup .input-short1:focus {
    box-shadow: 0 0 6px 0 #ff4519;
    outline: none;
    border: 1px solid #ff4519 !important;
  }
  /*验证码出现*/
  #popup-getVefifyCode {
    width: 320px;
    padding-top: 30px;
    margin-left: -160px;
    z-index: 1004;
  }
  #popup-getVefifyCode > div {
    margin-left: 30px;
    line-height: 38px;
    font-size: 16px;
    color: #808080;
  }
  #popup-getVefifyCode > p {
    margin-left: 30px;
    color: #ff4519;
  }
  #popup-forgetPsw .confirm-btn, #popup-getVefifyCode .confirm-btn {
    line-height: 50px;
    font-size: 18px;
    display: block;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: white;
    text-align: center;
    margin-top: 14px;
    background: #ff4519;
    cursor: pointer;
  }
  #popup-getVefifyCode .inbox {
    border: 1px solid #e6e6e6;
    display: inline-block;
    width: 174px;
    border-radius: 5px;
  }
  #popup-getVefifyCode input {
    width: 76px;
    height: 100%;
    padding-left: 10px;
    border: none;
  }
  #popup-getVefifyCode input:focus {
    outline: none;
  }
  #popup-getVefifyCode img {
    display: inline-block;
    width: 90px;
    height: 38px;
    border-left: 1px solid #e6e6e6;
    float: right;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
  }
  #popup-getVefifyCode .icon-refresh {
    font-size: 18px;
    color: #808080;
    padding-left: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  .icon-refresh:before {
    content: "\e902";
  }
  /*错误提示*/
  .popup-small {
    min-width: 300px;
    width: 300px;
    text-align: center;
    margin-left: -150px;
    z-index: 1400;
  }
  .popup-small i {
    display: block;
    color: #ff4519;
    font-size: 50px;
    padding-top: 30px;
  }
  .popup-small p {
    padding: 15px 0 10px;
    color: #4c4c4c;
    font-size: 16px;
    line-height: 1;
  }
  #popup-p-error .js-close-popup {
    background-color: #ff4519;
    color: #fff;
  }
  .popup .btn-div a.js-close-popup {
    background-color: #e6e6e6;
    color: #808080;
    border-bottom-left-radius: 10px;
  }
  .popup .btn-div a {
    display: block;
    width: 50%;
    font-size: 16px;
    float: left;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
  .width100 {
    width: 100% !important;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  /*服务协议*/
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
