<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="订单编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="任务ID" align="center" prop="id" />
      <el-table-column label="任务生成时间" align="center" prop="created_at" />
      <el-table-column label="联系人" align="center" prop="name" />
      <el-table-column label="联系方式" align="center" prop="mobile" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleShow(scope.row)"
            v-hasPermi="['manager:task:query']"
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

    <!-- 查看采购任务明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%">
      <div>
        <p>采购任务编号：{{ form.purchaserId }}</p>
      </div>
      <div>
        <p>生成时间：{{ form.createdAt }}</p>
      </div>
      <el-table border :data="taskLines">
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="货物ID" align="center" prop="productId" />
        <el-table-column label="货物名称" align="center" prop="productName" />
        <el-table-column label="品类" align="center" prop="categoryName" />
        <el-table-column label="数量" align="center" prop="qty" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="参考价格" align="center" />
        <el-table-column label="采购单价" align="center" prop="price" />
        <el-table-column label="余额未分配数量" v-if="form.status === 2" align="center" prop="leftQty" />
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
import purchaseTask from "@/api/manager/purchaseTask";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 状态选项
      statusOptions: [
        {
          label: "已完成",
          value: 3
        },
        {
          label: "待报价",
          value: 1
        },
        {
          label: "报价待审核",
          value: 2
        }
      ],
      // 任务明细数据
      taskLines: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取任务列表
    getList() {
      this.loading = true;
      purchaseTask.list(this.queryParams).then(response => {
        this.tableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        status: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 查看按钮操作 */
    handleShow(row) {
      this.reset();
      const id = row.id || this.ids;
      purchaseTask.get(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "采购任务明细";
      });
      purchaseTask.getLines(id).then(response => {
        this.taskLines = response.rows
      });
    }
  }
};
</script>