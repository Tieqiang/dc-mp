/**
 * 系统设置相关路由
 **/

import Main from '@/components/main'

export default [
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '系统管理',
      icon: 'md-settings'
    },
    children: [
      {
        path: '/role.html',
        name: 'role_manager',
        meta: {
          title: '角色管理',
          icon: 'md-person'
        },
        component: () => import('@/view/role/role')
      },
      {
        path: '/resource.html',
        name: 'resource_manager',
        meta: {
          title: '资源管理',
          icon: 'md-basket'
        },
        component: () => import('@/view/resource/resource')
      }
    ]
  }
]
