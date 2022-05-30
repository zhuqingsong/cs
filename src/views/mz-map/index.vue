<template>
     <div class="container">
             <div class="amap-page-container">

                    <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :zoom="zoom" :events='events'>
                    <!-- 点击显示标记 -->
                    <el-amap-marker v-for="(marker, index) in markers" :key="marker.index" :position="marker.position"
                            :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible"
                            :draggable="marker.draggable" :vid="index"></el-amap-marker>
                    </el-amap>
                    <!-- <div class="dis-tan ju-cen">
                    <el-button type="primary" @click="tijiao" class="wan">完成</el-button>
                    </div> -->
        </div>
         <div> 
                 <el-input
                    class="inpu"
                        placeholder="请输入你要定位的地址"
                        v-model="address">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" @click="searchMap()">定位</el-button>
         </div>
        <div class="formwrap">
                <el-form :inline="true" :model="store" size="mini" :rules="rules" ref="ruleForm">
                    <el-form-item label="诊所名称" label-width="100px" prop="mz_name" required>
                        <el-input  size="small" v-model="store.mz_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="诊所负责人" label-width="100px" prop="mz_doctor" required>
                        <el-input  size="small" v-model="store.mz_doctor" autocomplete="off"></el-input>
                    </el-form-item>
                        <el-form-item label="负责人电话" label-width="100px" prop="mz_mobile" required>
                        <el-input  size="small" v-model="store.mz_mobile" maxlength="11" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="门诊类型" label-width="120px" prop="mz_type">
                         <el-select v-model="store.mz_type" placeholder="请选择门诊类型">
                                <el-option label="中医门诊" value="1"></el-option>
                                <el-option label="中西医结合" value="2"></el-option>
                                <el-option label="其它" value="3"></el-option>
                         </el-select>
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
export default {
 data() {
     const self = this;
  return {
        store: {
            mz_name:'',
            mz_doctor: '',
            mz_mobile: '',
            mz_type:"1"
        },
        rules: {
            mz_name: [
                    { required: true, message: '请填写诊所名', trigger: 'change' }
            ],
            mz_doctor: [
                    { required: true, message: '请填写负责人', trigger: 'change' }
            ],
            mz_mobile: [
                    { required: true, message: '请填写负责人电话', trigger: 'change' }
            ],

            role: [
                { required: true, message: '请至少选择一个角色', trigger: 'change' }
            ],

        },

        //从这里下去是地图有关的
        address: '',  //获取的位置
        zoom: 13,  // 地图缩放
        center: [114.166239, 30.413077],  // 初始中心
        lng: '',  //经纬度
        lat: '',
        loaded: false,
        // 点击显示的标记默认的定位
        markers: [],
        //  自动定位到当前位置
        plugin: [{
         timeout: 1000, //超过10秒后停止定位，默认：无穷大
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.address = self.address ? self.address : result.formattedAddress;
                  self.lng = self.lng ? self.lng : result.position.lng;
                  self.lat = self.lat ? self.lat : result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.markers=[{
                    position:  self.center,
                  }]
                  self.loaded = true;
                  self.$nextTick();
                }
                else{
                  o.getCityInfo((status, result) => {
                    if (result && result.center) {
                      self.address = result.formattedAddress;
                      self.lng = result.center[0];
                      self.lat = result.center[1];
                      self.center = result.center;
                      self.markers=[{
                        position:  self.center,
                      }]
                      self.loaded = true;
                      self.$nextTick();
                    }
                  });
                }
              });
            }
          }
        }],
        // 点击地图获取当前位置并显示标记
        events: {
          click(e) {
            self.chaadd(e.lnglat)
          }
        }

  }
 },
 components: {

 },
 created() { 
    const { query } = this.$route
    if(query.mz_addr){
        this.$nextTick(()=>{
            this.address = query.mz_addr;
            this.lng = query.lng;
            this.lat = query.lat;
            this.center = [query.lng, query.lat];
            this.store = {
                mz_name: query.mz_name,
                mz_doctor: query.mz_doctor,
                mz_mobile: query.mz_mobile,
                mz_type: query.mz_type
            }
        })
        
    }

 },
 methods: {
     submitMz(formName) {
        const self = this;
        if(this.address) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let params  = this.store;
                    params.mz_addr = this.address;
                    params.lat = this.lat;
                    params.lng = this.lng;
                postAddStore(params).then(res=>{
                    if(res.code == 1) {
                        self.$message({
                            message: "添加成功",
                            type: 'success'
                        });
                        history.go(-1)
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
        }else{
            self.$message({
                message: "地址必填",
                type: 'error'
            });
        }
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
