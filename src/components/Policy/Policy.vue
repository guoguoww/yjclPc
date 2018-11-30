<template>
    <div class="agree-wrap" v-html="content"></div>
</template>

<script>
    export default {
      name: "Policy",
      data(){
        return {
          content: '',
        }
      },
      mounted(){

        this.getAgreementDetail();//获取协议详情信息
      },
      methods: {
        getAgreementDetail(){//获取协议详情信息
          this.$axios.post('/api/contract/getContent',{id: this.$route.params.type})
            .then(res => {

              if(res.data.code === 0){
                this.content = res.data.data.content;
              }
            })
            .catch(err => {
              this.$Notice.error({title: err.data.msg,})
            })
        },
      }
    }
</script>

<style scoped>
  .agree-wrap {
    width: 900px;
    padding: 0 50px 50px;
    margin: 0 auto;
    border: 1px solid #DBDBDB;
    background-color: #FFFFFF;
    line-height: 2;
    background-color: white;
    margin: 40px auto;
  }
  .agree-wrap > p {
    color: #666666;
    font-size: 12px;
  }
</style>
