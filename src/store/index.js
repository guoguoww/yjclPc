import Vue from 'vue'
import Vuex from 'vuex'
import axios from "../axios";

Vue.use(Vuex)

// 创建一个store

const store = new Vuex.Store({
  state: {
    NewMsg:JSON.parse(window.localStorage.getItem('configInfos')) || {},
    _auth: null,
    status:false,

  },
  mutations: {
    modifyMsg (state,Obj){

      state.NewMsg = Obj;
      window.localStorage.setItem('configInfos',JSON.stringify(Obj));

    },
    logined (state, data){
      window.localStorage._auth = data;
      state._auth = data;
    },
    logout (state){

      window.localStorage.removeItem('_auth');
      state._auth = null;
    },
    changeStatus:(state,data)=>{
      state.status=data;
    }
  },
  actions: {
     fetchMsg (context){
       return axios.post('/api/config/configInfo')
        .then(res => {
          if(res.data.code === 0){
            if(res.data.data && res.data.data.length !== 0){

              context.commit('modifyMsg',res.data.data);

            }
          }else {
            this.$Notice.error({title: res.data.msg,});
          }
        })
        .catch(err => {
          this.$Notice.error({title: err.data.msg,});
        });
    }
  },
})

export default store
