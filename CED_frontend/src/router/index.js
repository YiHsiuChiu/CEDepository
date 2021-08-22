import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   }
  //   ,
  //   children: [
  //     {
  //       path: 'register',
  //       component: () => import('@/views/permission/register'),
  //       name: 'Register',
  //       meta: {
  //         title: 'Register',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/search',
    component: Layout,
    name: 'Search',
    redirect: '/search/search_page',
    meta: {
      title: 'Search',
      icon: 'list'
    },
    children: [
      {
        path: 'Search_page',
        component: () => import('@/views/search/search_page'),
        name: 'search_page',
        meta: { title: 'search_page', icon: 'list', noCache: true, roles: ['admin'] }
      },{
        path: 'register',
        component: () => import('@/views/permission/register'),
        name: 'Register',
        meta: {
          icon: 'list',
          title: 'Register',
          roles: ['admin']
        }
      }
      //,
      // {
      //   path: 'own-parking-list',
      //   component: () => import('@/views/parking/own-parking-list'),
      //   name: 'own-parking-list',
      //   meta: { title: 'own-parking-list', icon: 'list', noCache: true }
      // }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   name: 'Users',
  //   redirect: '/user/user-list',
  //   meta: {
  //     title: 'Users',
  //     icon: 'list',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'user-list',
  //       component: () => import('@/views/user/user-list'),
  //       name: 'user-list',
  //       meta: { title: 'user-list', icon: 'list', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/eventLog',
  //   component: Layout,
  //   name: 'Event',
  //   redirect: '/event/event-list',
  //   meta: {
  //     title: 'Event',
  //     icon: 'list',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'event-list',
  //       component: () => import('@/views/event/event_list'),
  //       name: 'event-list',
  //       meta: { title: 'event-list', icon: 'list', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/earning',
  //   component: Layout,
  //   name: 'Earning',
  //   redirect: '/earning/earning-list',
  //   meta: {
  //     title: 'Earning',
  //     icon: 'list',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'earning-list',
  //       component: () => import('@/views/earning/earning-list'),
  //       name: 'earning-list',
  //       meta: { title: 'earning-list', icon: 'list', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/fee',
  //   component: Layout,
  //   name: 'Fee',
  //   redirect: '/fee/fee-list',
  //   meta: {
  //     title: 'Fee',
  //     icon: 'list'
  //   },
  //   children: [
  //     {
  //       path: 'fee-list',
  //       component: () => import('@/views/fee/fee-list'),
  //       name: 'fee-list',
  //       meta: { title: 'fee-list', icon: 'list', noCache: true }
  //     }
  //   ]
  // },

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
