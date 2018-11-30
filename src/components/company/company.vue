<template>
  <section class="company-section">
    <div class="container">
      <div class="page-company">
        <h4>{{content.title}}</h4>
        <div v-html="content.content"></div>
        <!--<ul class="clearfix">-->
          <!--<li class="ft25">-->
            <!--<i class="icomoon icon-company1"></i>-->
            <!--<p>稳健收入</p>-->
            <!--<span class="smInfo">年化收益高  有保障</span>-->
          <!--</li>-->
          <!--<li class="ft25">-->
            <!--<i class="icomoon icon-company2"></i>-->
            <!--<p>安全投资</p>-->
            <!--<span class="smInfo">具有安全的投资渠道</span>-->
          <!--</li>-->
          <!--<li class="ft25">-->
            <!--<i class="icomoon icon-company3"></i>-->
            <!--<p>卓越保障</p>-->
            <!--<span class="smInfo">多重筛选  铸就卓越风控</span>-->
          <!--</li>-->
          <!--<li class="ft25">-->
            <!--<i class="icomoon icon-company4"></i>-->
            <!--<p>轻松投资</p>-->
            <!--<span class="smInfo">财富增值从这里开始</span>-->
          <!--</li>-->
        <!--</ul>-->

      </div>
    </div>
  </section>
</template>

<script>
    export default {
        name: "company",
        data() {
            return {
                content: '',
            }
        },
        methods: {
            getArticleInfo(){
                this.$axios.post('api/article/getInfoByType/type/4')
                    .then(res => {
                        if(!res.data.code){
                            this.content = res.data.data[0];
                        }
                    })
                    .catch(err => {})
            },
        },
        mounted() {
            this.getArticleInfo();
        }
    }
</script>

<style scoped>
  .company-section {
    background: url(../../../static/imgs/product-bg.jpg) no-repeat center center;
    padding: 40px 0;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
   .page-company {
     background-color: white;
     padding: 0 38px 20px;
   }
  .group:after, .container:after, .field-wrapper:after, .row:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  .page-company h4 {
    line-height: 104px;
    color: #4c4c4c;
    text-align: center;
    font-size: 24px;
    font-weight: normal;
    border-bottom: 1px solid #f2f2f2;
  }
  .page-company article {
    display: block;
    padding: 10px 60px;
  }
  .page-company article p {
    padding-top: 30px;
    font-size: 16px;
    text-align: justify;
    color: #808080;
  }
  ul {
    padding: 48px 60px 30px;
  }
  ul li.ft25 {
    float: left;
    width: 25%;
    text-align: center;
    line-height: 1;
  }
  ul li i {
    display: block;
    font-size: 80px;
    color: #ff4519;
  }
  ul li p {
    color: #ff4519;
    font-size: 18px;
    padding-top: 30px;
  }
  ul li span.smInfo {
    display: block;
    color: #999;
    font-size: 16px;
    margin-top: 22px;
  }


</style>
