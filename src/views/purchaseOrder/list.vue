<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="订单编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    
      <el-form-item label="订单状态" prop="status">
       <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="item in orderStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="purchaseOrderList">
      <el-table-column label="订单编号"  prop="id" />
      <el-table-column label="订单生成时间" prop="createAt"/>
      <el-table-column label="订单总金额" align="center" prop="amount" width="120"/>
      <el-table-column label="供应商名称" align="center" prop="farmName"  width="180" />
      <el-table-column label="联系人" align="center" prop="contacts"  width="150" />
      <el-table-column label="联系方式" align="center" prop="phone"  width="150" />
      <el-table-column label="所属业务员" align="center" prop="purchaserName"  width="150" />
      <el-table-column label="订单状态" align="center" prop="status" width="100" :formatter="getStatusName"/>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="getInfoById(scope.row.id)"
            v-hasPermi="['system:role:find']"
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

    <!-- 销售订单详情 -->
    <el-dialog title="订单详情" :visible.sync="open" width="80%">
      <el-row>
        <el-col :span="8">
          <h4>基本信息</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:280px;"
          >
            <tbody>
              <tr>
                <td>订单编号</td>
                <td>{{ orderBaseInfo.id }}</td>
              </tr>
              <tr>
                <td>订单状态</td>
                <td>{{ orderBaseInfo.statusName }}</td>
              </tr>
              <tr>
                <td>生成时间</td>
                <td>{{ orderBaseInfo.createdAt }}</td>
              </tr>
              <tr>
                <td>订单总金额</td>
                <td>￥{{ orderBaseInfo.amount }}</td>
              </tr>
              <tr>
                <td>所属业务员</td>
                <td>{{ orderBaseInfo.saleMan }}</td>
              </tr>
              <tr>
                <td>供应商名称</td>
                <td>{{ orderBaseInfo.farmName }}</td>
              </tr>
              <tr>
                <td>联系人</td>
                <td>{{ orderBaseInfo.contacts }}</td>
              </tr>
              <tr>
                <td>联系方式</td>
                <td>{{ orderBaseInfo.phone }}</td>
              </tr>
              <tr>
                <td>要求交货时间</td>
                <td>{{ orderBaseInfo.deliveryAt }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="8">
          <h4>交货&物流信息</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:280px;"
          >
            <tbody>
              <tr>
                <td>预计提货时间</td>
                <td>{{ orderBaseInfo.deliveryAt }}</td>
              </tr>
              <tr>
                <td>提货日期</td>
                <td>{{ orderBaseInfo.shipmentAt }}</td>
              </tr>
              <tr>
                <td>运输成本</td>
                <td>{{ orderBaseInfo.shipmentCost }}元</td>
              </tr>
              <tr>
                <td>车牌信息</td>
                <td>{{ orderBaseInfo.carLicensePlate }}</td>
              </tr>
              <tr>
                <td>司机姓名</td>
                <td>{{ orderBaseInfo.driverName }}</td>
              </tr>
              <tr>
                <td>司机联系方式</td>
                <td>{{ orderBaseInfo.driverContsct }}</td>
              </tr>
              <tr>
                <td>驾驶证</td>
                <td>{{ orderBaseInfo.driverLicense }}</td>
              </tr>
              <tr>
                <td>行驶证</td>
                <td>{{ orderBaseInfo.carLicense }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="8">
          <h4>验收证明</h4>
            <el-image 
                v-if="orderBaseInfo.acceptancePic"
                style="width: 100px; height: 100px"
                :src="orderBaseInfo.acceptancePic" 
                :preview-src-list="[orderBaseInfo.acceptancePic]">
            </el-image>
        </el-col>
      </el-row>

      <h4>订单内容</h4>
      <el-table border :data="orderContent" show-summary :span-method="arraySpanMethod">
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column label="货物ID" align="center" prop="id" />
        <el-table-column label="货物名称" align="center" prop="productName" />
        <el-table-column label="品类" align="center" prop="categoryName" />
        <el-table-column label="数量" align="center" prop="qty" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="参考单价" align="center" prop="price" />
        <el-table-column label="采购单价" align="center" prop="price" />
        <el-table-column label="采购总价" align="center" prop="amount" />
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
import { listPurchaseOrder, getPurchaseOrder, getStatistics } from "@/api/manager/purchaseOrder";

export default {
  name: "PurchaseOrder",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 销售订单列表数据
      purchaseOrderList: [],
      // 是否显示弹出层
      open: false,
      // 订单信息
      orderBaseInfo: {},
      // 订单内容
      orderContent: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        customerName: undefined,
        status: undefined
      },
      orderStatusList: [{
          value: '0',
          label: '待报价'
        }, {
          value: '1',
          label: '议价'
        }, {
          value: '3',
          label: '待提货'
        }, {
          value: '4',
          label: '报价待审核'
        }, {
          value: '5',
          label: '取消'
        }, {
          value: '8',
          label: '已完成'
        }]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售订单列表 */
    getList() {
      this.loading = true;
      listPurchaseOrder(this.queryParams).then(
        response => {
          this.purchaseOrderList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
        getPurchaseOrder(id).then(
            response => {
            this.orderBaseInfo = response.data.base;
            this.orderContent = response.data.content;
            }
        );
    },
    /** 获得状态的名称 */
    getStatusName(row) {
        var orderStatus = this.orderStatusList.find(
            orderStatus => orderStatus.value == row.status
        );
        return orderStatus.label;
    }
  }
};
</script>