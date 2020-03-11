<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['manager:staff:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="电话" align="center" prop="mobile" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="身份证号码" align="center" prop="idNumber" />
      <el-table-column label="客户数量" align="center" prop="customerNum" />
      <el-table-column label="历史销售订单总量" align="center" prop="orderNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleShow(scope.row)"
            v-hasPermi="['manager:staff:query']"
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

    <!-- 添加/修改销售业务员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" style="width:200px" />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile" style="width:200px" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width:200px" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idNumber">
          <el-input v-model="form.idNumber" style="width:200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoOpen" width="80%">
      <el-row :gutter="20">
        <el-col :span="8">
          <h4>基本信息</h4>
          <table cellspacing="0" cellpadding="0" class="el-table el-table--border">
            <tbody>
              <tr>
                <td>ID</td>
                <td>{{ form.id }}</td>
              </tr>
              <tr>
                <td>姓名</td>
                <td>{{ form.name }}</td>
              </tr>
              <tr>
                <td>手机号码</td>
                <td>{{ form.mobile }}</td>
              </tr>
              <tr>
                <td>邮箱</td>
                <td>{{ form.email }}</td>
              </tr>
              <tr>
                <td>身份证号码</td>
                <td>{{ form.idNumber }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="8">
          <h4>业务情况</h4>
          <table cellspacing="0" cellpadding="0" class="el-table el-table--border">
            <tbody>
              <tr>
                <td>负责客户数量</td>
                <td>{{ form.clientQty }}</td>
              </tr>
              <tr>
                <td>总销售订单金额</td>
                <td>{{ form.orderTotal }}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="8">
          <h4>权限</h4>
          <table cellspacing="0" cellpadding="0" class="el-table el-table--border">
            <tbody>
              <tr>
                <td>标记客户等级</td>
                <td>
                  <el-switch
                    v-model="form.tagCustomerEnabled"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleSwitch"
                  ></el-switch>
                </td>
              </tr>
              <tr>
                <td>新品申请审核</td>
                <td>
                  <el-switch
                    v-model="form.productDemandEnalbed"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleSwitch"
                  ></el-switch>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
      <h4>进行中的订单</h4>
      <el-table border :data="orderList">
        <el-table-column label="订单编号" align="center" prop="id" />
        <el-table-column label="订单生成时间" align="center" prop="createdAt" />
        <el-table-column label="订单总金额" align="center" prop="amount" />
        <el-table-column label="供应商名称" align="center" prop="name" />
        <el-table-column label="联系人" align="center" prop="contacts" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="所属业务员" align="center" prop="purchaserName" />
        <el-table-column label="订单状态" align="center" prop="statusName" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleShowOrder(scope.row)"
              v-hasPermi="['manager:order:query']"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="orderTotal>0"
        :total="orderTotal"
        :page.sync="orderQueryParams.pageNum"
        :limit.sync="orderQueryParams.pageSize"
        @pagination="getOrderList"
      />
    </el-dialog>

    <sale-order-dialog :item="orderInfo" :lines="orderLines" :visible.sync="orderOpen"/>

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
import staff from "@/api/manager/staff";
import { getSalesOrder } from "@/api/manager/salesOrder"
import SaleOrderDialog from "@/components/saleOrderDialog"

export default {
  components: {
    SaleOrderDialog
  },  
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
      // 订单总条数
      orderTotal: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查看详细弹出层
      infoOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 查询参数
      orderQueryParams: {
        salesManId: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "电话不能为空", trigger: "blur" }]
      },
      // 进行中的订单列表
      orderList: [],
      orderInfo: {},
      orderLines: [],
      orderOpen: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 订单列表
    getOrderList() {
      staff
        .listSaleOrdersInProgress(this.orderQueryParams)
        .then(response => {
          this.orderList = response.rows;
          this.orderTotal = response.total;
        });
    },

    // 采购员列表
    getList() {
      this.loading = true;
      staff.listSales(this.queryParams).then(response => {
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
        name: undefined
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增销售业务员";
    },

    handleShow(row) {
      this.reset();
      const id = row.id || this.ids;
      staff.get(id).then(response => {
        this.form = response.data;
        this.infoOpen = true;
        this.title = "销售业务员详细";
      });
      staff.getBusiness(id).then(response => {
        this.form.clientQty = response.data.clientQty;
        this.form.orderTotal = response.data.orderTotal;
      })
      this.orderQueryParams.salesManId = id;
      this.getOrderList();
    },
    // 查看订单
    handleShowOrder(row) {
      getSalesOrder(row.id).then(resp => {
        this.orderInfo = resp.data.base
        this.orderLines  = resp.data.content
        this.orderOpen = true

      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            staff.update(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            staff.addSale(this.form).then(response => {
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
        '是否确认删除编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delCustomerType(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    // Switch 开关
    handleSwitch() {
      staff.update(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
        } else {
          this.msgError(response.msg);
        }
      });
    }
  }
};
</script>