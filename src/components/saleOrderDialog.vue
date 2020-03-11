<template>
  <!-- 销售订单详情 -->
  <el-dialog title="订单详情" :visible.sync="open" width="80%" @close="handleClose">
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
              <td>{{ item.id }}</td>
            </tr>
            <tr>
              <td>订单状态</td>
              <td>{{ item.statusName }}</td>
            </tr>
            <tr>
              <td>生成时间</td>
              <td>{{ item.createdAt }}</td>
            </tr>
            <tr>
              <td>订单总金额</td>
              <td>￥{{ item.amount }}</td>
            </tr>
            <tr>
              <td>客户名称</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>{{ item.contacts }}</td>
            </tr>
            <tr>
              <td>联系方式</td>
              <td>{{ item.phone }}</td>
            </tr>
            <tr>
              <td>所属业务员</td>
              <td>{{ item.saleMan }}</td>
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
              <td>预计交货时间</td>
              <td>{{ item.deliveryAt }}</td>
            </tr>
            <tr>
              <td>要求到仓时间</td>
              <td>{{ item.deliveryAt }}</td>
            </tr>
            <tr>
              <td>送货日期</td>
              <td>{{ item.shipmentAt }}</td>
            </tr>
            <tr>
              <td>运输成本</td>
              <td>{{ item.shipmentCost }}元</td>
            </tr>
            <tr>
              <td>车牌信息</td>
              <td>{{ item.carLicensePlate }}</td>
            </tr>
            <tr>
              <td>司机姓名</td>
              <td>{{ item.driverName }}</td>
            </tr>
            <tr>
              <td>司机联系方式</td>
              <td>{{ item.driverContsct }}</td>
            </tr>
            <tr>
              <td>驾驶证</td>
              <td>{{ item.driverLicense }}</td>
            </tr>
            <tr>
              <td>行驶证</td>
              <td>{{ item.carLicense }}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
      <el-col :span="8">
        <h4>验收证明</h4>
        <el-image
          style="width: 100px; height: 100px"
          :src="item.acceptancePic"
          :preview-src-list="[item.acceptancePic]"
        ></el-image>
      </el-col>
    </el-row>

    <h4>订单内容</h4>
    <el-table border :data="lines" show-summary>
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="货物名称" align="center" prop="productName" />
      <el-table-column label="品类" align="center" prop="categoryName" />
      <el-table-column label="数量" align="center" prop="qty" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="参考单价" align="center" prop="price" />
      <el-table-column label="总价" align="center" prop="amount" />
      <el-table-column label="需求等级" align="center" prop="id" />
    </el-table>
  </el-dialog>
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
export default {
    props: ['item', 'lines', 'visible'],
    data() {
      return {
        open: false
      }
    },
    watch: {
      visible(val) {
        this.open = val
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      }
    }
};
</script>