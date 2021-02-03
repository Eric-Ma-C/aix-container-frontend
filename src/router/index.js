import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/clients/list',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }]
  },

  {
    path: '/clients',
    component: Layout,
    redirect: '/clients/list',
    name: 'Clients',
    meta: { title: '在线容器信息', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'Lists',
        component: () => import('@/views/clients/index'),
        meta: { title: '容器列表', icon: 'table' }
      },
      {
        path: 'logs',
        name: 'Client-logs',
        component: () => import('@/views/client-logs/index'),
        meta: { title: '容器日志', icon: 'tree' }
      }
    ]
  },

  {
    path: '/task',
    component: Layout,
    redirect: '/task/list',
    name: 'Task',
    meta: { title: '任务信息', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'Task List',
        component: () => import('@/views/task/index'),
        meta: { title: '已结束任务列表', icon: 'table' }
      },
      {
        path: 'client-logs',
        name: 'Client-logs',
        component: () => import('@/views/client-logs/index'),
        meta: { title: '任务统计', icon: 'tree' }
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: { title: '设备管理', icon: 'form', roles: ['admin'] },
    children: [
      {
        path: 'list',
        name: 'Device List',
        component: () => import('@/views/device/index'),
        meta: { title: '注册设备列表', icon: 'table' }
      },
      {
        path: 'client-logs',
        name: 'Client-logs',
        component: () => import('@/views/client-logs/index'),
        meta: { title: '算力Token管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/environment',
    component: Layout,
    redirect: '/environment/known_error',
    name: 'Environment',
    meta: { title: '设置', icon: 'form', roles: ['admin'] },
    children: [
      {
        path: 'known_error',
        name: 'Known Error',
        component: () => import('@/views/known_error/index'),
        meta: { title: '自动错误解析', icon: 'table' }
      },
      {
        path: 'pip',
        name: 'Pip',
        component: () => import('@/views/pip_source/index'),
        meta: { title: 'PIP源配置', icon: 'tree' }
      },
      {
        path: 'apt',
        name: 'Apt',
        component: () => import('@/views/apt_source/index'),
        meta: { title: 'APT源配置', icon: 'tree' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'http://10.214.211.205:5601/',
        meta: { title: '平台日志管理', icon: 'link' }
      }
    ]
  },
  // 'https://panjiachen.github.io/vue-element-admin-site/#/',

  {
    path: '/detail/:token',
    component: () => import('@/views/cli-detail/cli-detail')
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'history' // 把Router的mode修改为history模式,VueRouter默认的模式为HASH模式
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
