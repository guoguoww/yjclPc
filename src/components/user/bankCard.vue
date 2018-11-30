<template>
    <section id="page_member_bankcard">
      <h3 class="page_member-title">银行卡管理</h3>
      <!--绑定表单-->
      <div id="page_member_bankcard_no_card" v-if="bankCardInfoModify">
        <div class="form">
          <div class="inbox">
            <label>真实姓名</label>
            <div>
              <p id="no-verify" class="name" v-if="realNameStatus === 0 || realNameStatus === 3">
                <i class="icomoom icon-warning2" style="font-size:17px;"></i>
                未实名认证，请先认证
                <router-link to="/user/security">
                  去认证<i class="icomoom rotate icon-right"></i>
                </router-link>
              </p>
              <p id="姓名"class="name nameHide" v-if="realNameStatus === 1 || realNameStatus === 2">{{realNameStatus === 1? '审核中': userData.name}}</p>
            </div>
          </div>
          <div class="inbox">
            <label>开户银行</label>
            <input type="text" placeholder="请输入您的开户银行" v-model="submitBankCardData.bankname">
          </div>
          <div class="inbox">
            <label>支行省市</label>
            <input type="text" class="input1" placeholder="支行省市" v-model="submitBankCardData.bankprovince">
            <input type="text" class="input1" placeholder="支行县区" v-model="submitBankCardData.bankcity">
          </div>
          <div class="inbox">
            <label>支行名称</label>
            <input type="text" placeholder="请输入您的支行名称" v-model="submitBankCardData.branch">
          </div>
          <div class="inbox">
            <label>银行卡号</label>
            <input type="text" placeholder="请输入您的银行卡号" v-model="submitBankCardData.cardnum">
          </div>
        </div>
        <button class="color-btn" id="submit-btn" @click="submitBankCardInfo">提交信息</button>
        <p class="tip">温馨提示：为了资金安全，您只能绑定一张银行卡</p>
      </div>
      <!--已绑定卡-->
      <div id="page_member_bankcard_card" v-if="!bankCardInfoModify">
        <h5>当前绑定的银行卡 <a href="javascript: void (0);" class="fr" @click="modifyInfo()">修改</a></h5>
        <div class="bankcard-info">
          <div class="bankcard-img">
            <div class="clearfix">
              <p class="fl"><label id="bank_card_own">{{bankCardInfo.bank_name}}</label></p>
              <p class="fr">储蓄卡</p>
            </div>
            <h6 id="user-bankNo2">{{bankCardInfo.bank_card_num}}</h6>
          </div>
          <div class="bankcard-text bankcard-text2">
            <p>帐号：<label id="user-bankNo">{{bankCardInfo.bank_card_num}}</label></p>
            <p>户名：<label id="user_bankOn">{{userData.name}}</label></p>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "bankCard",
    data() {
      return {
        userData: {},
        realNameStatus: 0, //实名认证状态
        bankCardInfo: {}, //银行卡信息
        bankCardInfoModify: false, //银行卡修改显示
        submitBankCardData: { //需要提交的银行卡信息
          token: localStorage.getItem('_auth') || '', //登录信息
          bankname: '', //银行名称
          bankprovince: '', //支行省市
          bankcity: '', //支行城市
          branch: '', //支行名称
          cardnum: '', //银行卡号
        },
      }
    },
    created() {
      this.getUserData();
      this.getRealNameStatus();
      this.getBankCardInfo();
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
          }
        })
      },
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/bankCardInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length === 0) {
              this.bankCardInfoModify = true;
            }else {
              this.bankCardInfoModify = false;
            }
          }
        })
      },
      submitBankCardInfo() { //绑定/修改银行卡
        if(this.realNameStatus === 0 || this.realNameStatus === 3) {
          this.$Message.warning('请先实名认证')
          return
        }
        if(this.realNameStatus === 1) {
          this.$Message.warning('请等待实名认证审核通过')
          return
        }
        if(!this.submitBankCardData.bankname) {
          this.$Message.warning('请输入银行名称')
          return
        }
        if(!this.submitBankCardData.bankprovince) {
          this.$Message.warning('请输入支行省市')
          return
        }
        if(!this.submitBankCardData.bankcity) {
          this.$Message.warning('请输入支行城市')
          return
        }
        if(!this.submitBankCardData.branch) {
          this.$Message.warning('请输入支行名称')
          return
        }
        if(!this.submitBankCardData.cardnum) {
          this.$Message.warning('请输入银行卡号')
          return
        }
        this.$axios({
          url: '/api/user/setBankCard',
          method: 'post',
          data: this.submitBankCardData,
        }).then(res => {
          if(res.data.code === 0) {
            this.$Notice.success({
              title: '绑定成功',
            });
            this.getBankCardInfo();
          }
        })
      },
      modifyInfo() { //修改信息
        this.bankCardInfoModify = true;
        this.submitBankCardData.bankname = this.bankCardInfo.bank_name;
        this.submitBankCardData.bankprovince = this.bankCardInfo.bank_province;
        this.submitBankCardData.bankcity = this.bankCardInfo.bank_city;
        this.submitBankCardData.branch = this.bankCardInfo.bank_branch;
        this.submitBankCardData.cardnum = this.bankCardInfo.bank_card_num;
      },
    },
  }
