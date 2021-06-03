<template>
  
     <el-container class="container">
       <!-- 头部区域 -->
  <el-header>
    <div class="imgbox">
    <img src="../assets/logohua.jpg" alt="">
      <span> 电商后台管理系统</span> 
  </div>
     <el-button  type="info" @click="exit">
      退出
    </el-button></el-header>
    <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="collapse? '64px' :'200px'">
      <!-- 用于判断折叠时是否改变其宽度 -->
   <div class="toggle-button" @click="toggle">| | |</div>
     
     <asidee  :iscollapse='collapse'></asidee>
     </el-aside>
   <!-- 内容区 -->
    <el-main>
      
    <router-view> </router-view>
    </el-main>
  </el-container>
</el-container>
   
  
</template>

<script>
import asidee from '../views/aside'
export default {
name:'home',
components: {
  asidee,
},
data(){
  return {collapse : false}
},
methods: {
  exit(){
    window.sessionStorage.clear();
    this.$router.push('/login');
  },
  toggle(){
    this.collapse = !this.collapse
    // console.log(999);
  }
}
}
</script>

<style scoped>
.container{
  height: 100%;
}
.el-header{
 display: flex;
 justify-content: space-between;
 align-items: center;
  color: #fff;
  background-color: #434447;
  padding-left: 5px;

}
  .imgbox {
 display: flex;
 align-items: center;
}
.el-header img{
width: 60px;
height: 60px;
border-radius: 50%;
margin-right: 15px;
}
.el-aside{
  background-color: #545c64;
}
.el-main{
  background-color: rgb(248, 244, 244);
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;

}
</style>