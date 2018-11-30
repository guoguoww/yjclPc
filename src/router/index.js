import Vue from 'vue'
import Router from 'vue-router'

const login = () => import('@/components/login/login') //登录
const reg = () => import('@/components/login/reg') //注册

const user = () => import('@/components/user/user') //个人中心
const assets = () => import('@/components/user/assets') //我的资产
const topUp = () => import('@/components/user/topUp') //充值
const withdrawal = () => import('@/components/user/withdrawal') //提现
const bankCard = () => import('@/components/user/bankCard') //银行卡管理
const security = () => import('@/components/user/security') //账户安全

const index = () => import('@/components/index')
const article = () => import('@/components/article/index') //公司新闻/专业机构 更多
const help = () => import('@/components/help/index')
const buy = () => import('@/components/pointBuy/buy') //A股点买
const sell =() => import('@/components/pointBuy/sell') //点卖区 模拟点卖
const settleAccount = () => import('@/components/pointBuy/settleAccount') //结算区
const entrust = () => import('@/components/pointBuy/entrust') //委托区
const weixin = () => import('@/components/weixin/weixin') //手机客户端
const Policy = () => import('@/components/Policy/Policy') //交易部分的协议
const company = () => import('@/components/company/company')//关于我们

Vue.use(Router)


const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/article/:id',
    name: 'article',
    component: article
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/reg',
    name: 'reg',
    component: reg
  },
  {
    path: '/help',
    name: 'help',
    component: help
  },
  {
    path: '/buy/:type',
    name: 'buy',
    component: buy,
    children: [
      {
        path: 'sell',
        name: 'sell',
        component: sell,
        meta: {
          auth: true,
        }
      },
      {
        path: 'settleAccount',
        name: 'settleAccount',
        component: settleAccount,
        meta: {
          auth: true,
        }
      },
      {
        path: 'entrust',
        name: 'entrust',
        component: entrust,
        meta: {
          auth: true
        }
      },
    ]
  },
  {
    path: '/company',
    name: 'company',
    component: company
  },
  {
    path: '/weixin',
    name: 'weixin',
    component: weixin
  },
  {
    path: '/Policy/:type',
    name: 'Policy',
    component: Policy,
    meta: {
      showHeader: true,
      showFooter: true,
    }
  },
  { //个人中心
    path: '/user',
    name: 'user',
    component: user,
    children: [
      { //我的资产
        path: '',
        name: 'assets',
        component: assets,
        meta: {
          auth: true,
        },
      },
      { //充值
        path: 'topUp',
        name: 'topUp',
        component: topUp,
        meta: {
          auth: true,
        },
      },
      { //提现
        path: 'withdrawal',
        name: 'withdrawal',
        component: withdrawal,
        meta: {
          auth: true,
        },
      },
      { //银行卡管理
        path: 'bankCard',
        name: 'bankCard',
        component: bankCard,
        meta: {
          auth: true,
        },
      },
      { //账户安全
        path: 'security',
        name: 'security',
        component: security,
        meta: {
          auth: true,
        },
      },
    ]
  },
]

const router = new Router({
  routes,
});

router.beforeEach((to, from, next) => {
  var userInfo = localStorage.getItem('_auth') //router.app.$cookie.get('_auth') //JSON.parse(localStorage.getItem('userInfoStorage'));
//
  if (to.meta.auth) { //判断需不需要登录验证

    if (userInfo) { //有没有用户信息
      next()
    } else { //没有跳到登录页
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else if (to.name === 'login') { //判断进入的地址是不是登录页
    if (userInfo) { //有没有用户信息 有就返回首页 没有就进

      next({
        path: '/',
      })
    } else {
      next()
    }
  } else {
//
    next()
  }
})







export default router

