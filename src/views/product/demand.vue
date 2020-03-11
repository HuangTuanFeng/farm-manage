<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="tableList">
      <el-table-column label="货物名称" align="center" prop="name" />
      <el-table-column label="品类" align="center" prop="category_name" />
      <el-table-column label="货物图片" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.pic[0]"
            v-for="pic in scope.row.pic"
            style="width: 80px;margin-right:10px;"
            :src="pic"
            :fit="contain"
            :preview-src-list="[pic]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="预计用量" align="center" prop="volume" />
      <el-table-column label="需求时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">每{{ scope.row.period }}天</span>
          <span v-else>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center" prop="statusName" />
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
import demand from "@/api/manager/demand";

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
      this.tableList = []
      this.loading = true;
      demand.list(this.queryParams).then(response => {
        response.rows.forEach(item => {
          item.pic = item.pic.split(",")
          this.tableList.push(item)          
        })
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>