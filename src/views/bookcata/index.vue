<template>
     <div class="container">

        <div class="formwrap">
            <div class="fromleft">
                <el-form :inline="true" :model="books" size="mini" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="书籍分类" label-width="100px" prop="bookcate"required >
                                <el-select v-model="books.bookcate" placeholder="请选择书籍分类" @change="getBookName">
                                        <el-option  v-for="item in getBookCateList" :label="item.catename" :value="item.id" :key="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"> 
                            <el-form-item label="选择书籍" label-width="100px" prop="bookid" required>
                                <el-select v-model="books.bookid" placeholder="请选择书籍分类" @change="getBookChildCata">
                                        <el-option  v-for="item in getBookNameList" :label="item.bookname" :value="item.bookid" :key="item.bookid" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"> 
                            <el-form-item label="父级目录" label-width="100px" prop="parentid" required>
                                <el-select v-model="books.parentid" placeholder="请选择父级目录">
                                        <el-option  v-for="item in getBookChildCataList" :label="item.booktitle" :value="item.id" :key="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"> 
                            <el-form-item label="目录标题" label-width="100px" prop="booktitle" required>
                                <el-input  size="small" v-model="books.booktitle" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"> 
                            <el-form-item label="结束标题" label-width="100px" prop="endtitle">
                                <el-input  size="small" v-model="books.endtitle" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="dialog-footer">
                    <el-button @click="scHtml('ruleForm')">生成HTML</el-button>
                    <el-button type="primary" @click="submitMz('ruleForm')">确 定</el-button>
                </div>
        </div>
        <div class="formright" v-html="htmlview">  </div>
        </div>
        
    </div>
</template>

<script>
import { getBookCate, postBookNameList, postBookChildCataList, postSplitBookAct, postAddChildBook } from '@/api/books';

export default {
 data() {
     const self = this;
  return {
        file: "",
        htmlview: "",
        getBookCateList: [],
        getBookNameList: [],
        getBookChildCataList: [],
        books: {
            parentid: 0,
            bookid: '',
            bookname: '',
            booktitle:'',
            endtitle: ''
        },
        rules: {
            booktitle: [
                { required: true, message: '输入目录标题' }
            ],
            bookid: [
                    { required: true, message: '请填写书名编号' }
            ],
            bookcate: [
                { required: true, message: '请输入书籍分类' }
            ]
        },
  }
 },
 components: {

 },
 created() { 
    const { query } = this.$route
    if(query.mz_addr){
        this.$nextTick(()=>{
            
        })
    }

    this.getBooksCate();

 },
 methods: {

     getBooksCate() {
         const self = this;
           getBookCate().then(rs=>{
            if(rs.code == 1) {
                 self.getBookCateList = rs.data;
            }
           }) 
     },
     getBookName(e) {
         const self = this;
         postBookNameList({bookcate: e}).then(rs=>{
             console.log(rs);
             if(rs.code==1) {
                 self.getBookNameList = rs.data;
             }
         })
     },
     getBookChildCata(e) {
         const self = this;
         const books = self.getBookNameList.filter(item=> item.bookid == e);
         console.log(books, 'bookssss');
         postBookChildCataList({bookid: e}).then(rs=>{
             self.books.bookname = books[0].bookname || '';
             if(rs.code==1) {
                 self.getBookChildCataList = [{id:0, booktitle: "无父级"}].concat(rs.data);
             }
         })
     },
     scHtml(formName) {
         const self = this;
         this.$refs[formName].validate((valid) => { 

             if (valid) { 
                 const { bookid, booktitle, endtitle } = self.books;
                   postSplitBookAct({bookid: bookid, booktitle, endtitle}).then(rs=>{
                       if(rs.code==1){
                           self.htmlview = rs.data;
                       }
                   })

             }
         })
     },
     submitMz(formName) {
        const self = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                postAddChildBook({...this.books, htmlview: this.htmlview}).then(rs=> {
                    console.log(rs);
                    if(rs.code == 1) {
                       self.$message({
                            message: "目录添加成功",
                            type: 'success'
                        }) 
                    }   
                })

            } else {
                return false;
            }
            });
     },
 }
}
</script>

<style scoped>
@import url(./index.less);
    .amap-page-container{
        height: 400px;
        padding-top: 20px;
        padding:20px;
    }
    .inpu{
        width: calc(100% - 120px);
        margin-right: 20px;
        margin-bottom: 20px;
        margin-left: 20px;
    }
    .wan{
        margin-top: 20px;
    }
    .dialog-footer{ text-align:  center; margin-top:  30px;}

</style>
