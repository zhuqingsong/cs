<template>
    <div class="container" >
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="账号">
                <el-input v-model="formInline.username" placeholder="账号"></el-input>
            </el-form-item>
             <el-form-item label="手机号">
                <el-input v-model="formInline.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <!-- <el-form-item label="活动区域">
                <el-select v-model="formInline.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
            </el-form-item>
        </el-form>
      <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="编号"
                width="150">
                </el-table-column>
                <el-table-column
                prop="account"
                label="账号"
                width="120">
                </el-table-column>
                <el-table-column
                prop="mobile"
                label="手机号"
                width="120">
                </el-table-column>
                <el-table-column
                prop="username"
                label="昵称"
                width="120">
                </el-table-column>
                <el-table-column
                prop="sex"
                label="性别"
                :formatter="formatSex"
                >
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                :formatter="formatStatus"
                 >
                </el-table-column>
                <el-table-column
                prop="role_name"
                label="用户角色"
                 >
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="180">
                <template slot-scope="scope">
                    <el-popconfirm
                            confirm-button-text='确认'
                            cancel-button-text='取消'
                            icon="el-icon-info"
                            icon-color="red"
                            @onConfirm="handleDeleteUser(scope.row)"
                            :title="`确认要${scope.row.status == 1? '禁用': '启用'}该用户嘛？`"
                            >
                            <el-button slot="reference" type="text" size="small">{{scope.row.status == 1? '禁用' : '启用'}} </el-button>
                        </el-popconfirm>
                    <!-- <el-button type="text" size="small">修改密码</el-button> -->
                </template>
                </el-table-column>
  </el-table>


            <el-dialog title="添加用户" :visible.sync="addUserVisible">
                <el-form :model="user" size="mini" :rules="rules" ref="ruleForm">
                    <el-form-item label="用户名" label-width="120px" prop="account" required>
                      <el-input  size="small" v-model="user.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" label-width="120px" prop="password" required>
                      <el-input  size="small" type="password" v-model="user.password" autocomplete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="昵称" label-width="120px" prop="username" required>
                      <el-input  size="small" v-model="user.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" label-width="120px" prop="mobile" required>
                      <el-input  size="small" v-model="user.mobile" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" label-width="120px" prop="sex">
                        <el-radio-group v-model="user.sex">
                            <el-radio label="男" value="1"></el-radio>
                            <el-radio label="女" value="0"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="角色" label-width="120px" prop="role" required>
                        <el-select v-model="user.role" placeholder="请选择角色">
                            <el-option :label="item.role_name" :value="item.role_id"  v-for="item in roleList" v-bind:key="item.role_id" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addUserVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitUser('ruleForm')">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template> 
<script>
import { getUserList, getRoleList, addUserInfo, updateUserInfo } from '@/api/user';
export default {
    data(){
        return {
            tableData: [],
            roleList:[],
            addUserVisible: false,
            user: {
                account:'',
                password: '',
                username: '',
                mobile: '',
                role: '',
                sex: 1
            },
            formInline:{
                username: '',
                mobile: ''
            },
            rules: {
                account: [
                        { required: true, message: '请填写账号', trigger: 'blur' }
                ],
                username: [
                        { required: true, message: '请填写昵称', trigger: 'blur' }
                ],
                password: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                ],

                mobile: [
                        { required: true, message: '请填写手机号', trigger: 'blur' }
                ],

                role: [
                    { required: true, message: '请至少选择一个角色', trigger: 'change' }
                ],

            }
        }
    },
 created() {
    // Mock: get all routes and roles list from server
    this.getUserListFn();
    this.getUserRoleListFn();
  },

  methods: {
      formatSex: function(row, column) {
          return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
      },
      formatStatus: function(row, column) {
          return row.status === 1 ? '正常' : '禁用'
      },
      getUserListFn() {
          const self = this;
           getUserList().then(res=>{
               if(res.code == 1){
                   self.tableData = res.data;
               }
           }) 
      },
     getUserRoleListFn() {
          const self = this;
           getRoleList().then(res=>{
               if(res.code == 1){
                   self.roleList = res.data;
               }
           }) 
      },
      handleDeleteUser(row) {
          const self = this;
          updateUserInfo({id: row.id, status: row.status==1? 0: 1}).then(rs=>{
              if(rs.code == 1) {
                   self.$message({
                        message: "操作成功",
                        type: 'success'
                    });
                    self.getUserListFn(); //获取用户列表
              }else{
                  self.$message({
                    message: rs.msg,
                    type: 'error'
                });
              }
          })
      },
      onSubmit() {

          const formData = this.formInline;

          console.log(formData, 'fffffddddd');

          

      },
      submitUser(formName) {
          const self = this;
          this.$refs[formName].validate((valid) => {
          if (valid) {
              let params  = this.user;
            addUserInfo(params).then(res=>{
                if(res.code == 1) {
                    self.$message({
                        message: "添加成功",
                        type: 'success'
                    });
                    self.addUserVisible = false;
                    this.getUserListFn(); //获取用户列表
                }else{
                    self.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
          } else {
            return false;
          }
        });
      }
  }
}
</script>
<style lang="sass">
    @import url("./index.sass")
</style>