</script>

<style scoped>
  a {
    color: #5cb1ff;
    cursor: pointer;
  }
  #page_member_bankcard {
    background-color: white;
    color: #4c4c4c;
    height: 634px;
  }
  /*头部*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  /*添加银行卡 form*/
  #page_member_bankcard_no_card .form {
    width: 442px;
    margin-left: 40px;
  }
  #page_member_bankcard_no_card .inbox {
    margin-top: 26px;
  }
  #page_member_bankcard_no_card label {
    width: 108px;
    display: inline-block;
    line-height: 40px;
    font-size: 16px;
  }
  #page_member_bankcard_no_card .inbox > div {
    display: inline-block;
    width: 310px;
  }
  #page_member_bankcard_no_card .inbox .name {
    color: #ff4519;
    line-height: 40px;
  }
  #page_member_bankcard_no_card .inbox .nameHide {
    color: rgb(128, 128, 128) !important;
    font-size: 16px;
  }
  #page_member_bankcard_no_card .inbox a {
    float: right;
  }
  #page_member_bankcard_no_card input {
    width: 324px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    font-size: 16px;
    padding-left: 12px;
    display: inline-block;
  }
  #page_member_bankcard_no_card input:focus {
    box-shadow: 0 0 3px 0 #ff4519;
    outline: none
  }
  #page_member_bankcard_no_card .input1 + .input1 {
    margin-left: 20px;
  }
  #page_member_bankcard_no_card .input1 {
    width: 150px;
  }
  /*按钮*/
  #page_member_bankcard_no_card button {
    width: 400px;
    margin: 98px auto 30px;
  }

  /*.disabled {*/
    /*background: #c7c7c7 !important;*/
    /*color: #fff !important;*/
  /*}*/
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
  .color-btn:focus {
    outline: 0;
    border: 0;
  }
  button {
    cursor: pointer;
  }
  /*温馨提示*/
  #page_member_bankcard_no_card .tip {
    width: 840px;
    height: 30px;
    border: 1px solid #ff4519;
    background-color: #fff0ec;
    color: #ff7959;
    line-height: 30px;
    padding: 0 12px;
    border-radius: 4px;
    margin: 0 auto;
  }
  /*已绑定银行卡*/
  #page_member_bankcard_card h5 {
    margin: 0 40px;
    font-weight: normal;
    line-height: 70px;
    font-size: 16px;
  }
  #page_member_bankcard_card h5 a {
    font-size: 14px;
  }
  #page_member_bankcard_card .bankcard-info {
    width: 610px;
    margin: 48px auto 0;
  }
  .bankcard-img {
    position: relative;
    display: inline-block;
    width: 200px;
    padding: 16px;
    color: white;
    border-radius: 5px;
    background: rgba(248,54,0,0.7);
    /*background: linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -moz-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -webkit-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -o-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
  }
  .bankcard-img:after {
    font-family: icomoon;
    content: "\e927";
    position: absolute;
    color: white;
    opacity: 0.1;
    right: -10px;
    font-size: 140px;
    top: 0;
    bottom: 0;
    line-height: 1;
  }
  .bankcard-img > div {
    border-bottom: 1px solid rgba(255,255,255,0.6);
    padding-bottom: 12px;
  }
  .bankcard-img p {
    line-height: 24px;
    font-size: 14px;
  }
  .bankcard-img h6 {
    font-size: 14px;
    text-align: center;
    letter-spacing: 2px;
    font-weight: normal;
    padding-top: 14px;
  }
  .bankcard-text2 {
    vertical-align: top;
    margin-top: 12px;
    line-height: 30px;
  }
  .bankcard-text {
    display: inline-block;
    margin-left: 30px;
    font-size: 14px;
    color: #808080;
    line-height: 24px;
    padding: 16px 0;
  }
</style>
