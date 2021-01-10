# ahmniue-admin

[![gitee](https://gitee.com/zhong96/shop/badge/star.svg?label=Gitee)](https://gitee.com/stiei-web20182183/)

## 简介

[ahmuiue-admin](https://gitee.com/stiei-web20182183/ahmniue-admin) 是一个后台基础模块的前端的实现，它基于 [vue-element-admin](https://panjiachen.github.io/vue-element-admin)与[go-admin-ui](https://github.com/wenjianzhang/go-admin-ui)实现。实现ahmniue商城的后台权限管理前端模块。

#### 体验地址
|官网文档地址:|     |      |
|---  |--- | --- |
|项目在线演示地址:|  [ahmniue-admin](https://www.lexcubia.com)  |     |

#### 项目源码

|     |  后端仓库 |   前端仓库  | 后台管理 |
|---  |--- | --- | --- |
|   码云  | [ahmniue](https://gitee.com/stiei-web20182183/ahmniue.git) | [ahmniue-vue](https://gitee.com/stiei-web20182183/ahmniue-vue.git) | [ahmniue-admin](https://gitee.com/stiei-web20182183/ahmniue-vue.git) |
|   github   | [ahmniue](https://github.com/stiei-web20181283/ahmniue.git) | [ahmniue-vue](https://github.com/stiei-web20181283/ahmniue-vue.git) | [ahmniue-admin](https://github.com/stiei-web20181283/ahmniue-admin.git) |


### 技术选型

技术 | 说明 | 官网
----|----|----
Vue | 前端框架 | [https://vuejs.org/](https://vuejs.org/)
Vue-router | 路由框架 | [https://router.vuejs.org/](https://router.vuejs.org/)
Vuex | 全局状态管理框架 | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
Element-UI | 前端UI框架 | [https://element.eleme.io/](https://element.eleme.io/)
Js-cookie | cookie管理工具 | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
vue-element-admin | 项目脚手架参考 | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

## 功能

```
- 登录
- 退出

- 首页
- 用户管理(敬请期待)
- 商品管理(敬请期待)
- 订单管理(敬请期待)
- 内容管理(敬请期待)
- 权限管理
   - 账号管理
   - 菜单管理
   - 角色管理
   - 资源管理
   - 接口文档

```

## 开发

```bash
# 克隆项目
git clone https://gitee.com/stiei-web20182183/ahmniue-admin.git

# 进入项目目录
cd ahmniue-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```


## 在线预览

[在线 Demo](https://www.lexcubia.com)
