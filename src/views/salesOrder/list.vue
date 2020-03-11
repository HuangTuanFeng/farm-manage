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
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
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
          <el-option label="待采购" value="0" />
          <el-option label="待配送" value="1" />
          <el-option label="待验收" value="2" />
          <el-option label="已完成" value="3" />
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="salesOrderList">
      <el-table-column label="订单编号" align="center" prop="id" />
      <el-table-column label="订单生成时间" align="center" prop="createdAt" :formatter="transformDate" width="150"/>
      <el-table-column label="订单总金额" align="center" prop="amount" width="120"/>
      <el-table-column label="客户名称" align="center" prop="name"/>
      <el-table-column label="订单状态" align="center" prop="statusName" width="100" />
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

    <sale-order-dialog :item="orderBaseInfo" :lines="orderContent" :visible.sync="open"/>
  </div>
</template>



<script>
import { listSalesOrder, getSalesOrder } from "@/api/manager/salesOrder";
import SaleOrderDialog from "@/components/saleOrderDialog"

export default {
  components: {
    SaleOrderDialog
  },
  name: "SalesOrder",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 销售订单列表数据
      salesOrderList: [],
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
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售订单列表 */
    getList() {
      this.loading = true;
      listSalesOrder(this.queryParams).then(
        response => {
          this.salesOrderList = response.rows;
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
    /** 时间转换 */
    transformDate(row) {
        var date = new Date(row.createdAt);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        return  year + '/' + month + '/' + day;
    },
    /** 查询销售订单详情*/
    getInfoById(id) {
        this.open = true;
        getSalesOrder(id).then(
            response => {
            this.orderBaseInfo = response.data.base;
            this.orderContent = response.data.content;
            }
        );
    }
  }
};
</script>