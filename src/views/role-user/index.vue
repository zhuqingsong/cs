<template>
    <div class="container" >
        <div class="roleWrap">
            <div class="roleList">
                 <div class="roletab">
                      <span class="rolename">角色管理</span>
                      <el-button type="primary" size="mini" @click="addRoleVisible = true">添加角色</el-button>
                </div>
                 <div class="roleListItem" v-for="item in roleList" v-bind:key="item.role_id">
                     <i class="el-icon-document-add"></i> <a :class="[{ selected: active === item.role_id }, 'xhx']" @click="getAuth(item.path, item.role_id)">{{item.role_name}}</a>
                 </div>
            </div>
            <div class="authList">
                 <div class="roletab">权限管理</div>
                 <el-tree
                    :data="authList"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :check-strictly="true"
                    :default-expand-all="true"
                    :props="defaultProps">
                    </el-tree>
                  <div class="sub"> 
                      <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
                  </div>    
            </div>
        </div>

        <el-dialog title="添加角色" :visible.sync="addRoleVisible">
                <el-form :model="form">
                    <el-form-item label="角色名称" label-width="120px">
                      <el-input  size="small" v-model="form.role_name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addRoleVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitRole">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template> 
<script>
import { getRoleList, getMenuList, getInfo, addRole, updateAuth } from '@/api/user';
export default {
    data(){
        return {
          form: {
            role_name: ''
          },
          active:'',
          addRoleVisible: false,
          roleList:[],
          authList: [],
          defaultKey:[],
          defaultProps: {
            children: 'children',
            label: 'label'
           }
        }
    },
 created() {
    // Mock: get all routes and roles list from server
     this.getUserRoleListFn();
     this.getMenuListFn(); //获取所有菜单
  },

  methods: {
      submitRole() {
        addRole({...this.form}).then(res=>{
          if(res.code == 1) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            this.getUserRoleListFn(); //更新角色列表
            this.addRoleVisible = false;
          }else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
          }

        })


      },
      formatSex: function(row, column) {
          return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
      },
      formatStatus: function(row, column) {
          return row.sex === 1 ? '正常' : '禁用'
      },
      getUserRoleListFn() {
          const self = this;
           getRoleList().then(res=>{
               if(res.code == 1){
                   self.roleList = res.data;
               }
           }) 
      },
      getMenuListFn() {
        const self = this;
        getMenuList().then(res=>{
          if(res.code == 1) {
            const authList = res.data.reduce((pre, next) =>{
                if(next.pid == 0) {
                  pre.push({
                      id: next.id,
                      label: next.name,
                  })
                }else{
                  let newpre = pre.filter(item=> item.id == next.pid);
                    if(newpre[0].children){
                      newpre[0].children.push({
                           id: next.id,
                        label: next.name,
                      })
                    }else{
                      newpre[0].children = [{
                        id: next.id,
                        label: next.name,
                      }]
                    }
                }
                return pre;
            },[]);
            self.authList = authList;
          }
        })
      },
      getAuth(path,idx) {
        const self = this;
        self.active = idx;
        if(path){
          getInfo({path}).then(res=>{
            if(res.code == 1){
              const keys = [];
              console.log(res)
              res.data.forEach(item=>{
                keys.push(item.id);
              })
              self.$refs.tree.setCheckedKeys(keys);
            }
          })
        }else {
          self.$refs.tree.setCheckedKeys([]);
        }
      },
      onSubmit() {
        const { active, roleList } = this;
        if(active!==''){
          const keys = this.$refs.tree.getCheckedKeys();
          updateAuth({role_id: active, path: keys }).then(res=>{
              if(res.code == 1){
                   this.$message({
                      message: "更新成功，请刷新页面",
                      type: 'success'
                  });
              }
          })
        }else{
            this.$message({
                message: "请选择要添加权限的角色",
                type: 'error'
            });
        }
      }
  }
}
</script>
<style lang="scss" scoped>
    @import url("./index.scss");

</style>