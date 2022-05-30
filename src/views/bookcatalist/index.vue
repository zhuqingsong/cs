<template>
    <div class="container" >
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="书籍编号">
                <el-input v-model="formInline.bookid" placeholder="请输入书籍编号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
             <el-form-item>
                <el-button type="primary"  @click="adddBooks">添加目录</el-button>
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
                prop="booktitle"
                label="目录标题">
                </el-table-column>
                 <el-table-column
                prop="createtime"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="bookurl"
                label="书籍地址">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                        <!-- <el-popconfirm
                            title="确认要关闭这家店嘛?"
                            @onConfirm="handleClick(scope.row)"
                        >
                            <el-button type="text" slot="reference" size="small">{{scope.row.mz_status == 1 ? '关闭': '启用'}}</el-button>
                        </el-popconfirm> -->
                    
                        <el-popconfirm
                            confirm-button-text='确认'
                            cancel-button-text='取消'
                            icon="el-icon-info"
                            icon-color="red"
                            @onConfirm="handleDelete(scope.row)"
                            title="这是一段内容确定删除吗？"
                            >
                            <el-button slot="reference" size="small">删除</el-button>
                        </el-popconfirm>
                         <el-link :href="'http://p.eyexing.com/'+ scope.row.bookurl" target="_blank">预览<i class="el-icon-view el-icon--right"></i> </el-link>
                </template>
                </el-table-column>
    </el-table>
     <div class="page"> <el-pagination  background :page-size="formInline.pagesize" @current-change="sizeChange" :total="total" layout="prev, pager, next"> </el-pagination></div>
    </div>
</template> 
<script>
import { postChildCataListPage, postDeleteChildCata } from '@/api/books';
export default {
    data(){
        return {
            tableData: [],
            formInline: {
                bookid: '',
                pagesize:10,
                page: 1
            },
            total: 1000
        }
    },
    computed: {


    },
    created() {
        this.getBooksChildCataList(); //获取
     },
     methods: {
        adddBooks() {
            this.$router.push({ path: '/admin/bookcata'})
        },
        sizeChange(page) {
            this.formInline.page = page;
            this.getBooksChildCataList(); //获取          
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
                self.getBooksChildCataList();
            })
        },
        handleDelete(row) {  //记录删除
            const self = this;
            postDeleteChildCata({id: row.id}).then(rs=>{
                if(rs.code == 1) {
                    self.$message({
                    message: "删除成功",
                    type: 'success'
                    });
                    self.getBooksChildCataList();
                }
            })  
            // this.$router.push({ path: '/map', query: row})
        },
        onSubmit() {
            this.getBooksChildCataList();
        },
         getBooksChildCataList(){
             const self = this;
             const params = { ...self.formInline }
             postChildCataListPage(params).then(res=>{
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