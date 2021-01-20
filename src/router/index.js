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
        name: 'Clients',
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
    path: '/gpu',
    component: Layout,
    redirect: '/gpu/list',
    name: 'GPU',
    meta: { title: 'GPU信息', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'GPU List',
        component: () => import('@/views/gpu/index'),
        meta: { title: '在线GPU列表', icon: 'table' }
      },
      {
        path: 'client-logs',
        name: 'Client-logs',
        component: () => import('@/views/client-logs/index'),
        meta: { title: 'GPU概览', icon: 'tree' }
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: { title: '设备管理', icon: 'form' },
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
    meta: { title: '设置', icon: 'form' },
    children: [
      {
        path: 'known_error',
        name: 'Known Error',
        component: () => import('@/views/known_error/index'),
        meta: { title: '自动错误解析', icon: 'table' }
      },
      {
        path: 'source',
        name: 'Source',
        component: () => import('@/views/source/index'),
        meta: { title: '软件源配置', icon: 'tree' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
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
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
