<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="客户ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--<el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manager:customer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manager:customer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manager:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['manager:customer:export']"
        >导出</el-button>
      </el-col>
    </el-row>-->

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户ID" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" prop="companyName" />
      <el-table-column label="客户类型" align="center" prop="typeName" />
      <el-table-column label="客户采购周期" align="center">
        <template slot-scope="scope">每{{ scope.row.period}}天</template>
      </el-table-column>
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="所属业务员" align="center" prop="saleMan" />
      <el-table-column label="客户等级" align="center" prop="level" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manager:customer:edit']"
          >查看</el-button>
          <!--<el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manager:customer:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改销售员客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%">
      <el-row>
        <el-col :span="12">
          <h4>基本信息</h4>
          <table
            cellspacing="0"
            cellpadding="0"
            class="el-table el-table--border"
            style="width:500px;"
          >
            <tbody>
              <tr>
                <td>客户名称</td>
                <td>{{ form.companyName }}</td>
              </tr>
              <tr>
                <td>客户ID</td>
                <td>{{ form.id }}</td>
              </tr>
              <tr>
                <td>客户类型</td>
                <td>{{ form.typeName }}</td>
              </tr>
              <tr>
                <td>客户采购周期</td>
                <td>每{{ form.period }}天</td>
              </tr>
              <tr>
                <td>联系人</td>
                <td>{{ form.contacts }}</td>
              </tr>
              <tr>
                <td>联系方式</td>
                <td>{{ form.phone }}</td>
              </tr>
              <tr>
                <td>地址</td>
                <td>{{ form.address }}</td>
              </tr>
              <tr>
                <td>所属业务员</td>
                <td>{{ form.saleMan }}</td>
              </tr>
              <tr>
                <td>标记等级</td>
                <td>{{ form.level }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="12">
          <h4>备注信息</h4>
          <div>{{ form.remark }}</div>
        </el-col>
      </el-row>
      <h4>最近销售订单</h4>
      <el-table border :data="latestOrders">
        <el-table-column label="时间" align="center" prop="createdAt" />
        <el-table-column label="总价" align="center" prop="amount" />
        <el-table-column label="订单编号" align="center" prop="id" />
      </el-table>
      <!--<el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售员 id, 对应staff 表" prop="salesmanId">
          <el-input v-model="form.salesmanId" placeholder="请输入销售员 id, 对应staff 表" />
        </el-form-item>
        <el-form-item label="行业类型 id" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入行业类型 id" />
        </el-form-item>
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入联系邮箱" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="客户采购周期，单位天" prop="period">
          <el-input v-model="form.period" placeholder="请输入客户采购周期，单位天" />
        </el-form-item>
        <el-form-item label="标记等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入标记等级" />
        </el-form-item>
        <el-form-item label="备注说明" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入备注说明" />
        </el-form-item>
        <el-form-item label="备注说明" prop="createdAt">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择备注说明">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注说明" prop="updatedAt">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择备注说明">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>-->
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
import {
  listCustomer,
  getCustomer,
  delCustomer,
  addCustomer,
  updateCustomer,
  exportCustomer
} from "@/api/manager/customer";

import { listSalesOrder } from "@/api/manager/salesOrder"

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 销售员客户表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        customerName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        salesmanId: [
          {
            required: true,
            message: "销售员 id, 对应staff 表不能为空",
            trigger: "blur"
          }
        ],
        typeId: [
          { required: true, message: "行业类型 id不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "客户名称不能为空", trigger: "blur" }]
      },
      // 最近订单
      latestOrders: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售员客户列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        this.customerList = response.rows;
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
        name: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售员客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCustomer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看客户";
      });

      listSalesOrder({'customerId': row.id}).then(response => {
        this.latestOrders = response.rows
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCustomer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCustomer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除销售员客户编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delCustomer(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有销售员客户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportCustomer(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>