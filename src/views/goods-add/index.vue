<template>
     <div class="container">

        <div class="formwrap">
                <el-form :inline="true" :model="goods" size="mini" :rules="rules" ref="ruleForm">
                    <el-form-item label="商品分类" label-width="120px" prop="goods_cate_id" required>
                         <el-select v-model="goods.goods_cate_id" placeholder="请选择商品分类">
                                <el-option label="袋装" value="1"></el-option>
                                <el-option label="瓶装" value="2"></el-option>
                                <el-option label="散装" value="3"></el-option>
                                <el-option label="桶装" value="4"></el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称" label-width="100px" prop="goods_name" required>
                        <el-input  size="small" v-model="goods.goods_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" label-width="100px" prop="goods_price" required>
                        <el-input  size="small" v-model="goods.goods_price" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" label-width="100px" prop="goods_num" required>
                        <el-input  size="small" v-model="goods.goods_num" maxlength="11" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" label-width="100px" prop="goods_zl" required>
                        <el-input  size="small" v-model="goods.goods_zl"  autocomplete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="商品包装" label-width="120px" prop="goods_bz">
                         <el-select v-model="goods.mz_type" placeholder="请选择商品包装">
                                <el-option label="袋装" value="1"></el-option>
                                <el-option label="瓶装" value="2"></el-option>
                                <el-option label="散装" value="3"></el-option>
                                <el-option label="桶装" value="4"></el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item label="商品产地" label-width="100px" prop="goods_cd" required>
                        <el-input  size="small" v-model="goods.goods_cd" autocomplete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="商品图片" label-width="100px" prop="file">
                        <el-upload
                            action=""
                            class="upload-demo"
                            list-type="picture-card"
                            :file-list = "fileList"
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :auto-upload="false"
                            multiple
                            :limit="10"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,默认首图为主图</div>
                            </el-upload>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button @click="cancel">返回</el-button>
                    <el-button type="primary" @click="submitMz('ruleForm')">确 定</el-button>
                </div>
        </div>
    </div>
</template>

<script>
import { postAddStore } from '@/api/store';
let OSS = require('ali-oss');
export default {
 data() {
     const self = this;
  return {
        fileList: [],
        goods: {
            goods_cate_id: '',
            goods_name:'',
            goods_price: '',
            goods_num: '',
            goods_zl:"",
            goods_bz:'',
            goods_cd: ''
        },
        rules: {
            goods_cate_id: [
                { required: true, message: '请填写商品分类' }
            ],
            goods_name: [
                    { required: true, message: '请填写商品名称' }
            ],
            goods_price: [
                    { required: true, message: '请填写商品价格' }
            ],
            goods_num: [
                    { required: true, message: '请填写商品数量'}
            ],
            goods_zl: [
                { required: true, message: '请输入一个商品质量(如1KG,1L)' }
            ],
            goods_bz: [
                 { required: true, message: '请选择一个包装', targer: 'change' }
            ],
            goods_cd: [
                 { required: true, message: '请输入一个产地' }
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

 },
 methods: {


     handleChange(file, fileList) {
         console.log(fileList);
        this.fileList = fileList
      },
    handleRemove(file, fileList) {
        console.log(file, fileList);
         this.fileList = fileList
    },
     submitMz(formName) {
        const self = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {

                let client = new OSS({
                // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                region: 'oss-cn-beijing',
                // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                accessKeyId: 'LTAIHgW0V5GHJNvQ',
                accessKeySecret: 'Gm0CH9vDfQM35ni3Y8WhHRZ6SGvtsb',
                bucket: 'eyexing'
                });



                async function uploadFile(file) {
                    const result = await client.multipartUpload("goods/"+ file.name, file, {
                        headers: {
                            'Content-Disposition' : 'inline',
                            'Content-Type' : 'png'
                        }
                    })
                        const head = await client.head("goods/"+ file.name);
                        console.log(head);
                    
                        console.log(result);
                }




                

                // let params  = this.store;
                //     params.mz_addr = this.address;
                //     params.lat = this.lat;
                //     params.lng = this.lng;
               //  const file = this.ruleForm.file;

                    
                    console.log(params, 'fdsfdsfds')

                // postAddStore(params).then(res=>{
                //     if(res.code == 1) {
                //         self.$message({
                //             message: "添加成功",
                //             type: 'success'
                //         });
                //         history.go(-1)
                //     }else{
                //         self.$message({
                //             message: res.msg,
                //             type: 'error'
                //         });
                //     }
                // })
            } else {
                return false;
            }
            });
     },
     cancel() {
         history.go(-1);
     },
    searchMap() {
        let that = this;
        let address=this.address;
            var geocoder = new AMap.Geocoder({
                city: "", //城市设为北京，默认：“全国”
            });
          geocoder.getLocation(address, function(status, result) {
              if (status === 'complete'&&result.geocodes.length) {
                  var lnglat = result.geocodes[0].location;
                  that.center = [lnglat.lng,lnglat.lat]
                  that.lng =  lnglat.lng;
                  that.lat = lnglat.lat;
                  that.markers=[{
                    position:  that.center,
                  }]
              }else{
                  console.log('根据地址查询位置失败');
              }
          });
    },
    tijiao(){
        let data = {
          lng:this.lng,
          lat:this.lat
        };
         this.$emit('mapDing', data);
      },
       chaadd(e){
        let self = this;
        let {lng,lat} =  e;
        self.lng = lng;
        self.lat = lat;
        self.center = [self.lng,self.lat];
        self.loaded = true;
        self.markers=[{
          position:  self.center,
        }]
          var geocoder = new AMap.Geocoder({
              radius: 1000 //范围，默认：500
          });
          var marker = new AMap.Marker();
          function regeoCode() {
              var lnglat  = [lng,lat]
              geocoder.getAddress(lnglat, function(status, result) {
                  if (status === 'complete'&&result.regeocode) {
                      self.address = result.regeocode.formattedAddress;
                  }else{
                      console.log('根据经纬度查询地址失败')
                  }
              });
          }
          regeoCode();
      },


 }
}
</script>

<style>
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
