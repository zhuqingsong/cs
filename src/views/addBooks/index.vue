<template>
     <div class="container">

        <div class="formwrap">
                <el-form :inline="true" :model="books" size="mini" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="书籍分类" label-width="100px" prop="bookcate" required>
                                <el-select v-model="books.bookcate" placeholder="请选择书籍分类">
                                        <el-option  v-for="item in getBookCateList" :label="item.catename" :value="item.id" :key="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"> 
                            <el-form-item label="书籍名称" label-width="100px" prop="bookname" required>
                                <el-input  size="small" v-model="books.bookname" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10"> 
                            <el-form-item label="书籍编号" label-width="100px" prop="bookid" required>
                                <el-input  size="small" v-model="books.bookid" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14"> 
                                以书名首字母简称(例如: 四圣心源(ssxy_001) 同名加编号(ssxy_002)) </el-col>
                        <el-col :span="24">
                            <el-form-item label="作者" label-width="100px" prop="author" required>
                                    <el-input  size="small" v-model="books.author" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="时代" label-width="100px" prop="times" required>
                                    <el-input  size="small" v-model="books.times" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="书籍简介" label-width="100px" prop="bookinfo">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 5, maxRows: 10}"
                                placeholder="请输入书简介"
                                v-model="books.bookinfo">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-form-item label="书文件" label-width="100px" prop="file">
                        <el-upload
                            action=""
                            drag
                            class="upload-demo"
                            :on-change="uploadFile"
                            :auto-upload="false"
                            :limit="1"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">上传书本HMLT文件，且不超过5MB</div>
                            </el-upload>
                    </el-form-item>
                </el-form>
        </div>
        <div class="dialog-footer">
                <el-button @click="cancel">返回</el-button>
                <el-button type="primary" @click="submitMz('ruleForm')">确 定</el-button>
        </div>
    </div>
</template>

<script>
import { getBookCate, postAddBook, checkBookNameIsRepeat } from '@/api/books';
let OSS = require('ali-oss');
export default {
 data() {
     const self = this;
  return {
        file: "",
        getBookCateList: [],
        books: {
            bookcate: '',
            bookname:'',
            bookid: '',
            bookinfo: '',
            author: '',
            times: ''
        },
        rules: {
            bookcate: [
                { required: true, message: '选择书籍分类' }
            ],
            bookname: [
                    { required: true, message: '请填写书名' },
                    { validator: self.isRepeat, trigger: 'blur', message: '书籍名称有重复' }
            ],
            bookid: [
                    { required: true, message: '请填写书名编号' }
            ],
             author: [
                { required: true, message: '请输入作者' }
            ],
             times: [
                { required: true, message: '请输入时代' }
            ],
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
               console.log(rs, rs.data);
            if(rs.code == 1) {
                 self.getBookCateList = rs.data;
            }
           }) 
     },
     isRepeat(rule, value, callback) {
         checkBookNameIsRepeat({bookname: value}).then(rs=>{
             if(rs.code==1 && rs.data.length>0){
                callback(new Error());
             }else{
                 callback();
             }
         })
     },
     uploadFile(e) {
         console.log(e, 'eeeee');
         this.file = e;
     },
     submitMz(formName) {
        const self = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(!self.file){
                    self.$message({
                    message: "请上传书文件",
                    type: 'error'
                    })
                    return false;
                }
                let client = new OSS({
                // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                region: 'oss-cn-beijing',
                // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                accessKeyId: 'LTAIHgW0V5GHJNvQ',
                accessKeySecret: 'Gm0CH9vDfQM35ni3Y8WhHRZ6SGvtsb',
                bucket: 'eyexing'
                });
                const headers = {
                // 指定该Object被下载时网页的缓存行为。
               
                // 指定该Object被下载时的名称。
                // 'Content-Disposition': 'oss_download.txt', 
                // 指定该Object被下载时的内容编码格式。
                
                // 指定过期时间。
                // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT', 
                // 指定Object的存储类型。
                // 'x-oss-storage-class': 'Standard', 
                // 指定Object的访问权限。
                // 'x-oss-object-acl': 'private', 
                // 设置Object的标签，可同时设置多个标签。
                // 'x-oss-tagging': 'Tag1=1&Tag2=2', 
                // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
                // 'x-oss-forbid-overwrite': 'true', 
                };


                    const uploadFileFn =  async () =>{
                    const newFilename = this.books.bookid+'_'+(new Date().getTime()+'').substr(0,6);
                    console.log(newFilename, 'params')
                    const result =  client.multipartUpload("books/"+ newFilename+'.html', self.file.raw, {
                        headers: {
                            'Content-Disposition' : 'inline',
                            'Content-Type' : 'text/html',
                            'Content-Encoding': 'UTF-8',
                            'Cache-Control': 'no-cache'
                        }
                    })
                        // const head = await client.head("goods/"+ file.name);
                        // console.log(head);
                    
                        console.log(result);

                        result.then(rs=>{
                            if(rs.res.statusCode == 200){ 
                                const params = { ...self.books, bookurl: rs.name, bookid: newFilename};

                                postAddBook(params).then(resv=>{
                                    console.log(resv);
                                    if(resv.code == 1) {
                                        self.$message({
                                                message: "书籍添加成功",
                                            type: 'success'
                                            })
                                    }
                                })

                            }else{
                                self.$message({
                                    message: "上传文件失败",
                                type: 'error'
                                })
                            }

                            console.log(rs);
                        })


                    }

                    uploadFileFn();

            } else {
                return false;
            }
            });
     },
     cancel() {
         history.go(-1);
     }
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
