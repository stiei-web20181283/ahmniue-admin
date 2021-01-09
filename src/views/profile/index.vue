<template>
  <BasicLayout>
    <template #wrapper>
      <el-row :gutter="10">
        <el-col :span="8" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人信息</span>
            </div>
            <div>
              <div class="text-center">
                <userAvatar :user="user" />
              </div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  <svg-icon icon-class="user" />用户名称
                  <div class="pull-right">{{ user.username }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="email" />用户邮箱
                  <div class="pull-right">{{ user.email }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="peoples" />所属角色
                  <div class="pull-right">{{ description }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="date" />创建日期
                  <div class="pull-right">{{ parseTime(user.createTime) }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="date" />上次登录日期
                  <div class="pull-right">{{ parseTime(user.loginTime) }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="userinfo">
                <userInfo :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="resetPwd">
                <resetPwd :userInfo="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </BasicLayout>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getProfile } from '@/api/system/sysuser'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      activeTab: 'userinfo',
      roleIds: undefined,
      description: undefined,
      postName: undefined
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getProfile().then(response => {
        this.user = response.data.profile
        this.roleIds = response.data.roleIds
        this.roleGroup = response.data.roles

        if (this.roleIds[0]) {
          for (const key in this.roleGroup) {
            if (this.roleIds[0] === this.roleGroup[key].id) {
              this.description = this.roleGroup[key].description
            }
          }
        } else {
          this.description = '暂无'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-group-item{
    padding: 18px 0;
  }
  .svg-icon{
    margin-right: 5px;
  }
</style>
