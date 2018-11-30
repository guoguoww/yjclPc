<template>
    <div class="helpcenter">
      <section class="container">
        <div class="question " v-show="initShow">
          <h2 class="title">常见问题</h2>
          <div class="list-area">
            <div class="area" v-for="(item, index) of articleList" :key="index">
              <p>{{item.title}}</p>
              <ul class="clearfix">
                <li v-for="(citem, i) of item.child" :key="i" @click="getArticalInfo(citem.id)"><a>{{citem.title}}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="answer hide" v-show="!initShow">
          <div class="site">
            <a class="back" @click="toggleBack">返回</a>&gt;<span>{{articleTit}}</span>
          </div>
          <div class="main-area">
            <p class="q-row">{{articleTit}}</p>
            <p class="a-row" v-html="articleContent"></p>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
    export default {
      name: "index",
      data(){
        return {
          initShow: true,
          articleList: [],//文章列表数据
          articleTit: '',//文章标题
          articleContent: '',//文章内容
        }
      },
      mounted(){
        this.getInfo();

      },
      methods: {
        getInfo(){//文章
          this.$axios.post('/api/article/getInfo').then(res =>{
            if(res.data.code === 0){

              if(res.data.data && res.data.data.length !== 0){
                this.articleList = res.data.data;
              }
            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,});
            })
        },
        getArticalInfo(curId){//文章详情
          this.initShow = false;

          this.$axios.post('/api/article/getArticleDetail', {article_id: curId}).then(res =>{
            if(res.data.code === 0){

              if(Object.keys(res.data.data).length !== 0){
                this.articleTit = res.data.data.title;
                this.articleContent = res.data.data.content;
              }
            }else {
              this.$Notice.error({title: res.data.msg,});
            }
          })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,});
            })
        },
        toggleBack(){
          this.initShow = true;
        }
      },
    }
</script>

<style scoped>
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .helpcenter > section {
    background-color: #fff;
    padding: 40px 30px;
    min-height: 544px;

  }

  .helpcenter h2.title {
    color: #333;
    font-size: 18px;
    border-bottom: 1px dashed #e0e0e0;
    padding-bottom: 20px;
    margin-bottom: 50px;
    font-weight: bold;
  }
  .helpcenter .area {
    margin-top: 30px;
    padding: 0 50px;
  }
  .helpcenter .area p {
    height: 16px;
    border-left: 4px solid #ff500a;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    padding-left: 10px;
  }
  .helpcenter .area ul {
    margin-top: 25px;
  }
  .helpcenter .area li {
    float: left;
    width: 50%;
    margin-bottom: 20px;
  }
  .helpcenter .area a {
    color: #666;
    cursor: pointer;
    font-size: 16px;
  }
  .helpcenter .area a:hover, .helpcenter .site a:hover {
    color: #ff500a;
  }
  .helpcenter {
    background-color: #f2f2f2;
    padding: 30px 0;
  }
  .helpcenter .site {
    border-bottom: 1px dashed #e0e0e0;
    padding-bottom: 10px;
    color: #999;
    margin-bottom: 30px;
  }
  .helpcenter .site a {
    color: #999;
    margin-right: 5px;
    cursor: pointer;
  }
  .helpcenter .site span {
    margin-left: 5px;
  }
  .helpcenter .main-area {
    padding: 0 20px;
  }
  .helpcenter .q-row {
    font-weight: bold;
    font-size: 16px;
    color: #666;
  }
  .helpcenter .a-row {
    line-height: 2;
    font-size: 16px;
    color: #999;
  }
</style>
