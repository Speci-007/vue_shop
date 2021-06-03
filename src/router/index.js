import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../views/welcome.vue'
import users  from '../views/user/user.vue'
import roles  from '../views/manager/roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: home,
    redirect:'/welcome',//当访问的是home路径时，便重定向到welcome里
    children:[{
      path:'/welcome',
      component:welcome
    },
  {
    path:'/users',
    component:users
  },
  {path:'/roles',
component:roles}
  ]
    // 子路由的嵌套规则
  }

]

const router = new VueRouter({
  routes
})



//挂载路由导航, 跳转之前的验证，控制页面的访问权限
// to 表示去哪，from 表示从哪来的 next表示放行，next（）表示强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()//只有登录界面不需要权限，所以可以直接放行
  //获取token
  const tokenVal = window.sessionStorage.getItem('token')
  if (!tokenVal) return next('/login')//如果未携带token则强制转换路径
   next()//放行
  
  
})

export default router
