<template>
    <section class="page-personal">
      <div class="container clearfix">
        <Affix>
          <aside class="col-left">
            <!--头像账号-->
            <div class="user-img">
              <img src="../../../static/imgs/logo.png" style="width: 44%;">
              <!--<img :src="!!loginImg? loginImg: ''" width="80%" alt="">-->
              <p>欢迎回来</p>
              <h4 id="shared_layout_mem_lnm">{{user.user_name}}</h4>
            </div>
            <!--菜单-->
            <h5>我的资产</h5>
            <ul>
              <li :class="{'active':router === '/user'}">
                <router-link to="/user">我的资产</router-link>
              </li>
              <li :class="{'active':router === '/user/topUp'}">
                <router-link to="/user/topUp">充值</router-link>
              </li>
              <li :class="{'active':router === '/user/withdrawal'}">
                <router-link to="/user/withdrawal">提现</router-link>
              </li>
            </ul>
            <h5>我的账户</h5>
            <ul>
              <li :class="{'active':router === '/user/bankCard'}">
                <router-link to="/user/bankCard">银行卡管理</router-link>
              </li>
              <li :class="{'active':router === '/user/security'}">
                <router-link to="/user/security">账户安全</router-link>
              </li>
            </ul>
          </aside>
        </Affix>
        <aside class="col-right">
          <router-view></router-view>
        </aside>
      </div>
    </section>
</template>

<script>
  export default {
    name: "user",
    data() {
      return {
        loginImg: '', //logo头像
        user: {}, //获取信息
        userData: {}, //传递子路由信息
      }
    },
    computed: {
      router() {
        return this.$route.path;
      }
    },
    created() {
      // this.configData.then(() => { //获取logo
      //   this.loginImg = `${process.env.API_HOST}` + this.$store.state.NewMsg.web_logo.value;
      // });
      this.getUserData()
    },
    methods: {
      getUserData() { //获取个人信息
        this.userData = new Promise(resolve => {
          this.$axios.post('/api/user/userInfo', {token: localStorage.getItem('_auth')}).then(res => {
            if (res.data.code === 0) {
              this.user = res.data.data
              resolve(res.data.data)
            }
          })
        })
      },
    },
  }
</script>

<style scoped>
  /*最外围盒子*/
  .page-personal {
    background: url('../../../static/imgs/product-bg.jpg') no-repeat center center;
    padding: 40px 0;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  /*左侧导航*/
  .page-personal .col-left {
    background-color: white;
    width: 240px;
    height: 634px;
    float: left;
    text-align: center;
    color: #4c4c4c;
  }
  /*头像信息*/
  .page-personal .col-left img {
    padding: 20px 0 10px;
  }
  .page-personal .col-left .user-img p {
    font-size: 14px;
    line-height: 1;
  }
  .page-personal .col-left .user-img h4 {
    font-size: 16px;
    font-weight: normal;
    margin-top: 10px;
    line-height: 1;
    margin-bottom: 16px;
  }
  /*菜单*/
  .page-personal .col-left ul li {
    line-height: 46px;
  }
  .page-personal .col-left li.active a {
    color: #ff4519;
  }
  .page-personal .col-left a {
    font-size: 18px;
    color: #4c4c4c;
    display: block;
  }
  .page-personal .col-left h5 {
    font-size: 14px;
    text-align: left;
    font-weight: normal;
    margin-left: 55px;
    line-height: 32px;
  }

  /*右侧内容*/
  .page-personal .col-right {
    float: right;
    width: 940px;
    min-height: 634px;
    color: #4c4c4c;
  }
</style>
