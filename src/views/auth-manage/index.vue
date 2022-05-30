<template>
    <div class="container" >
        <div class="roleWrap">
            <div class="roleList">
                <div class="roletab">权限列表 <el-button size="mini" style="padding:0" type="text" @click="addNode(0)">添加根节点</el-button></div>
                 <el-tree
                    :data="authList"
                    node-key="id"
                    ref="tree"
                    :check-strictly="true"
                    :default-expand-all="true"
                    :render-content="renderContent"
                    :props="defaultProps">
                    </el-tree>
            </div>

            <div class="addRole">
                    <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="父节点" prop="pid">
                            <el-input v-model="ruleForm.pid" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="菜单路径" prop="path">
                            <el-input v-model="ruleForm.path"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        </el-form-item>
                    </el-form>
            </div>
        </div>

    </div>      
</template>
    
    <script>
    import { getMenuList, addUserMenu} from '@/api/user';
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    pid: '',
                    path: ''
                },
                authList: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                rules: {
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    ],
                    pid: [
                        { required: true, message: '请选择父级菜单', trigger: 'blur' },
                    ],
                    path: [
                        { required: true, message: '请输入路径', trigger: 'blur' },
                    ]
                }
            }
        },
         created() {
            // Mock: get all routes and roles list from server
            this.getMenuListFn(); //获取所有菜单
        },
        methods: {
        renderContent(h, { node, data, store }) {
            console.log(node.id, data)
            if(data.pid == 0){
             return (
                <div class="customtreenode">
                    <span class="fs12">{data.label}</span>
                   <el-button size="mini" style="padding:0" type="text" on-click={ () => this.append(data) }>添加子节点</el-button>
                </div>)
            }else{
               return ( <div class="customtreenode">
                            <span class="fs12">{data.label}</span>
                    </div>)
            }
        },
        append(data) {
            this.ruleForm.pid = data.id;
        },
        addNode(pid){
            this.ruleForm.pid = pid;
        },
        onSubmit() {
            const self = this;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                   addUserMenu({...this.ruleForm}).then(res=>{
                       if(res.code == 1) {
                           self.$message({
                                message: "添加成功",
                                type: 'error'
                            });
                           self.ruleForm = { ...this.ruleForm, name: '', path: ''};
                           self.getMenuListFn(); //获取所有菜单
                       }else{
                            self.$message({
                                message: res.msg,
                                type: 'error'
                            });
                       }

                   })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
                      pid: next.pid
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


        }
    }
    </script>
<style lang="scss" scoped>
    @import url("./index.scss");
</style>