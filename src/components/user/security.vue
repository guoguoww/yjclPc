<template>
  <div>
    <section id="page_member_security" class="col-main">
      <h3 class="page_member-title">账户安全</h3>
      <div class="level-div">
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
      </div>
      <div class="info-div">
        <h4>个人信息</h4>
        <p><label>用户名</label><span id="userName">{{userData.user_name}}</span></p>
        <p><label>绑定手机</label><span id="手机号">{{userData.user_phone}}</span><button class="change-psw" @click="openModify('popup-modifyPhone')">修改</button></p>
      </div>
      <div class="info-div">
        <h4>账户安全</h4>
        <p><label>实名认证</label><span id="real_name">{{(realNameStatus === 0 || realNameStatus === 3)? '未认证': (realNameStatus === 1? '审核中':  userData.name)}}</span> <button v-if="(realNameStatus === 0 || realNameStatus === 3)" class="verify" @click="openModify('popup-realname-auth')">马上实名</button></p>
        <p><label>登录密码</label><span>登录网址时需要输入的密码</span><button class="change-psw" @click="openModify('popup-changePwd')">修改</button></p>
      </div>
    </section>
    <!--朦版-->
    <div class="mask" id="mask"></div>
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
    <!--验证码填写-->
    <div class="popup" id="popup-getVefifyCode">
      <div>
        <span>验证码</span>
        <div class="inbox">
          <input placeholder="4位验证码" name="capcha" id="capcha" type="text" v-model="modifyPhoneData.code"  @input="detectionYZM">
          <img id="forgot_passImg" class="captcha-img" alt="" :src="yamPic? yamPic : ''">
        </div>
        <i class="icomoon icon-refresh captcha-img" @click="getYzm"></i>
      </div>
      <p id="capcha_err1" :class="!!errCallback.errYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确的验证码</p>
      <a class="confirm-btn" id="verifyCode_btn" :class="!!modifyPhoneState.yzmBtn? '':'disabled'" :disabled='!modifyPhoneState.yzmBtn' @click="determine()">确定</a>
    </div>
    <!--绑定手机-->
    <div class="popup" id="popup-modifyPhone">
      <div class="bar-percentage">
        <i class="icomoon icon-error" id="close-popup-modifyPhone" @click="closeModify"></i>
      </div>
      <ul class="steps-bar clearfix">
        <li class="active">
          <span>1</span>
          <p>验证手机号</p>
        </li>
        <li>
          <span>2</span>
          <p>绑定新手机号</p>
        </li>
        <li>
          <span>3</span>
          <p>绑定成功</p>
        </li>
      </ul>
      <div id="forget-form-step1" class="forget-form-step" v-if="modifyPhoneState.firstStep">
        <div>
          <input type="text" class="text readonly" name="phone" id="phone" v-model="userData.user_phone" readonly >
        </div>
        <div class="clearfix">
          <input type="text" class="input-short1" placeholder="请输入验证码" name="verifyCode" id="verifyCode" v-model="modifyPhoneData.phoneCode" @input="detectionSMSYZM">
          <button class="input-short2" id="get-Psw" :class="!!modifyPhoneState.SMSYzmBtn? '':'disabled'" :disabled='!modifyPhoneState.SMSYzmBtn' @click="openYZM()" >{{isNaN(codetext) ? codetext : codetext + '秒'}}</button>
        </div>
        <p class="psw-err1" :class="!!errCallback.errSMSYzm? '': 'hide'"><i class="err-warning">!</i>请输入正确的验证码</p>
        <a class="confirm-btn next-btn1"  id="forget-next-btn1" :class="!!modifyPhoneState.nextBtn? '':'disabled'" :disabled='!modifyPhoneState.nextBtn' @click="openSecondStep">下一步</a>
      </div>
      <div id="forget-form-step2" class="forget-form-step" v-if="modifyPhoneState.secondStep">
        <div>
          <input type="text" class="text" placeholder="请输入11位手机号" name="newPhone" id="newPhone" v-model="modifyPhoneData.newphone" @input="detectionMob">
        </div>
        <p class="name-err1" :class="!!errCallback.errMob? '': 'hide'"><i class="err-warning">!</i>请输入正确的手机号</p>
        <div class="btn-div clearfix" style="display:block;margin-top:30px;">
          <a class="preStep" id="forget-pre-step1" @click="backFirstStep">上一步</a>
          <a class="nextStep next-btn2" id="forget-next-btn2" @click="submitModifyPhoneData">下一步</a>
        </div>
      </div>
      <div id="forget-form-step3" class="forget-form-step finish" v-if="modifyPhoneState.lastStep">
        <i class="icomoon icon-finish"></i>
        <p>您已成功绑定新手机号</p>
        <div class="btn-div" style="display:block;margin-top:30px;">
          <a class="js-close-popup widthRed100" id="forget-finish-btn" @click="closeModify">完成</a>
        </div>
      </div>
    </div>
    <!--实名认证-->
    <div class="popup popup-big" id="popup-realname-auth">
      <div class="tip">
        <p>温馨提示：为保障您的账户安全，请先进行实名认证，只能认证一次，确认后不再修改，如有疑问请联系  <span>4008-762-722</span>。</p>
      </div>
      <div class="form">
        <div class="inbox">
          <label>真实姓名</label>
          <input type="text" class="text" placeholder="请输入您的真实姓名" id="realname" v-model="realNameData.realname">
        </div>
        <div class="inbox">
          <label>身份证号</label>
          <input type="text" class="text" placeholder="请输入正确的身份证号" id="cardID" v-model="realNameData.idNum">
        </div>
      </div>
      <div class="btn-div clearfix" id="" style="display:block;margin-top:30px;">
        <a class="preStep" @click="colseRealName">取消认证</a>
        <a class="nextStep next-btn2" @click="submitRealNameData">确定认证</a>
      </div>
    </div>
    <!--修改密码-->
    <div class="popup popup-big" id="popup-changePwd">
      <div class="form">
        <div class="inbox">
          <label>原密码</label>
          <input type="password" class="text" placeholder="请输入原密码" v-model="changePwdData.oldpass">
        </div>
        <div class="inbox">
          <label>新密码</label>
          <input type="password" class="text" placeholder="请输入新密码" v-model="changePwdData.newpass">
        </div>
      </div>
      <div class="btn-div clearfix" style="display:block;margin-top:30px;">
        <a class="preStep" @click="closeChangePwd">取消</a>
        <a class="nextStep next-btn2" @click="submitChangePwdData">提交</a>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "security",
    data() {
      return {
        userData: {},
        realNameStatus: 0, //实名认证状态
        yamPic: '', //获取图片验证码路径
        modifyPhoneData: { //绑定手机号传值初始
          token: localStorage.getItem('_auth') || '',
          phone: '', //旧手机号
          phoneCode: '', //短信验证码
          newphone	: '', //新手机号
          code: '', //图片验证码
        },
        modifyPhoneState: { //绑定手机号模态状态
          firstStep: true, //第一步
          secondStep: false, //第二步
          lastStep: false, //最后一步
          mobFlag: false, //手机号验证
          SMSYzmBtn: true, //短信验证码获取按钮
          nextBtn: false, //下一步按钮
          secondStepBtn: false, //第二步‘下一步’按钮
        },
        errModal: { //错误模态框
          errorCode: '',
        },
        timer: null, //短信验证码定时器
        codetext: '短信验证码', //短信验证码文字信息
        errCallback: { //绑定手机号错误提示
          errMob: false, //手机号错误
          errYzm: false, //错误图片验证码
          errSMSYzm: false, //错误短信验证码
        },
        realNameData: { //实名认证上传信息
          token: localStorage.getItem('_auth') || '', //登录账号
          realname: '', //姓名
          idNum: '', //身份证号
        },
        changePwdData: {
          token: localStorage.getItem('_auth') || '', //登录账号
          oldpass: '', //旧密码
          newpass: '', //新密码
        }
      }
    },
    mounted() {
      this.getUserData();
      this.getRealNameStatus();
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
      closeErr() { //关闭错误模态提示
        $('#popup-p-error').css({'display': 'none'});
        $('#popup-getVefifyCode').css({'display': 'none'});
        this.errModal.errorCode = ''
      },
      openModify(type) { //打开模态框
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#' + type).css({'display': 'block'}).animate({top: "317px"},100);
      },
      //绑定手机
      openYZM() { //打开验证码模态框
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#popup-getVefifyCode').css({'display': 'block'}).animate({top: "317px"},100);
        this.getYzm()
      },
      getYzm() { ////获取验证码
        this.yamPic = `${process.env.API_HOST}/api/common/verify?v=${Math.random()}`;
      },
      detectionYZM() { //验证码验证
        if(this.modifyPhoneData.code.length > 3) {
          this.modifyPhoneState.yzmFlag = true;
        }
        if(this.modifyPhoneState.yzmFlag) {
          if(this.modifyPhoneData.code.length === 4) {
            this.modifyPhoneState.yzmBtn = true;
            this.errCallback.errYzm = false;
          }else {
            this.modifyPhoneState.yzmBtn = false;
            this.errCallback.errYzm = true;
          }
        }
      },
      determine() { //输入验证码成功 获取手机验证码
        this.$axios({
          url: "/api/common/sendCode",
          method: "post",
          params: {
            phone: this.userData.user_phone,
            code: this.modifyPhoneData.code,
          }
        }).then(res=>{
          if (res.data.code === 0) {
            $('#popup-getVefifyCode').css({'display': 'none'});
            this.$Notice.success({
              title: '短信验证码获取成功',
            });
            this.modifyPhoneState.SMSYzmBtn = false;
            this.codetext = 300;
            this.timer = setInterval(()=>{
              if(this.codetext > 0 && this.codetext <= 300 > 0 && this.codetext <= 300){
                this.codetext--
              }else{
                this.modifyPhoneState.SMSYzmBtn = true;
                this.modifyPhoneState.nextBtn = false;
                this.codetext = '重新获取';
                clearInterval(this.timer);
                this.timer = null;
              }
            },1000)
          }else {
            $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
            this.errModal.errorCode = res.data.msg;
            this.modifyPhoneData.code = '';
          }
        })
      },
      detectionSMSYZM() { //短信验证码检测
        if(this.modifyPhoneState.SMSYzmBtn === false) {
          if(this.modifyPhoneData.phoneCode.length > 5) {
            this.modifyPhoneState.SMSYzmFlag = true;
          }
          if(this.modifyPhoneState.SMSYzmFlag) {
            if(this.modifyPhoneData.phoneCode.length === 6) {
              this.modifyPhoneState.nextBtn = true;
              this.errCallback.errSMSYzm = false;
            }else {
              this.modifyPhoneState.nextBtn = false;
              this.errCallback.errSMSYzm = true;
            }
          }
        }
      },
      openSecondStep() { //修改密码第二步
        this.modifyPhoneState.firstStep = false;
        this.modifyPhoneState.secondStep = true;
        this.modifyPhoneState.lastStep = false;
        $('#popup-modifyPhone .steps-bar li').eq(1).addClass("active");
      },
      detectionMob() {  //新手机号验证
        if(this.modifyPhoneData.newphone.length > 10) {
          this.modifyPhoneState.mobFlag = true;
        }
        if(this.modifyPhoneState.mobFlag) {
          if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.modifyPhoneData.newphone)) {
            this.errCallback.errMob = true;
            this.modifyPhoneState.secondStepBtn = false;
          }else {
            this.errCallback.errMob = false;
            this.modifyPhoneState.secondStepBtn = true;
          }
        }
      },
      backFirstStep() { //返回上一步
        this.modifyPhoneState.firstStep = true;
        this.modifyPhoneState.secondStep = false;
        this.modifyPhoneState.lastStep = false;
        $('#popup-modifyPhone .steps-bar li').eq(1).removeClass("active")
      },
      submitModifyPhoneData() { //提交绑定手机信息
        this.modifyPhoneData.phone = this.userData.user_phone;
        this.$axios({
          url: '/api/user/resetPhone',
          method: 'post',
          data: this.modifyPhoneData
        }).then(res => {
          if(res.data.code === 0) {
            this.modifyPhoneState.firstStep = false;
            this.modifyPhoneState.secondStep = false;
            this.modifyPhoneState.lastStep = true;
            $('#popup-modifyPhone .steps-bar li').eq(2).addClass("active");
          }else {
            $('#popup-p-error').css({'display': 'block'}).animate({top: "317px"},100);
            this.errModal.errorCode = res.data.msg;
          }
        })
      },
      closeModify() { //关闭/完成绑定手机号
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-modifyPhone').css({'display': 'none'});
        $('#popup-modifyPhone .steps-bar li').eq(1).removeClass("active")
        $('#popup-modifyPhone .steps-bar li').eq(2).removeClass("active")
        this.modifyPhoneState.firstStep = true;
        this.modifyPhoneState.secondStep = false;
        this.modifyPhoneState.lastStep = false;
        this.modifyPhoneData.newphone = '';
        this.modifyPhoneData.phoneCode = '';
        this.modifyPhoneData.code = '';
        this.codetext = '短信验证码';
        clearInterval(this.timer);
        this.timer = null;
        this.$parent.getUserData();
        this.getUserData();
      },
      //实名认证
      submitRealNameData() { //上传实名认证信息
        if(!this.realNameData.realname) {
          this.$Message.warning('请输入正确姓名');
          return
        }
        if(!this.realNameData.idNum || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.realNameData.idNum)) {
          this.$Message.warning('请输入正确身份证号');
          return
        }
        this.$axios({
          url: '/api/user/realNameAuth',
          method: 'post',
          data: this.realNameData
        }).then(res => {
          if(res.data.code === 0) {
            this.$Notice.success({
              title: '提交成功 请耐心等待审核结果',
            });
            $('#mask').css({'display':'none','zIndex': '1000'});
            $('#popup-realname-auth').css({'display': 'none'});
            this.getRealNameStatus();
          }
        })
      },
      colseRealName() { //关闭实名认证模态框
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-realname-auth').css({'display': 'none'});
        this.realNameData.realname = '';
        this.realNameData.idNum = '';
      },
      //修改密码
      submitChangePwdData() { //上传修改密码信息
        if(!this.changePwdData.oldpass) {
          this.$Message.warning('请输入旧密码');
          return
        }
        if(!this.changePwdData.newpass) {
          this.$Message.warning('请输入新密码');
          return
        }
        this.$axios({
          url: '/api/user/reLoginPwd',
          method: 'post',
          data: this.changePwdData
        }).then(res => {
          if(res.data.code === 0) {
            this.$Notice.success({
              title: '修改成功 请重新登陆',
            });
            this.$store.commit('logout');
            this.$store.commit('changeStatus', true);
            this.$router.push('/login');
          }
        })
      },
      closeChangePwd() { //关闭修改密码
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-changePwd').css({'display': 'none'});
        this.changePwdData.oldpass = '';
        this.changePwdData.newpass = '';
      },
    },
  }
