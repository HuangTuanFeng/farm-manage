<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="firstAdd">新增</el-button>
          <el-table v-loading="loading" :data="tableList" @row-click="firstHanddle">
            <el-table-column label="一级品类"  prop="value" />
            <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="updateCategory(scope.row)"
                  v-hasPermi="['system:role:find']"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="secondAdd">新增</el-button>
          <el-table v-loading="loading" :data="secondCategories" @row-click="secondHanddle">
            <el-table-column label="二级品类"  prop="value" />
            <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="updateCategory(scope.row)"
                  v-hasPermi="['system:role:find']"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="thirdlyAdd">新增</el-button>
          <el-table v-loading="loading" :data="thirdlyCategories" >
            <el-table-column label="三级品类"  prop="value" />
            <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="updateCategory(scope.row)"
                  v-hasPermi="['system:role:find']"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 新增/编辑品类 -->
    <el-dialog :title="title" :visible.sync="open" width="400px">
      <el-form label-width="120px" :model="form">
        <el-form-item label="上一级品类">
          <el-input v-model="form.parentName" :disabled="true" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="品类名称">
          <el-input v-model="form.name" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {treeListCategory, addCategory, updateCategory} from "@/api/manager/category";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      tableList: [],
      // 是否显示弹出层
      open: false,
      // 二级品类数据
      secondCategories: [],
      // 三级品类数据
      thirdlyCategories: [],
      // 一级品类信息
      first: {},
      // 二级品类信息
      second: {},
      title: '',
      form: {
          name: '',
          parentName: '',
          parentId: 0
        }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获得品类列表
    getList() {
      this.loading = true;
      treeListCategory().then(response => {
        this.tableList = response.data;
        this.loading = false;
      });
    },
    // 选中一级品类
    firstHanddle(row, event, column) {
      this.thirdlyCategories = [];
      this.second = {};
      var category = this.tableList.find(
        category => category.id == row.id
      );
      this.first = category;
      this.secondCategories = category.children;
    },
    // 选中二级品类
    secondHanddle(row, event, column) {
      var category = this.secondCategories.find(
        category => category.id == row.id
      );
      this.second = category;
      this.thirdlyCategories = category.children
    },
    // 新增一级品类
    firstAdd() {
      this.form = {};
      this.title = '新增一级品类';
      this.form.parentId = 0;
      this.form.parentName = '无';
      this.open = true;
    },
    // 新增二级品类
    secondAdd() {
      this.form = {};
      this.title = '新增二级品类';
      if(!this.first.id) {
        this.$message({
          message: '请先选择一级品类',
          type: 'warning'
        });
        return
      }
      this.form.parentId = this.first.id;
      this.form.parentName = this.first.value;
      this.open = true;
    },
    // 新增三级品类
    thirdlyAdd() {
      this.form = {};
      this.title = '新增三级品类';
      if(!this.second.id) {
        this.$message({
          message: '请先选择二级品类',
          type: 'warning'
        });
        return
      }
      this.form.parentId = this.second.id;
      this.form.parentName = this.second.value;
      this.open = true;
    },
    // 编辑品类
    updateCategory(row) {
      this.title = '编辑品类';
      this.form = {};
      this.form.id = row.id;
      this.form.parentName = row.parentName;
      this.form.name = row.value;
      this.open = true;
    },
    // 提交表单
    onSubmit() {
      if(!this.form.id) {
        addCategory(this.form).then(response => {
        this.cleanForm();
        this.getList();
      });
      } else {
        updateCategory(this.form).then(response => {
        this.cleanForm();
        this.getList();
      });
      }
    },
    // 重置表单
      cleanForm() {
        this.open = false;
        this.form = {};
        this.first = {};
        this.second = {};
        this.secondCategories = [];
        this.thirdlyCategories = [];
      }
  } 
};
</script>