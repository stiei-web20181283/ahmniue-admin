<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="关键字" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入关键字"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="角色状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="state in statusOptions"
                :key="state.value"
                :label="state.label"
                :value="state.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="角色编号" align="center" prop="id" :show-overflow-tooltip="true" width="80" />
          <el-table-column label="角色名称" align="center" prop="name" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="角色描述" align="center" prop="description" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="用户数量" align="center" prop="adminCount" :show-overflow-tooltip="true" width="80" />
          <!-- <el-table-column label="显示顺序" align="center" prop="sort" width="80" /> -->
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-operation"
                @click="handleMenuChange(scope.row)"
              >分配菜单</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[5, 10, 15, 20, 25, 30]"
          @pagination="getList"
        />

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名称" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="form.description" placeholder="请输入角色描述" :disabled="isEdit" />
            </el-form-item>
            <!-- <el-form-item label="角色顺序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item> -->
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="state in statusOptions"
                  :key="state.value"
                  :label="state.value"
                >{{ state.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 分配角色数据权限对话框 -->
        <el-dialog :title="title" :visible.sync="openMenuChange" width="500px">
              <el-tree
                ref="menu"
                :data="menuOptions"
                show-checkbox
                node-key="id"
                empty-text="加载中，请稍后"
                :props="defaultProps"
              />
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitMenuChange">确 定</el-button>
            <el-button @click="cancelMenuChange">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, changeRoleStatus, allocMenu, listMenuByRole} from '@/api/system/role'
import { treeSelectMenu as menuTreeselect } from '@/api/system/menu'
export default {
  name: 'AdminRole',
  components: {

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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openMenuChange: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {value: 1,label:"启用"},
        {value: 0,label:"禁用"}
      ],
      // 菜单树状列表
      menuOptions: [],
      roleId:null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        keyword: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    getRoleMenuTreeselect(id) {
      listMenuByRole(id).then(response => {
        let menuList = response.data;
          let checkedMenuIds=[];
          if(menuList!=null&&menuList.length>0){
            for(let i=0;i<menuList.length;i++){
              let menu = menuList[i];
              if(menu.hasChildren == 0){
                checkedMenuIds.push(menu.id);
              } 
              // else if (menu.parentId !== 0){
              //   // if(menu.children && menu.children.lenght == 1){
              //     checkedMenuIds.push(menu.id);
              //   // }
              // }
            }
            console.log(checkedMenuIds)
          }
          this.$refs.menu.setCheckedKeys(checkedMenuIds);
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === 0 ? '禁用' : '启用'
      this.$confirm('确认要' + text + '"' + row.description + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        return changeRoleStatus(row.id, {status: row.status})
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === 0 ? 1 : 0
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelMenuChange() {
      this.openMenuChange = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        id: undefined,
        name: undefined,
        description: undefined,
        sort: 0,
        status: 0,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加角色'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.id
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改角色'
        this.isEdit = true
      })
    },
    /** 分配菜单操作 */
    handleMenuChange(row) {
      this.reset()
      // this.getMenuTreeselect()
      menuTreeselect().then(response => {
        this.menuOptions = response.data
        this.openMenuChange = true
        this.getRoleMenuTreeselect(row.id)
      })
      this.roleId = row.id
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRole(this.form.id,this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 提交按钮（菜单） */
    submitMenuChange: function() {
      let checkedNodes = this.$refs.menu.getCheckedNodes();
        let checkedMenuIds=new Set();
        if(checkedNodes!=null&&checkedNodes.length>0){
          for(let i=0;i<checkedNodes.length;i++){
            let checkedNode = checkedNodes[i];
            checkedMenuIds.add(checkedNode.id);
            if(checkedNode.parentId!==0){
              checkedMenuIds.add(checkedNode.parentId);
            }
          }
        }
        this.$confirm('是否分配菜单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let params = new URLSearchParams();
          params.append("roleId",this.roleId);
          params.append("menuIds",Array.from(checkedMenuIds));
          allocMenu(params).then(response => {
            this.$message({
              message: '分配成功',
              type: 'success',
              duration: 1000
            });
            this.openMenuChange = false
            this.roleId = null
          })
        })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
       let params=new URLSearchParams();
        params.append("ids",roleIds);
        delRole(params).then(res=> {
          this.getList()
          this.msgSuccess('删除成功')
        })
      }).catch(function() {})
    }
  }
}
</script>