</script>

<style scoped>
  #page_member_security {
    background-color: white;
    color: #4c4c4c;
    height: 634px;
  }
  /*标题*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  /*安全等级*/
  #page_member_security > div {
    margin: 0 40px;
  }
  #page_member_security > div + div {
    border-top: 1px solid #e6e6e6;
  }
  #page_member_security h4 {
    font-weight: normal;
    font-size: 16px;
    margin: 30px 0 14px;
  }
  #page_member_security .level-div > div {
    margin-left: 20px;
  }
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
  .safe-level-line .choose-line {
    /*width: 66.66%;*/
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
  #page_member_security .level-div > div {
    margin-left: 20px;
  }
  #page_member_security .level-div i.active {
    color: #ff4519;
  }
  #page_member_security .level-div i {
    display: inline-block;
    font-size: 32px;
    color: #c7c7c7;
    margin-right: 14px;
    padding-bottom: 24px;
  }
  /*个人信息*/
  #page_member_security .info-div {
    padding-bottom: 20px;
  }
  #page_member_security .info-div p {
    line-height: 40px;
    padding-left: 20px;
    padding-right: 34px;
    font-size: 16px;
  }
  #page_member_security .info-div p label {
    width: 120px;
    display: inline-block;
  }
  #page_member_security .info-div p span {
    color: #808080;
  }
  #page_member_security .info-div p .verify {
    background-color: #ff4519;
    color: white;
  }
  #page_member_security .info-div p button {
    float: right;
    width: 96px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    display: block;
    border: 1px solid #ff4519;
    border-radius: 3px;
    margin-top: 3px;
    outline: 0;
    background: #fff;
    cursor: pointer;
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
  .popup input.readonly:focus {
    border: 0 !important;
    box-shadow: 0 0 0 0 !important;
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
  #popup-modifyPhone .confirm-btn, #popup-getVefifyCode .confirm-btn {
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
  /*修改手机号*/
  #popup-modifyPhone {
    width: 500px;
    margin-left: -250px;
    z-index: 1003;
  }
  #popup-modifyPhone .bar-percentage {
    width: 440px;
    height: 6px;
    background-color: #b3efd6;
    border-radius: 3px;
    margin: 40px auto 0;
    position: relative;
  }
  #popup-modifyPhone .bar-percentage .icon-error {
    position: absolute;
    top: -30px;
    right: -70px;
    font-size: 30px;
    color: white;
    cursor: pointer;
  }
  #popup-modifyPhone .steps-bar {
    width: 440px;
    margin: 0 auto;
  }
  #popup-modifyPhone .steps-bar li {
    float: left;
    width: 33.33%;
    text-align: center;
    color: #c7c7c7;
    font-size: 14px;
    position: relative;
  }
  #popup-modifyPhone .steps-bar li.active {
    color: #808080;
  }
  #popup-modifyPhone .steps-bar li span {
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
  #popup-modifyPhone .steps-bar li.active span {
    background-color: #00d47d;
    box-shadow: 0 0 6px 0px #00d47d;
  }
  #popup-modifyPhone .steps-bar li p {
    margin-top: 20px;
  }
  #popup-modifyPhone .steps-bar li:nth-child(1).active:after {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  #popup-modifyPhone .steps-bar li.active:after {
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
  #popup-modifyPhone .forget-form-step {
    margin-top: 10px;
  }
  #popup-modifyPhone .forget-form-step .text {
    width: calc(100% - 152px);
    margin-left: 70px;
  }
  .readonly {
    background: #eaeaea !important;
    color: #808080 !important;
  }
  #popup-modifyPhone .forget-form-step input,#popup-modifyPhone .forget-form-step button {
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
  #popup-modifyPhone .forget-form-step p {
    margin-left: 70px;
  }
  .page_auth .form p, #popup-modifyPhone .forget-form-step p {
    margin-top: 5px;
    color: #ff4519;
  }
  .hide {
    display: none;
  }
  #popup-modifyPhone .forget-form-step .input-short1 {
    width: 210px;
    float: left;
    margin-left: 70px;
  }
  #popup-modifyPhone .forget-form-step .input-short2 {
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
  #popup-modifyPhone .forget-form-step input {
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
  #popup-modifyPhone .finish i {
    display: block;
    font-size: 70px;
    text-align: center;
    color: #00d47d;
  }
  #popup-modifyPhone .finish p {
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
  /*实名认证   修改密码*/
  .popup-big {
    width: 500px;
    margin-left: -250px;
    min-width: 500px;
    z-index: 1004;
  }
  #popup-realname-auth .tip {
    width: 438px;
    height: 60px;
    border: 1px solid #ff4519;
    background-color: #fff0ec;
    color: #ff7959;
    line-height: 2;
    padding: 0 8px;
    border-radius: 4px;
    text-align: justify;
    margin: 28px auto;
  }
  #popup-realname-auth .tip span {
    color: #5cb1ff;
  }
  #popup-realname-auth .form,
  #popup-changePwd .form{
    width: 420px;
    margin: 10px auto 0;
    font-size: 16px;
    color: #808080;
  }
  #popup-realname-auth .form .inbox,
  #popup-changePwd .form .inbox {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
  }
  #popup-realname-auth .form input,
  #popup-changePwd .form input{
    width: 310px;
    border: 1px solid #e6e6e6;
    padding-left: 16px;
    margin-left: 20px;
    height: 40px;
    border-radius: 5px;
    font-size: 16px;
  }
  /*按钮*/
  .popup .btn-div a.preStep {
    background-color: #e6e6e6;
    color: #808080;
    border-bottom-left-radius: 10px;
  }
  .popup .btn-div a.nextStep {
    background-color: #ff4519;
    color: white;
    border-bottom-right-radius: 10px;
  }
</style>
