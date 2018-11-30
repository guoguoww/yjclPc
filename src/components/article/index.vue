<template>
    <section>
      <section class="articleList">
        <ul class="container">
          <li class="clearfix" v-for="item in artList" @click="openContentDetails(item)">
            <a href="javascript: void (0)" class="fl" :title="item.title">{{item.title}}</a>
            <span class="fr">{{item.create_time}}</span>
          </li>
          <div class="page" v-if="articleList.length > pageNum">
            <Page :total="articleList.length" :page-size="pageNum" size="small" show-total show-elevator @on-change="pageChange"/>
          </div>
        </ul>
        <p class="thereNo" v-show="articleList.length === 0">暂无信息...</p>
        <!--分页器-->
      </section>
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
    name: "index",
    data() {
      return {
        artList: [],
        articleList: [], //列表
        contentDetails: {}, //详情
        page: 1, //页码
        start: 0, //从0开始
        pageNum: 14, //页容量
      }
    },
    computed: {
      router() {
        return this.$route.params.id;
      }
    },
    mounted() {
      this.getInfoList(this.router)
    },
    methods: {
      getInfoList(type) {
        this.$axios({
          url: '/api/article/getInfoByType',
          method: 'post',
          data: {
            type: type
          },
        }).then(res => {
          if(res.data.code === 0) {
            this.articleList = res.data.data;
            this.artList = res.data.data.slice(this.start, this.pageNum * this.page);
          }
        })
      },
      pageChange(page) { //分页
        this.page = page
        this.start = (page - 1) * this.pageNum;
        this.getInfoList(this.router)
      },
      openContentDetails(conDetails) { //获取详情
        this.contentDetails = conDetails;
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
      },
      closeContentDetails() { //关闭
        this.contentDetails = {};
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popupCon').css({'display': 'none'});
      }
    }
  }
</script>

<style scoped>
  .articleList {
    background: #fff;
    min-height: 708px;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    padding: 15px 0;
    position: relative;
  }
  ul li {
    padding: 0 20px;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    color: #908888;
    cursor: pointer;
  }
  ul li:not(:last-child) {
    border-bottom: 1px dashed #f2f2f2;
  }
  ul li a {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #908888;
  }
  ul li span {
    width: 20%;
    text-align: right;
  }
  /*分页*/
  .page {
    text-align: right;
    margin-right: 10px;
    line-height: 46px;
  }
  /*暂无消息*/
  .thereNo {
    text-align: center;
    line-height: 200px;
    font-size: 16px;
    color: #808080;
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
