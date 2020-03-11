<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="供应商ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入供应商ID"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="farmName">
        <el-input
          v-model="queryParams.farmName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供货种类" prop="categoryName">
        <el-cascader
        v-model="categoryIds"
        :props="{ checkStrictly: true }"
        :options="categoryTreeselects"
        :show-all-levels="false"
        clearable></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="farmList">
      <el-table-column label="供应商ID" align="center" prop="id" width="100"/>
      <el-table-column label="供应商名称" align="center" prop="farmName"/>
      <el-table-column label="供货种类" align="center" prop="categoryNames" width="300"/>
      <el-table-column label="联系人" align="center" prop="contacts"  width="100" />
      <el-table-column label="联系方式" align="center" prop="phone" width="120" />
      <el-table-column label="地址" align="center"  prop="address"/>
      <el-table-column label="所属业务员" align="center" prop="purchaserName" width="100"/>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="getInfoById(scope.row.id)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 供应商信息明细 -->
    <el-dialog title="供应商信息明细" :visible.sync="open" width="80%">
      <el-row>
        <el-col :span="12">
          <h4>基本信息</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:400px;"
          >
            <tbody>
              <tr>
                <td>供应商ID</td>
                <td>{{ farmBaseInfo.id }}</td>
              </tr>
              <tr>
                <td>供货种类</td>
                <td>
                  <span v-if="categories[0]">
                    <span v-for='item in categories' :key="item.id">{{item.name}}&nbsp;</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>预计收成月份</td>
                <td>{{ farmBaseInfo.harvestMonth }}</td>
              </tr>
              <tr>
                <td>联系人</td>
                <td>{{ farmBaseInfo.contacts }}</td>
              </tr>
              <tr>
                <td>联系方式</td>
                <td>{{ farmBaseInfo.phone }}</td>
              </tr>
              <tr>
                <td>地址</td>
                <td>{{ farmBaseInfo.province + farmBaseInfo.city + farmBaseInfo.address }}</td>
              </tr>
              <tr>
                <td>种植/生产面积</td>
                <td>{{ farmBaseInfo.area }}</td>
              </tr>
              <tr>
                <td>所属业务员</td>
                <td>{{ farmBaseInfo.purchaserName }}</td>
              </tr>
              <tr>
                <td>标记等级</td>
                <td>{{farmBaseInfo.level}}
                  <el-form :model="farmBaseInfo"
                        :rules="rules"
                        ref="farmFrom"
                        size="small">
                      <el-form-item style="display:flex;">
                        <el-select v-model="farmBaseInfo.level" v-show="!btnDisabled">
                          <el-option v-for="item in levelList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                          </el-option>
                        </el-select>
                        <el-button type="primary" size="small" @click="onSubmit('farmFrom')" v-show="!btnDisabled">提交</el-button>
                        <el-button type="primary" size="small" @click="changeBtn" v-show="btnDisabled">更改</el-button>
                      </el-form-item>
                  </el-form>
                </td>
              </tr>
              <tr>
                <td>供应商类型</td>
                <td>{{ farmBaseInfo.type }}</td>
              </tr>
              <tr>
                <td>营业资质证明（营业执照）</td>
                <td>
                  <el-image
                    :key="farmBaseInfo.licensePic"
                    style="width: 80px;margin-right:10px;"
                    :src="farmBaseInfo.licensePic"
                    fit="contain"
                    :preview-src-list="[farmBaseInfo.licensePic]"
                  ></el-image>
                </td>
              </tr>
              <tr>
                <td>营业证明ID（社会统一信用代码）</td>
                <td>{{ farmBaseInfo.licenseId }}</td>
              </tr>
              <tr>
                <td>法人身份证号码</td>
                <td>{{ farmBaseInfo.legalIdNumber }}</td>
              </tr>
              <tr>
                <td>法人身份证</td>
                <td>
                  <span v-if="farmBaseInfo.legalIdPic">
                    <el-image
                      v-for="pic in farmBaseInfo.legalIdPic.split(',')"
                      :key="pic"
                      style="width: 80px;margin-right:10px;"
                      :src="pic"
                      fit="contain"
                      :preview-src-list="[pic]"
                    ></el-image>
                  </span>
                </td>
              </tr>
              <tr>
                <td>法人联系方式</td>
                <td>{{ farmBaseInfo.legalPhone }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="12">
          <h4>结算信息</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:400px;"
          >
            <tbody>
              <tr>
                <td>银行卡户名</td>
                <td>{{ farmBaseInfo.bankAccountName }}</td>
              </tr>
              <tr>
                <td>账号</td>
                <td>{{ farmBaseInfo.bankAccount }}</td>
              </tr>
              <tr>
                <td>开户银行</td>
                <td>{{ farmBaseInfo.bank }}</td>
              </tr>
            </tbody>
          </table>

          <h4>备注说明</h4>
          <el-input type="textarea" v-model="farmBaseInfo.memo" :disabled="true"></el-input>
          <h4>供货计划</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:400px;"
          >
            <tbody>
              <tr>
                <td>预计下次收成时间</td>
                <td>{{ farmSupplyPlan.harvestDate }}</td>
              </tr>
              <tr>
                <td>预计产量</td>
                <td>{{ farmSupplyPlan.yield }}</td>
              </tr>
              <tr>
                <td>品类</td>
                <td>{{ farmSupplyPlan.categoryName }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>

      <h4>供货列表</h4>
      <el-table border :data="productList">
        <el-table-column label="货物ID" align="center" prop="id" />
        <el-table-column label="货物名称" align="center" prop="name" />
        <el-table-column label="品类" align="center" prop="categoryName" />
        <el-table-column label="货物资质证明" align="center" >
          <template slot-scope="scope" v-if="scope.row.certificatePic[0]">
            <el-image
              v-for="pic in scope.row.certificatePic"
              :key="pic"
              style="width: 40px;margin-right:10px;"
              :src="pic"
              fit="contain"
              :preview-src-list="[pic]"
            ></el-image>
          </template>        
        </el-table-column>
        <el-table-column label="货物图片" align="center" >
          <template slot-scope="scope" v-if="scope.row.pic[0]">
            <el-image
              v-for="pic in scope.row.pic"
              :key="pic"
              style="width: 40px;margin-right:10px;"
              :src="pic"
              fit="contain"
              :preview-src-list="[pic]"
            ></el-image>
          </template>           
        </el-table-column>
      </el-table>

      <h4>最近采购订单</h4>
      <el-table border :data="latestOrders">
        <el-table-column label="时间" align="center" prop="createAt" />
        <el-table-column label="数量" align="center" prop="qty" />
        <el-table-column label="参考单价" align="center" prop="referPrice" />
        <el-table-column label="采购单价" align="center" prop="price" />
        <el-table-column label="总价" align="center" prop="amount" />
        <el-table-column label="对比参考价" align="center">
          <template slot-scope="scope" v-if="scope.row.referPrice">
            <span style='color:red'>
              <span v-if="scope.row.referPrice > scope.row.price">-</span>
              <span v-if="scope.row.referPrice < scope.row.price">+</span>
              {{((scope.row.price - scope.row.referPrice)/scope.row.referPrice).toFixed(2)*100}}%
            </span>
          </template>           
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 30px 30px 30px;
  min-height: 100%;
}
/deep/ .el-table {
  td {
    text-align: center;
  }
}
</style>

<script>
import { listFarm, getFarm, getFarmSupplyPlan, addFarmLevel } from "@/api/manager/farm";
import { treeListCategory,getCategoriesByFarmId } from "@/api/manager/category";
import product from "@/api/manager/product";
import { listPurchaseOrder } from "@/api/manager/purchaseOrder";

export default {
  name: "Farm",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 供货商列表数据
      farmList: [],
      // 是否显示弹出层
      open: false,
      // 供货商信息
      farmBaseInfo: {},
      categories: [],
      // 供货计划
      farmSupplyPlan: {'harvestDate':'','yield':'','categoryName':''},
      // 供货列表
      productList: [],
      // 最近采购订单
      latestOrders: [],
      // 供货种类下拉树列表
      categoryTreeselects: [],
      categoryIds: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        farmName: undefined,
        categoryName: undefined
      },
      levelList:[{
              id:'甲',
              name:'甲'
          },{
              id:'乙',
              name:'乙'
          },{
              id:'丙',
              name:'丙'
      }],
      rules: {
          level: [
              { required: true, message: '请选择等级', trigger: 'change' }
          ],
      },
      btnDisabled:false,
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
  },
  methods: {
    /** 查询供货商列表 */
    getList() {
      this.loading = true;
      listFarm(this.queryParams).then(
        response => {
          this.farmList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询供货种类下拉树列表 */
    getCategoryList() {
      treeListCategory().then(
        response => {
          this.categoryTreeselects = response.data;
        }
      );
    },
    /** 获得农场的供货列表 */
    getProductList(farmId) {
      this.productList = [];
      product.list({farmId:farmId}).then(response => {
        response.rows.forEach(item => {
          item.pic = item.pic ? item.pic.split(",") : [];        
          item.certificatePic = item.certificatePic ? item.certificatePic.split(","): [];
          this.productList.push(item);     
        })
      });
    },
    /** 获得农场的最近采购订单列表 */
    getPurchaseOrderList(farmId) {
      listPurchaseOrder({farmId:farmId,pageNum:1,pageSize:10}).then(response => {
        this.latestOrders = response.rows;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.categoryName = this.categoryIds[0];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查询销售订单详情*/
    getInfoById(id) {
        this.open = true;
        getFarm(id).then(
            response => {
            this.farmBaseInfo = response.data.farm;
            this.farmBaseInfo.purchaserName = response.data.purchaserName;
            if(this.farmBaseInfo.level) {
              this.btnDisabled=!this.btnDisabled;
            }
            }
        );
        getCategoriesByFarmId(id).then(
          response => {
            this.categories = response.data;
            }
        );
        getFarmSupplyPlan(id).then(
          response => {
              if(response.data.length > 0) {
                this.farmSupplyPlan = response.data[0];
              }
            }
        );
        this.getProductList(id);
        this.getPurchaseOrderList(id);
    },
    changeBtn(){
          this.btnDisabled=!this.btnDisabled;
    },
    onSubmit(formName) {
      if( !this.farmBaseInfo.level){
          this.$message({
              message: '请选择等级',
              type: 'warning',
              duration:1000
          });
          return;
      }
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$confirm('是否提交数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = {'id':this.farmBaseInfo.id,'level':this.farmBaseInfo.level}
                    addFarmLevel(params).then(response=>{
                        this.changeBtn();
                        this.$refs[formName].resetFields();
                        this.$message({
                            message: '提交成功',
                            type: 'success',
                            duration:1000
                        });
                    });
                });
            } else {
                this.$message({
                    message: '验证失败',
                    type: 'error',
                    duration:1000
                });
                return false;
            }
        });
    },
  }
};
</script>