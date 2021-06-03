<template>
  <el-menu 
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eef"
      :unique-opened='true'
         :collapse = "iscollapse"
         :collapse-transition="false"
         :router="true"
         :default-active="$route.path">
         <!-- default-active为默认高亮，它根据的是二级菜单中的index的路径 -->
         <!-- 接上，也可以选择当点击这个路径时，通过定义函数保存当前路径，然后保存在window的session中 -->
           <!-- 二级菜单开启路由模式，就是当点击之后跳转到index所对应的路径地址 -->
      <!-- //unique-opened这个属性为每次只允许一个菜单栏展开,而且true必须为布尔值，所以动态绑定属性，否则就是string类型 -->
         <!-- collapse 属性为左侧栏是否可以展开，默认为false，collapse-transition为展开是否有动画 -->
      <!-- 一级菜单 -->
      <el-submenu 
      :index="item.id +''" 
      v-for="(item ,index) in menuslist" 
      :key="item.id" >
       <!-- 此处index的作用也可以为设置单独的标志，防止点击一个时，多个同步变化 -->
        <!-- 一级菜单的模板 -->
        <template slot="title">
          <i  class="icon" :class="iconslist[index]" ></i>
          <span>{{item.authName}}</span>
        </template>
       <!-- 二级菜单 -->
    <el-menu-item :index="'/'+ subitem.path " v-for="subitem in item.children" :key="subitem.id"> 
      <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template></el-menu-item>
      
      </el-submenu>
     
    </el-menu>
</template>

<script>
import  instance from '../network/request'
export default {
name:'asidee',
data(){
  return{
    menuslist:[],
    iconslist:["el-icon-user-solid", "el-icon-bank-card","el-icon-s-goods","el-icon-delete-solid","el-icon-s-platform"],
        
  }
},
props: {
  iscollapse:Boolean      
   
},
created () {
  this.getmenulist()
  
},
updated () {
  console.log(this.$route.path);
},
methods: {
  async getmenulist(){
    const res = await instance({
       url: 'menus',
            method: 'get',
    })
    console.log(res);
     if(res.data.meta.status!=200) return this.$message.error(res.meta.msg)
     this.menuslist = res.data.data
    
  }
}

}
</script>

<style scoped>
.icon{
  margin-right: 15px;
}
.el-menu{
  border-right: none;
  /* 除去右侧多出的1px */
}
</style>