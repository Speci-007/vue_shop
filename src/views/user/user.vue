<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 栅栏，分竖块分开，一共24块 -->
      <el-row :gutter="20">
        <!-- 列与列之间的间隙 -->
        <el-col :span="16">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear = 'getuserlist'>
            <el-button slot="append" icon="el-icon-search" @click= "getuser" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="isdialogvisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 为table绑定数据源 ，prop为当前列所指向的数据-->

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <!-- 作用域插槽的使用，接收子组件传过来的值 -->
            <!-- {{scope.row}}显示了整行的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            <!-- 绑定一个布尔值判断开关的开关 -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
           <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditdialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuserbyid(scope.row.id)"></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
    </el-tooltip>
           
          </template>
        </el-table-column>
      </el-table>
     <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 4, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="isdialogvisible"
  width="50%" @close="dialogclose"  >
  <!-- visible.sync="dialogVisible"控制对话框的显示与隐藏 -->
   
 <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addform.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addform.password" type="password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addform.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addform.mobile"></el-input>
  </el-form-item>
    </el-form>
   
  <span slot="footer" class="dialog-footer">
    <el-button @click="isdialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
</el-dialog>

<!-- 添加修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editdialogvisible"
  width="50%" @close='editdialogclose'>
    
 <el-form :model="editform " :rules="addformrules" ref="editformref" label-width="70px" >
  <el-form-item label="用户名" >
    <el-input v-model="editform.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editform.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editform.mobile"></el-input>
  </el-form-item>
    </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="edituserinfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import instance from "../../network/request";

export default {
  name: "user",
  components: {
    instance,
  },
  data() {
    //验证邮箱的规则
    var checkemail = (rule,value,callback)=>{
      //验证邮箱的正则表达式
      const regemail = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
       if(regemail.test(value)){return callback()}
       else{callback(new Error('请输入合法的邮箱'))}
   }
   var checkmobile = (rule,value,callback)=>{
     const regmobile = /^(1[3|5-9])\d{9}$/
     if(regmobile.test(value)){return callback()}
     else{callback(new Error('请输入合法的手机号'))}
   }
    return {
      //获取用户列表的参数对象,通过接口文档获得
      queryinfo: {
        query: "",//搜素关键字
        pagenum: 1,//当前的页数
        pagesize: 2,//当前每页显示多少条数据
      },
      userlist: [],
      total: 0,
      isdialogvisible:false,//控制添加对话框的显示与隐藏
      editdialogvisible:false,//控制修改信息的对话框的显示与隐藏
       addform:{//数据绑定对象
         username:'',
         password:'',
         email:'',
         mobile:''
       },//添加用户表单的数据
     addformrules:{
       username:[
           { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
       ],
        password:[
           { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 12, message: '密码名长度在 6 到 12个字符', trigger: 'blur' }
       ],
     email:[
           { required: true, message: '请输入用户邮箱', trigger: 'blur' },
            { min: 6, max: 20, message: '邮箱长度在 6 到 20个字符', trigger: 'blur' },
            {validator:checkemail,trigger:'blur'}
       ],
        mobile:[
           { required: true, message: '请输入用户手机号', trigger: 'blur' },
                         {validator:checkmobile,trigger:'blur'}
      ],
     },//添加验证规则
     
    editform:{}
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    async getuserlist() {
      const res = await instance({
        //发送网络请求进行数据库的验证
        url: "users",
        method: "get",
        params: this.queryinfo,
      });
      if (res.data.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      console.log(res);
      this.userlist = res.data.data.users;
      this.total = res.data.data.total;
    },
    handleSizeChange(newSize){// pagesize: 2,//当前每页显示多少条数据,页内数据条数改变触发事件
    //  console.log(newSize);
     this.queryinfo.pagesize = newSize//将新的页内数据条数赋值后再发起网络数据请求
      this.getuserlist();
    },
    handleCurrentChange(newPage){
    //  console.log(newPage);//页码值发生切换及会触发这个事件
         this.queryinfo.pagenum = newPage
            this.getuserlist();
    },
  async userStateChanged(userinfo){//监听switch开关状态的改变，同步到数据库
      console.log(userinfo);
      // 根据api文档发起put请求
   const res =  await instance({
        //发送网络请求进行数据库的验证
        url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
        method: "put",
        params: this.queryinfo,
      });
       if (res.data.meta.status !== 200){
       userinfo.mg_state = !userinfo.mg_state
        return this.$message.error("更新用户状态失败！");}
        this.$message.success("更新用户状态成功！");
   },
   getuser(){
     this.getuserlist();

   },
   dialogclose(){//监听添加用户的关闭事件
   this.$refs.addformref.resetFields()//重置表单数据
   },
    editdialogclose(){//监听修改对话框的关闭事件
     this.$refs.editformref.resetFields()

   },
   adduser(){//点击按钮添加用户前，先进行验证
   this.$refs.addformref.validate( async valid=>{
    console.log(valid);//valid表示验证是否通过
     if(!valid) return
     else{//发起添加用户网络请求
          const res =  await instance({//发送网络请求进行数据库的验证
            url: 'users',
            method: 'post',
           data: this.addform
           })
             if(res.data.meta.status!==201) return this.$message.error("添加用户失败！")
              this.$message.success("添加用户成功！")
              this.isdialogvisible = false
              this.getuserlist()
     }
       
     })
        
   },
    async showeditdialog(id){//显示编辑框的对话框
      this.editdialogvisible = true
      // console.log(id);
       const res =  await instance({//发送网络请求进行数据库的验证
            url: 'users/'+ id,
            method: 'get',
          //  data: this.addform
           })
             if(res.data.meta.status!==200) return this.$message.error("查询用户信息失败！")
       
              this.editform = res.data.data
              // console.log(res.data.data);
              this.editdialogvisible =true
   },
  edituserinfo(){//修改信息的预验证
this.$refs.editformref.validate( async valid=>{
    console.log(valid);//valid表示验证是否通过
     if(!valid) return
      const res =  await instance({//发送网络请求进行数据库的验证
            url: 'users/'+ this.editform.id,
            method: 'put',
             data:{
               email:this.editform.email,
               mobile:this.editform.mobile
             }
          //  data: this.addform
           })  
   if(res.data.meta.status!==200) return this.$message.error("更新用户信息失败！")
        // console.log(res);   
        this.editdialogvisible = false//关闭对话框
        this.getuserlist()//刷新数据列表
              this.$message.success("更新用户成功！")//跳出提示
        
  }
)
  },
 async removeuserbyid(id){//弹框询问用户是否删除数据
    const res =  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'    //由于此函数返回的是一个promise对象所以用await接收

        }).then(res=>{
      return instance({//发送网络请求进行数据库的验证
            url: 'users/'+ id,
            method: 'delete',   
           }).then(res=>{  this.getuserlist()
                   this.$message.info("删除用户成功！")
                           
           })
           
        })
        .catch(err=>{this.$message.info("已取消删除！")})//捕获错误，即用户点击取消按钮
}

  }
  }
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 13px;
}
.el-pagination{
  margin-top: 15px;
}
</style>