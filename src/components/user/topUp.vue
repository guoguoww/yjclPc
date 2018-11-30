<template>
    <section id="page_member_payment" class="col-main">
      <h3 class="page_member-title">充值</h3>
      <div class="money-info">
        <label>可用余额</label>
        <span id="账户余额">{{balance}}</span>
      </div>
      <div class="money-info border-bottom recharge-box">
        <label class="label2">充值金额</label>
        <div class="recharge-num">
          <input type="number" v-model="amount" id="b-pay-amount" class="text" placeholder="请输入充值金额">
          <span>元</span>
        </div>
      </div>
      <div class="submitBtn" @click="submitBtn">
        <button>提交</button>
      </div>

      <div class="bank-notes">
        <h5>温馨提示</h5>
        <ol>
          <li>1.  为了您的资金安全，您的账户资金将由第三方银行托管；</li>
          <li>2.  充值前请注意您的银行卡充值限制，以免造成不便；</li>
          <li>3.  禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账户的使用；</li>
          <li>4.  为了您的资金安全，建议充值前进行实名认证、手机绑定；</li>
          <li>5.  如果充值遇到任何问题，请联系客服：<label id="m_basic_mobile">4008-762-722</label>。</li>
        </ol>
      </div>
    </section>
</template>

<script>
  export default {
      name: "topUp",
      data(){
        return {
            balance: '',
            amount: '',
        }
      },
      mounted(){
          this.showBalance();
      },
      methods: {
        showBalance(){
            this.$axios.post('/api/user/showBalance',{token: localStorage.getItem('_auth')})
                .then(res => {
                    if(!res.data.code){
                        this.balance = res.data.data.balance
                    }
                })
                .catch(err => {
                    this.$Notice.error({title: err,})
                })
        },
        submitBtn(){
            if(!this.amount){
                this.$Notice.warning({title: '充值金额不能为空',});
                return
            }

            this.$axios.post('/api/pay/kuaiDianPay',{token: localStorage.getItem('_auth'),amount: this.amount,type: 1})
                .then(res => {
                    if(!res.data.code){
                        window.location.href = res.data.data.pay_url;
                    }

                })
                .catch(err => {
                    this.$Notice.error({title: err,})
                })
        },
      },
  }
</script>

<style scoped>
  #page_member_payment {
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
  /*提交*/
  #page_member_payment .submitBtn {
    margin: 30px 40px 0;
    padding-bottom: 30px;
    border-bottom: 1px solid #e6e6e6;
  }
  #page_member_payment .submitBtn button {
    border: 0;
    outline: 0;
    width: 355px;
    height: 40px;
    background: #ff4519;
    color: #fff;
    cursor: pointer;
  }
  /*温馨提示*/
  #page_member_payment .bank-notes {
    margin-top: 20px;
    font-size: 16px;
    color: #808080;
    padding: 0 60px;
  }
  #page_member_payment .bank-notes h5 {
    font-size: 16px;
    font-weight: normal;
    line-height: 34px;
  }
  #page_member_payment .bank-notes ol li {
    font-size: 14px;
    line-height: 22px;
  }
</style>
