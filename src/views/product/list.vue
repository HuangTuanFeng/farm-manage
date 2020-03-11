<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="货物ID" align="center" prop="id" />
      <el-table-column label="货物名称" align="center" prop="farmName" />
      <el-table-column label="品类" align="center" prop="categoryName" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="所属供应商" align="center" prop="farmName" />
      <el-table-column label="所属业务员" align="center" prop="purchaserName" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import product from "@/api/manager/product";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      product.list(this.queryParams).then(response => {
        this.tableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>