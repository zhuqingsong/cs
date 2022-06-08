<template>
    <div class="container" >
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="书籍名称1">
                <el-input v-model="formInline.bookname" placeholder="请输入书籍名称"></el-input>
            </el-form-item>
             <!-- <el-form-item label="手机号">
                <el-input v-model="formInline.mz_mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model="formInline.mz_create_user" placeholder="诊所创建人"></el-input>
            </el-form-item> -->
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
                <el-button type="primary"  @click="adddBooks">添加书籍</el-button>
            </el-form-item>
        </el-form>
      <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="bookid"
                label="书籍编号">
                </el-table-column>
                <el-table-column
                prop="bookname"
                label="书籍名称">
                </el-table-column>
                <el-table-column
                prop="bookcate"
                label="书籍目录编号">
                </el-table-column>
                 <el-table-column
                prop="createtime"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="createuser"
                label="创建人">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                        <el-popconfirm
                            title="确认要删除该书籍嘛? 书籍目录将一起删除!"
                            @onConfirm="handleDeleteBook(scope.row)"
                        >
                            <el-button type="text" slot="reference" size="small">删除</el-button>
                        </el-popconfirm>
                    
                    <!-- <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button> -->
                </template>
                </el-table-column>
    </el-table>
     <div class="page"> <el-pagination  background :page-size="formInline.pagesize" @current-change="sizeChange" :total="total" layout="prev, pager, next"> </el-pagination></div>
    </div>
</template> 
<script>
import { postBookList, postDeleteBook } from '@/api/books';
const stv = ['','正常','关门','歇业','其它'];
export default {
    data(){
        return {
            tableData: [],
            formInline: {
                bookid: '',
                page: 1,
                pagesize: 10
            },
            total: 1000
        }
    },
    computed: {


    },
    created() {
        this.getBooksList(); //获取
     },
     methods: {
        formatSt: function(row, column) {
          return row.mz_status === 1 ? '正常' : '关闭'
        },
        adddBooks() {
            console.log("eeeebbb");
            this.$router.push({ path: '/admin/addBooks', })
        },
        sizeChange(page) {
            this.formInline.page = page;
            this.getBooksList(); //获取          
        },
        handleDeleteBook(row) {
            const self = this;
            postDeleteBook({
                bookid: row.bookid,

            }).then(res=>{
                self.$message({
                    message: "删除成功",
                    type: 'success'
                });
                self.getBooksList();
            })
        },
        handleEdit(row) {
            this.$router.push({ path: '/map', query: row})
        },
        onSubmit() {
            this.getBooksList();
        },
         getBooksList(){
             const self = this;
             const params = { ...self.formInline }
             postBookList(params).then(res=>{
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