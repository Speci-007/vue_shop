<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="555" />
      </div>

      <el-form   ref="loginform" class="login_form" :model="form" :rules="loginrules">
        <!-- //:model（进行数据绑定）不同于v-model， -->

        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import  instance from '../network/request'
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      loginrules: {
        // 表单验证规则：首先属性绑定指定rules规则,在data中写验证规则，再对不同的表单制定不同的prop
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ], //验证用户名是否合法
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    reset(){
      console.log(this);
      this.$refs.loginform.resetFields()//对表单input输入框进行重置
    },
    login(){
         this.$refs.loginform.validate( async(valid)=>{
          console.log("输入框值为"+valid);//对函数的预校验，参数传递一个函数，第一个形参为验证的结果
            if(!valid) return ;
          const res=  await instance({//发送网络请求进行数据库的验证
            url: 'login',
            method: 'post',
           data: this.form
           })
           console.log(res);
           if(res.data.meta.status!==200) return this.$message.error("登陆失败！")
          this.$message.success("登陆成功！")//直接调用element UI的方法即可实现弹框
            window.sessionStorage.setItem("token",res.data.data.token)//将token信息保存在客户端session中，关闭浏览器即销毁
            this.$router.push("/home")//登录之后进行路由的跳转
 })
  }
  }}
</script>

<style  scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_box .avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>