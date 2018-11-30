<template>
  <section class="section section-form page_auth" id="page_auth_login">
    <div class="container">
      <div class="section-border fr">
        <h2>赢家策略登录</h2>
        <!--提交表单-->
        <div class="form">
          <div class="field-wrapper">
            <i class="icomoon icon-phone2"></i>
            <input type="text" class="text" placeholder="请输入注册手机号/用户名" name="phone" v-model="submitData.username" @input="detectionMob()">
          </div>
          <!--错误提示-->
          <p class="name-err1" :class="errCallback.errMob? '' : 'hide'"><i class="err-warning">!</i>请输入注册手机号/用户名</p>
          <div class="field-wrapper">
            <i class="icomoon icon-password"></i>
            <input type="password" class="text" placeholder="请输入登录密码" name="pwd" v-model="submitData.password" @input="detectionPwd()">
          </div>
          <p class="psw-err1" :class="errCallback.errPwd? '' : 'hide'"><i class="err-warning">!</i>请输入登录密码</p>
          <div class="link-wrapper">
            <a id="forget-psw-btn" @click="forgotPwd">忘记密码</a>
          </div>
        </div>
        <!--立即注册-->
        <div class="quick-link-wrapper">
          <p>还没账号? 马上<router-link to="/reg">注册</router-link></p>
        </div>
        <!--登录按钮-->
        <a class="confirm-btn" id="login-btn" :class="!!loginState.loginBtn? '':'disabled'" :disabled='!loginState.loginBtn' @click="loginPrevious">登录</a>
      </div>
    </div>
    <!--朦版-->
    <div class="mask" id="mask"></div>
    <!--验证码填写-->
    <div class="popup" id="popup-getVefifyCode">
      <div>
        <span>验证码</span>
        <div class="inbox">
          <input placeholder="4位验证码" name="capcha" id="capcha" type="text" v-model="submitData.code"  @input="detectionYZM">
          <img id="forgot_passImg" class="captcha-img" alt="" :src="loginState.yamPic? loginState.yamPic : ''">
        </div>
        <i class="icomoon icon-refresh captcha-img" @click="getYzm"></i>
      </div>
      <p id="capcha_err1" :class="!!errCallback.errYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确的验证码</p>
      <a class="confirm-btn" id="verifyCode_btn" :class="!!loginState.yzmBtn? '':'disabled'" :disabled='!loginState.yzmBtn' @click="determine(determineType)">确定</a>
    </div>
    <!--修改密码-->
    <div class="popup" id="popup-forgetPsw">
      <div class="bar-percentage">
        <i class="icomoon icon-error" id="close-popup-forgetPsw" @click="closeForgot"></i>
      </div>
      <ul class="steps-bar clearfix">
        <li class="active">
          <span>1</span>
          <p>验证手机号</p>
        </li>
        <li>
          <span>2</span>
          <p>设置新密码</p>
        </li>
        <li>
          <span>3</span>
          <p>设置成功</p>
        </li>
      </ul>
      <div id="forget-form-step1" class="forget-form-step" v-if="forgotState.firstStep">
        <div>
          <input type="text" class="text" placeholder="请输入11位手机号" name="phone" id="phone" v-model="forgetData.phone" @input="forgotDetectionMob">
        </div>
        <p class="name-err1" :class="!!forgetErrCallback.errMob? '': 'hide'"><i class="err-warning">!</i>请输入正确的手机号</p>
        <div class="clearfix">
          <input type="text" class="input-short1" placeholder="请输入验证码" name="verifyCode" id="verifyCode" v-model="forgetData.phoneCode" @input="detectionSMSYZM">
          <button class="input-short2" id="get-Psw" :class="!!forgotState.SMSYzmBtn? '':'disabled'" :disabled='!forgotState.SMSYzmBtn' @click="openYZM()" >{{isNaN(codetext) ? codetext : codetext + '秒'}}</button>
        </div>
        <p class="psw-err1" :class="!!forgetErrCallback.errSMSYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确的验证码</p>
        <a class="confirm-btn next-btn1"  id="forget-next-btn1" :class="!!forgotState.nextBtn? '':'disabled'" :disabled='!forgotState.nextBtn' @click="openSecondStep">下一步</a>
      </div>
      <div id="forget-form-step2" class="forget-form-step" v-if="forgotState.secondStep">
        <div>
          <input type="password" class="text" placeholder="密码为6-16位数字和字母组成" name="password" id="password" v-model="forgetData.password" @input="forgotDetectionPwd">
        </div>
        <p class="password-err" :class="forgetErrCallback.errPwd? '': 'hide'"><i class="err-warning">!</i>密码必须为6-16位数字和字母组成</p>
        <div>
          <input type="password" class="text" placeholder="请再次输入密码" name="pswAgain" id="pswAgain" v-model="contrastPwd" @input="forgitDetectionPwdContrast">
        </div>
        <p class="pswAgain-err" :class="forgetErrCallback.errPwdContrast? '': 'hide'"><i class="err-warning">!</i>两次输入的密码不正确</p>
        <div class="btn-div clearfix" style="display:block;margin-top:30px;">
          <a class="preStep" id="forget-pre-step1" @click="backFirstStep">上一步</a>
          <a class="nextStep next-btn2" id="forget-next-btn2" @click="submitForgotData">下一步</a>
        </div>
      </div>
      <div id="forget-form-step3" class="forget-form-step finish" v-if="forgotState.lastStep">
        <i class="icomoon icon-finish"></i>
        <p>您已成功修改登录密码</p>
        <div class="btn-div" id="" style="display:block;margin-top:30px;">
          <a class="js-close-popup widthRed100" id="forget-finish-btn" @click="closeForgot">完成</a>
        </div>
      </div>
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
  </section>
