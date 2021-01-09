<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item label="菜单名称">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入菜单名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
              disabled
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.hidden" placeholder="菜单状态" clearable size="small" disabled>
              <el-option
                v-for="hidden in hiddenOptions"
                :key="hidden.value"
                :label="hidden.label"
                :value="hidden.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" disabled>搜索</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="menuList"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: ''}"
        >
          <el-table-column prop="title" label="菜单名称" align="center" :show-overflow-tooltip="true" width="150px" />
          <el-table-column prop="icon" label="图标" align="center" width="50">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center" width="60px" />
          <el-table-column prop="name" label="路径" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hidden" label="可见" align="center" width="80">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.hidden === 1 ? 'danger' : 'success'" 
                disable-transitions
              >{{ visibleFormat(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
              >新增</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="上级菜单">
                  <treeselect
                    v-model="form.parentId"
                    :options="menuOptions"
                    :normalizer="normalizer"
                    :show-count="true"
                    placeholder="选择上级菜单"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="菜单标题" prop="title">
                  <el-input v-model="form.title" placeholder="请输入菜单标题" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示排序" prop="sort">
                  <el-input-number v-model="form.sort" controls-position="right" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="菜单图标">
                  <el-popover
                    placement="bottom-start"
                    width="460"
                    trigger="click"
                    @show="$refs['iconSelect'].reset()"
                  >
                    <IconSelect ref="iconSelect" @selected="selected" />
                    <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                      <svg-icon
                        v-if="form.icon"
                        slot="prefix"
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px;width: 16px;"
                      />
                      <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                    </el-input>
                  </el-popover>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="路由地址" prop="name">
                  <el-input v-model="form.name" placeholder="请输入路由地址" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="菜单状态">
                  <el-radio-group v-model="form.hidden">
                    <el-radio
                      v-for="hidden in hiddenOptions"
                      :key="hidden.value"
                      :label="hidden.value"
                    >{{ hidden.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu,treeSelectMenu } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'AdminMenu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 菜单状态数据字典
      hiddenOptions: [
        {value: 0,label:"可见"},
        {value: 1,label:"隐藏"}
      ],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: 0,
        title: undefined,
        hidden: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '菜单标题不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      // listMenu(this.queryParams.parentId).then(response => {
      //   this.menuList = response.data.list
      //   this.total = response.data.total
      //   this.loading = false
      // })
      treeSelectMenu().then(response => {
        this.menuList = response.data
        this.total = response.data.length
        this.loading = false
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeSelectMenu().then(response => {
        this.menuOptions = []
        const menu = { id: 0, title: '主类目', children: [] }
        menu.children = response.data
        this.menuOptions.push(menu)
      })
    },
    // 菜单显示状态字典翻译
    visibleFormat(row) {
      return this.selectDictLabel(this.hiddenOptions, row.hidden)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        path: undefined,
        icon: undefined,
        sort: 0,
        hidden: 0
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parentId = row.id
      }
      this.open = true
      this.title = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getMenu(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改菜单'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form.id,this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.message)
              }
            })
          } else {
            addMenu(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.message)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
