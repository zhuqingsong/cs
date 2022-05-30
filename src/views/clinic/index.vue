<template>
    <div class="container" >
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="诊所名称">
                <el-input v-model="formInline.mz_name" placeholder="诊所名称"></el-input>
            </el-form-item>
             <el-form-item label="手机号">
                <el-input v-model="formInline.mz_mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model="formInline.mz_create_user" placeholder="诊所创建人"></el-input>
            </el-form-item>
            <!-- <el-form-item label="门诊状态">
                <el-select v-model="formInline.mz_status" placeholder="请选择">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="关闭" value="2"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
             <el-form-item>
                <el-button type="primary"  @click="adddMz">添加诊所</el-button>
            </el-form-item>
        </el-form>
      <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="ID"
                width="50">
                </el-table-column>
                <el-table-column
                prop="mz_name"
                label="门诊名称"
                width="120">
                </el-table-column>
                <el-table-column
                prop="mz_doctor"
                label="门诊负责人"
                width="100">
                </el-table-column>
                 <el-table-column
                prop="mz_mobile"
                label="门诊手机号"
                width="120">
                </el-table-column>
                <el-table-column
                prop="mz_create_user"
                width="100"
                label="创建人"
                >
                </el-table-column>
                <el-table-column
                prop="mz_addr"
                label="门诊地址"
                >
                </el-table-column>
                <el-table-column
                prop="mz_create_time"
                label="创建时间"
                >
                </el-table-column>
                <el-table-column
                prop="mz_status"
                label="门店状态"
                :formatter="formatSt"
                 >
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                        <el-popconfirm
                            title="确认要关闭这家店嘛?"
                            @onConfirm="handleClick(scope.row)"
                        >
                            <el-button type="text" slot="reference" size="small">{{scope.row.mz_status == 1 ? '关闭': '启用'}}</el-button>
                        </el-popconfirm>
                    
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                </template>
                </el-table-column>
    </el-table>
     <div class="page"> <el-pagination  background :page-size="formInline.page_size" @current-change="sizeChange" :total="total" layout="prev, pager, next"> </el-pagination></div>
    </div>
</template> 
<script>
import { getCustomerList, postCloseStore } from '@/api/store';
const stv = ['','正常','关门','歇业','其它'];
export default {
    data(){
        return {
            tableData: [],
            formInline: {
                mz_name: '',
                mz_mobile: '',
                mz_create_user: '',
                page: 1,
                page_size: 20
            },
            total: 1000
        }
    },
    computed: {


    },
    created() {
        this.getCustomerList(); //获取
     },
     methods: {
        formatSt: function(row, column) {
          return row.mz_status === 1 ? '正常' : '关闭'
        },
        adddMz() {
            this.$router.push({ path: '/map', })
        },
        sizeChange(page) {
            this.formInline.page = page;
            this.getCustomerList(); //获取          
        },
        handleClick(row) {
            const self = this;
            postCloseStore({
                id: row.id,
                mz_status: row.mz_status == 1 ? 2 : 1
            }).then(res=>{
                self.$message({
                    message: "修改成功",
                    type: 'success'
                });
                self.getCustomerList();
            })
        },
        handleEdit(row) {
            this.$router.push({ path: '/map', query: row})
        },
        onSubmit() {
            this.getCustomerList();
        },
         getCustomerList(){
             const self = this;
             const params = { ...self.formInline }
             getCustomerList(params).then(res=>{
                 if(res.code == 1){
                     self.tableData = res.data.list
                     self.total = res.data.total
                 }
            })
         }
     }
}
</script>
<style lang="scss">
    @import url("./index.less");
</style>