<template>
  <div id="app">
    <headerC v-show="!$route.meta.showHeader"></headerC>

    <router-view></router-view>

    <footerC v-show="!$route.meta.showFooter"></footerC>
  </div>
</template>

<script>
  import headerC from '@/components/common/headerC';
  import footerC from '@/components/common/footerC';

  export default {
    name: 'App',
    data(){
      return {
        curWebInfos: '',
      }
    },
    created() {
      this.configData.then(() => {
        this.curWebInfos = this.$store.state.NewMsg;//获取初始化配置数据
        document.title = this.curWebInfos.web_title.value;
      })
    },
    components: {
      headerC,
      footerC
    },

  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