</template>

<script>
    export default {
      name: "login",
      data() {
        return {
          maskShow: false, //朦版是否会消失
          loginState: {
            loginBtn: false, //登录按钮
            yamPic: '', //验证码路径
            yzmFlag: false, //验证码验证
            yzmBtn: false, //验证码确定按钮
          },
          submitData: { //提交数据
            username: '', //用户名或手机号
            password: '', //密码
            code: '', //验证码
          },
          errModal: { //错误模态框
            errorCode: '',
          },
          errCallback: { //错误提示
            errMob: false, //手机号/昵称错误
            errPwd: false, //密码错误
            errYzm: false, //错误验证码
          },
          forgetData: {
            phone: '', //手机号
            password: '', //密码
            code: '', //验证码
            phoneCode: '', //短信验证码
          },
          contrastPwd: '', //验证两次密码
          forgotState: { //修改密码状态
            firstStep: true, //第一步
            secondStep: false, //第二步
            lastStep: false, //最后一步
            mobFlag: false, //手机号验证
            SMSYzmBtn: false, //短信验证码获取按钮
            nextBtn: false, //下一步按钮
            secondStepBtn: false, //第二步‘下一步’按钮
          },
          forgetErrCallback: { //修改密码错误提示
            errMob: false, //手机号错误
            errPwd: false, //密码错误
            errPwdContrast: false, //两次密码不同
            errYzm: false, //错误验证码
          },
          timer: null, //短信验证码定时器
          codetext: '短信验证码', //短信验证码文字信息
          determineType: 'login', //按钮状态
        }
      },
      methods: {
        detectionMob() { //检测手机号或者用户名是否输入
          if(!this.submitData.username) {
            this.errCallback.errMob = true;
          }else {
            this.errCallback.errMob = false;
          }
          this.detectionInf()
        },
        detectionPwd() { //检测密码是否输入
          if(!this.submitData.password) {
            this.errCallback.errPwd = true;
          }else {
            this.errCallback.errPwd = false;
          }
          this.detectionInf()
        },
        detectionInf() { //注册按钮是否可点击验证
          if(!!this.submitData.username && !!this.submitData.password) {
            this.loginState.loginBtn = true;
          }else {
            this.loginState.loginBtn = false;
          }
        },
        loginPrevious() { //登录上一步
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popup-getVefifyCode').css({'display': 'block'}).animate({top: "317px"},100);
          this.determineType = 'login'
          this.getYzm()
        },
        getYzm() {
          this.loginState.yamPic = `${process.env.API_HOST}/api/common/verify?v=${Math.random()}`;
        },
        detectionYZM() { //验证码验证
          if(this.submitData.code.length > 3) {
            this.loginState.yzmFlag = true;
          }
          if(this.loginState.yzmFlag) {
            if(this.submitData.code.length === 4) {
              this.loginState.yzmBtn = true;
              this.errCallback.errYzm = false;
            }else {
              this.loginState.yzmBtn = false;
              this.errCallback.errYzm = true;
            }
          }
        },
        closeErr() { //关闭错误模态提示
          if(!this.maskShow) {
            $('#mask').css({'display':'none','zIndex': '1000'});
          }else  {
            $('#mask').css({'display':'block','zIndex': '1002'});
          }
          $('#popup-p-error').css({'display': 'none'});
          $('#popup-getVefifyCode').css({'display': 'none'});
          this.submitData.code = '';
          this.errModal.errorCode = ''
        },
        determine(type) {
          if(type === 'login') { //登录
            this.$axios({
              url: '/api/user/login',
              method: 'post',
              data: this.submitData,
            }).then(res => {
              if(res.data.code === 0) {
                var nowDate = new Date();
                var now = nowDate.getFullYear() + '-' + (nowDate.getMonth()+1) + '-' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();


                localStorage.setItem('_auth', res.data.data.token);
                localStorage.setItem('loginDate', now);
                this.$Message.success('登录成功')
                this.$router.push('/user');

                this.$store.commit('changeStatus',false);
                this.$store.commit('logined',res.data.data.token);
              }else {
                $('#mask').css({'display':'block','zIndex': '1002'});
                $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
                this.errModal.errorCode = res.data.msg;
              }
            })
          }
          if(type === 'forfet') { //修改密码 获取手机验证码
            this.forgetData.code = this.submitData.code;
            this.submitData.code = '';
            this.$axios({
              url: "/api/common/sendCode",
              method: "post",
              params: {
                phone: this.forgetData.phone,
                code: this.forgetData.code,
              }
            }).then(res=>{
              if (res.data.code === 0) {
                $('#popup-getVefifyCode').css({'display': 'none'});
                this.forgotState.SMSYzmBtn = false;
                this.codetext = 300;
                this.timer = setInterval(()=>{
                  if(this.codetext > 0 && this.codetext <= 300 > 0 && this.codetext <= 300){
                    this.codetext--
                  }else{
                    this.forgotState.SMSYzmBtn = true;
                    this.forgotState.nextBtn = false;
                    this.codetext = '重新获取';
                    this.forgetData.phoneCode = '';
                    clearInterval(this.timer);
                    this.timer = null;
                  }
                },1000)
              }else {
                $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
                this.errModal.errorCode = res.data.msg;
              }
            })
          }
        },
        forgotPwd() { //忘记密码
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popup-forgetPsw').css({'display': 'block'}).animate({top: "317px"},100);
          this.maskShow = true
        },
        forgotDetectionMob() {  //修改密码手机号验证
          if(this.forgetData.phone.length > 10) {
            this.forgotState.mobFlag = true;
          }
          if(this.forgotState.mobFlag) {
            if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.forgetData.phone)) {
              this.forgetErrCallback.errMob = true;
              this.forgotState.SMSYzmBtn = false;
            }else {
              this.forgetErrCallback.errMob = false;
              this.forgotState.SMSYzmBtn = true;
            }
          }
        },
        openYZM() { //获取验证码
          $('#mask').css({'display':'block','zIndex': '1002'});
          $('#popup-getVefifyCode').css({'display': 'block'}).animate({top: "317px"},100);
          this.determineType = 'forfet'
          this.getYzm()
        },
        detectionSMSYZM() { //短信验证码检测
          if(this.forgotState.SMSYzmBtn === false) {
            if(this.forgetData.phoneCode.length > 5) {
              this.forgotState.SMSYzmFlag = true;
            }
            if(this.forgotState.SMSYzmFlag) {
              if(this.forgetData.phoneCode.length === 6) {
                this.forgotState.nextBtn = true;
                this.forgetErrCallback.errSMSYzm = false;
              }else {
                this.forgotState.nextBtn = false;
                this.forgetErrCallback.errSMSYzm = true;
              }
            }
          }
        },
        openSecondStep() { //修改密码第二不
          this.forgotState.firstStep = false;
          this.forgotState.secondStep = true;
          this.forgotState.lastStep = false;
          $('#popup-forgetPsw .steps-bar li').eq(1).addClass("active");
        },
        backFirstStep() { //返回上一步
          this.forgotState.firstStep = true;
          this.forgotState.secondStep = false;
          this.forgotState.lastStep = false;
          $('#popup-forgetPsw .steps-bar li').eq(1).removeClass("active")
        },
        forgotDetectionPwd() { //修改密码 验证密码
          if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.forgetData.password)) {
            this.forgetErrCallback.errPwd = true;
          }else {
            this.forgetErrCallback.errPwd = false;
          }
          this.forgitDetectionInf()
        },
        forgitDetectionPwdContrast() { //确认密码
          if(this.contrastPwd !== this.forgetData.password) {
            this.forgetErrCallback.errPwdContrast = true;
          }else {
            this.forgetErrCallback.errPwdContrast = false;
          }
          this.forgitDetectionInf()
        },
        forgitDetectionInf() { //密码和确认密码都通过 下一步按钮可以点击
          if(!!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.forgetData.password) && this.contrastPwd === this.forgetData.password) {
            this.forgotState.secondStepBtn = true;
          }else {
            this.forgotState.secondStepBtn = false;
          }
        },
        submitForgotData() { //提交修改密码信息
          this.$axios({
            url: '/api/user/rePwd',
            method: 'post',
            data: this.forgetData
          }).then(res => {
            if(res.data.code === 0) {
              this.forgotState.firstStep = false;
              this.forgotState.secondStep = false;
              this.forgotState.lastStep = true;
              $('#popup-forgetPsw .steps-bar li').eq(2).addClass("active");
            }else {
              $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
              this.errModal.errorCode = res.data.msg;
            }
          })
        },
        closeForgot() { //关闭/完成修改密码模态
          $('#popup-forgetPsw .steps-bar li').eq(1).removeClass("active")
          $('#popup-forgetPsw .steps-bar li').eq(2).removeClass("active")
          this.forgotState.firstStep = true;
          this.forgotState.secondStep = false;
          this.forgotState.lastStep = false;
          this.forgetData.phone = '';
          this.forgetData.password = '';
          this.forgetData.phoneCode = '';
          this.forgetData.code = '';
          this.maskShow = false
          $('#mask').css({'display':'none','zIndex': '1000'});
          $('#popup-forgetPsw').css({'display': 'none'});
        },
      },
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
  /*提交表单*/
  .page_auth .form {
    margin: 0 30px;
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
  .field-wrapper input {
    border: none;
    width: 250px;
    outline: none;
    font-size: 16px;
  }
  .page_auth .form p, #popup-forgetPsw form p {
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
  /*错误提示*/
  .hide {
    display: none;
  }
  /*忘记密码*/
  .page_auth .link-wrapper {
    text-align: right;
    line-height: 34px;
  }
  a {
     color: #5cb1ff;
     cursor: pointer;
   }
  /*立即注册*/
  .page_auth .quick-link-wrapper {
    padding-top: 24px;
    text-align: center;
  }
  /*登录按钮*/
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
  /*忘记密码*/
  #popup-forgetPsw {
    width: 500px;
    margin-left: -250px;
    z-index: 1003;
  }
  #popup-forgetPsw .bar-percentage {
    width: 440px;
    height: 6px;
    background-color: #b3efd6;
    border-radius: 3px;
    margin: 40px auto 0;
    position: relative;
  }
  #popup-forgetPsw .bar-percentage .icon-error {
    position: absolute;
    top: -30px;
    right: -70px;
    font-size: 30px;
    color: white;
    cursor: pointer;
  }
  #popup-forgetPsw .steps-bar {
    width: 440px;
    margin: 0 auto;
  }
  #popup-forgetPsw .steps-bar li {
    float: left;
    width: 33.33%;
    text-align: center;
    color: #c7c7c7;
    font-size: 14px;
    position: relative;
  }
  #popup-forgetPsw .steps-bar li.active {
    color: #808080;
  }
  #popup-forgetPsw .steps-bar li span {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    position: absolute;
    z-index: 1200;
    color: white;
    background-color: #b3efd6;
    top: -13px;
    left: 72px;
  }
  #popup-forgetPsw .steps-bar li.active span {
    background-color: #00d47d;
    box-shadow: 0 0 6px 0px #00d47d;
  }
  #popup-forgetPsw .steps-bar li p {
    margin-top: 20px;
  }
  #popup-forgetPsw .steps-bar li:nth-child(1).active:after {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  #popup-forgetPsw .steps-bar li.active:after {
    width: 100%;
    height: 6px;
    background-color: #00d47d;
    box-shadow: 0 0 6px 0px #00d47d;
    display: block;
    content: " ";
    position: absolute;
    z-index: 1001;
    top: -7px;
    left: 0;
  }
  #popup-forgetPsw .forget-form-step {
    margin-top: 10px;
  }
  #popup-forgetPsw .forget-form-step .text {
    width: calc(100% - 152px);
    margin-left: 70px;
  }

  #popup-forgetPsw .forget-form-step input,#popup-forgetPsw .forget-form-step button {
    display: block;
    border: 1px solid #e6e6e6;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    color: #808080;
    margin-top: 30px;
  }
  input.text {
    background-color: #ffffff;
  }
  #popup-forgetPsw .forget-form-step p {
    margin-left: 70px;
  }
  .page_auth .form p, #popup-forgetPsw .forget-form-step p {
    margin-top: 5px;
    color: #ff4519;
  }
  .hide {
    display: none;
  }
  #popup-forgetPsw .forget-form-step .input-short1 {
    width: 210px;
    float: left;
    margin-left: 70px;
  }
  #popup-forgetPsw .forget-form-step .input-short2 {
    float: right;
    width: 110px;
    text-align: center;
    background-color: #ff6a47;
    color: white;
    padding: 0;
    margin-right: 70px;
    margin-bottom: 30px;
    cursor: pointer;
  }
  #popup-forgetPsw .forget-form-step input {
    display: block;
    border: 1px solid #e6e6e6;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-radius: 5px;
    color: #808080;
    margin-top: 30px;
  }
  .disabled {
    background: #c7c7c7 !important;
    color: #fff !important;
  }
  .popup .btn-div a.nextStep {
    background-color: #ff4519;
    color: white;
    border-bottom-right-radius: 10px;
  }
  .popup .btn-div a.preStep {
    background-color: #e6e6e6;
    color: #808080;
    border-bottom-left-radius: 10px;
  }
  #popup-forgetPsw .finish i {
    display: block;
    font-size: 70px;
    text-align: center;
    color: #00d47d;
  }
  #popup-forgetPsw .finish p {
    font-size: 16px;
    color: #4c4c4c;
    text-align: center;
    line-height: 48px;
    margin-left: 0;
  }
  .widthRed100 {
    width: 100% !important;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #ff4519 !important;
    color: white !important;
  }
</style>
