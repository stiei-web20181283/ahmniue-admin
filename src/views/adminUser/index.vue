<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="20">
          <!--用户数据-->
          <el-col :span="24" :xs="24">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
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
                  placeholder="用户状态"
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
                  :disabled="multiple&&false"
                  @click="handleDelete"
                >批量删除</el-button>
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="userList"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column label="编号" width="50" align="center" prop="id" />
              <el-table-column label="账号" align="center" prop="username" :show-overflow-tooltip="true" />
              <el-table-column label="姓名" align="center" prop="nickname" :show-overflow-tooltip="true" />
              <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleStatusChange(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createdTime" :show-overflow-tooltip="true" >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="上次登录时间" align="center" prop="loginTime" :show-overflow-tooltip="true" >
                <template slot-scope="scope">
                  <span v-if="scope.row.loginTime">{{ parseTime(scope.row.loginTime) }}</span>
                  <span v-else>N/A</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="200"
                fixed="right"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button 
                    size="mini" 
                    type="text"
                    icon="el-icon-user" 
                    @click="openRoleDialog(scope.row.id)"
                  >分配角色</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.id !== 1"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
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
          </el-col>
        </el-row>
      </el-card>
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" placeholder="请输入账号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.id == undefined" label="用户密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.id != undefined" label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="state in statusOptions"
                    :key="state.value"
                    :label="state.value"
                  >{{ state.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 角色分配 -->
      <el-dialog title="角色分配" :visible.sync="roleDialog" width="300px">
        <el-row>
          <el-select v-model="roleIds" multiple placeholder="请选择" @change="$forceUpdate()">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
              :disabled="form.status == 0"
            />
          </el-select>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateRole()">确 定</el-button>
          <el-button @click="roleDialog=false">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import { listUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, getUserRole, updateUserRole } from '@/api/system/sysuser'
import { listRole } from '@/api/system/role'
import { getToken } from '@/utils/auth'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'AdminUser',
  components: {  },
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // // 部门树选项
      // deptOptions: undefined,
      // 是否显示用户编辑弹出层
      open: false,
      // 角色分配弹出层
      roleDialog:false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {value: 1,label:"启用"},
        {value: 0,label:"禁用"}
      ],
      // 角色选项
      roleOptions: [],
      // 角色
      roleIds: [],
      roleUpdateId: '',
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        keyword: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.data.list
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 获取用户角色
    getRoleAdmin(id){
      this.loading = true
      getUserRole(id).then(response => {
          let roleAdmin = response.data
          this.roleIds = []
          if(roleAdmin!=null&&roleAdmin.length>0){
            for(let i=0;i<roleAdmin.length;i++){
              this.roleIds.push(roleAdmin[i].id);
            }
          }
          this.loading = false
        }
      )
    },
    /** 查询所有角色 */
    getRoleList() {
      this.loading = true
      listRole().then(response => {
          this.roleOptions = response.data.list
          this.loading = false
        }
      )
    },
    // 用户角色修改
    updateRole(){
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("adminId", this.roleUpdateId);
        params.append("roleIds", this.roleIds);
        updateUserRole(params).then(response => {
          if(response.code === 200){
            this.$message({
              message: '分配成功！',
              type: 'success'
            });
          } else {
            this.msgError(response.message)
          }
        })
        this.roleDialog = false
      })
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? '启用':'禁用'
      this.$confirm('确认要' + text + row.username + '用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.id, {status:row.status})
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    //角色修改弹窗
    openRoleDialog(id){
      this.roleDialog = true
      this.roleIds = []
      this.roleUpdateId = id
      this.getRoleList()
      this.getRoleAdmin(id)
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        email: undefined,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
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
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.open = true
      this.title = '修改用户'
      this.form = row
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        resetUserPwd(row.id, value).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功，新密码是：' + value)
          } else {
            this.msgError(response.msg)
          }
        })
      }).catch(() => {})
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form.id,this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addUser(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除用户编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
