<template>
  <section id="page_member_payment" class="col-main">
    <div class="top-info">
      <h3 class="page_member-title">提现</h3>
      <div class="money-info">
        <label>可用余额</label>
        <span id="账户余额">{{balance}}</span>
      </div>
      <div class="money-info border-bottom recharge-box">
        <label class="label2">提现金额</label>
        <div class="recharge-num">
          <input type="number" id="b-pay-amount" class="text" placeholder="请输入提现金额" v-model="submitWithdrawal.amount" @input="changeMoney">
          <span>元</span>
        </div>
        <div class="txje_err" id="txje_err1">{{errCallback}}</div>
      </div>
    </div>
    <div class="bottom-info">
      <h4>提现至以下银行</h4>
      <div class="no-bank" v-if="!bankCardInfoShow">
        <p>未绑定银行卡</p>
        <router-link to="/user/bankCard">去绑定银行卡<i class="icomoon icon-right"></i></router-link>
      </div>
      <div class="has-bank" v-if="bankCardInfoShow">
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
      <a class="color-btn" id="mem_wdA" :class="withdrawalBtn? '' : 'disabled'" :disabled="!withdrawalBtn" @click="subWithdrawal">确定提现</a>
      <p class="tip">温馨提示：禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账户的使用。</p>
    </div>
  </section>
</template>

<script>
  export default {
    name: "withdrawal",
    data() {
      return {
        userData: {},
        balance: 0, //可用余额
        bankCardInfo: {}, //银行卡信息
        bankCardInfoShow: false, //是否存在银行卡
        submitWithdrawal: { //上传提现信息
          token: localStorage.getItem('_auth') || '', //登录信息
          password: '', //提现密码
          amount: '', //金额
        },
        errCallback: '', //错误信息显示
        withdrawalBtn: false, //提现按钮
      }
    },
    created() {
      this.getUserData();
      this.getShowBalance();
      this.getBankCardInfo();
    },
    methods: {
      getUserData() { //获取父路由的个人信息
        this.$parent.userData.then((userData) => {
          this.userData = userData
        })
      },
      getShowBalance() { //获取可用余额
        this.$axios.post('/api/user/showBalance', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.balance = res.data.data.balance
          }
        })
      },
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/bankCardInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length === 0) {
              this.bankCardInfoShow = false;
            }else {
              this.bankCardInfoShow = true;
            }
          }
        })
      },
      changeMoney() { //监听提现金额
        this.submitWithdrawal.amount = Number(this.submitWithdrawal.amount)
        this.balance = Number(this.balance)
        if(this.submitWithdrawal.amount > this.balance) {
          this.errCallback = '余额不足'
          this.withdrawalBtn = false;
          return
        }else {
          this.errCallback = ''
        }
        if(!this.submitWithdrawal.amount || this.submitWithdrawal.amount === 0) {
          this.errCallback = '请输入提现金额'
          this.withdrawalBtn = false;
          return
        }else {
          this.errCallback = ''
        }
        if(this.submitWithdrawal.amount && this.submitWithdrawal.amount !== 0 && this.submitWithdrawal.amount <= this.balance && this.bankCardInfoShow) {
          this.withdrawalBtn = true;
        }
      },
      subWithdrawal() {
        this.$axios({
          url: '/api/pay/baifuWithdraw',
          method: 'post',
          data: this.submitWithdrawal
        }).then(res => {
          if(res.data.code === 0) {
            this.$Notice.success({
              title: '提取成功 请注意查看',
            });
            this.$parent.getUserData();
            this.getUserData();
            this.getShowBalance();
            this.getBankCardInfo();
          }
        })
      }
    }
  }
</script>

<style scoped>
  #page_member_payment {
    color: #4c4c4c;
    height: 634px;
  }
  #page_member_payment .top-info {
    background-color: white;
    height: 204px;
  }
  /*头部*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  /*可用余额*/
  #page_member_payment .money-info {
    line-height: 1;
    font-size: 16px;
    margin: 30px 40px 0;
  }
  #page_member_payment .money-info label {
    width: 108px;
    display: inline-block;
  }
  /*充值金额*/
  #page_member_payment .money-info .label2 {
    vertical-align: top;
    line-height: 40px;
  }
  .recharge-num {
    width: 244px;
    height: 38px;
    line-height: 38px;
    color: #808080;
    display: inline-block;
  }
  .recharge-num input {
    height: 38px;
    color: #808080;
    padding-left: 10px;
    width: 212px;
    float: left;
    border: 1px solid #e6e6e6;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .recharge-num input:focus {
    outline: 0;
  }
  .recharge-num span {
    float: right;
    width: 32px;
    background-color: #e6e6e6;
    text-align: center;
    display: block;
    height: 38px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid #e6e6e6;
  }
  #page_member_payment .top-info .txje_err {
    margin-left: 150px;
    color: #ff4519;
  }
  /*银行卡信息*/
  #page_member_payment .bottom-info {
    height: 408px;
    margin-top: 20px;
    background-color: white;
    padding: 0 40px;
  }
  #page_member_payment .bottom-info h4 {
    font-size: 16px;
    font-weight: normal;
    line-height: 76px;
  }
  /*无银行卡*/
  #page_member_payment .bottom-info .no-bank p {
    display: inline-block;
    width: 220px;
    height: 100px;
    background-color: #c9c9c9;
    font-size: 16px;
    text-align: center;
    line-height: 100px;
    color: white;
    border-radius: 10px;
  }
  #page_member_payment .bottom-info .no-bank a {
    padding-left: 30px;
    vertical-align: bottom;
    display: inline-block;
  }
  /*存在银行卡*/
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
  #page_member_payment .bottom-info .color-btn {
    width: 400px;
    text-align: center;
    margin: 90px auto 32px;
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
  .color-btn.disabled:before {
    background-color: #eeeeee;
  }
  .color-btn.disabled:after {
    background-color: #eeeeee;
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
  #page_member_payment .bottom-info .tip {
    height: 30px;
    border: 1px solid #ff4519;
    background-color: #fff0ec;
    color: #ff7959;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 4px;
    text-align: justify;
  }
</style>
