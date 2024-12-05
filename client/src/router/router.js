import Vue from 'vue'
import Router from 'vue-router'
import jwtDecode from 'jwt-decode'
import GSignInButton from 'vue-google-signin-button'

import HomeView from '../views/home-view.vue'
import CategoryView from '../views/category-view.vue'
import CategoryEdit from '../views/category-edit.vue'
import MediaLibrary from '../views/media-library.vue'
import BlogView from '../views/blog-view.vue'
import BlogEdit from '../views/blog-edit.vue'
import LogIn from '../views/log-in.vue'
import NotFOund from '../views/404.vue'
import TestEditor from '../views/test-editor.vue'
import { store } from '../store'

Vue.use(Router)
Vue.use(GSignInButton)

const routes = [
  {
    path: '*',
    name: 'NotFOund',
    component: NotFOund,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/category::categorySlug',
    props: true,
    name: 'category',
    component: CategoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/category-edit',
    props: true,
    name: 'category-edit',
    component: CategoryEdit,
    meta: { requiresAdmin: true }
  },
  {
    path: '/medialibrary',
    props: true,
    name: 'medialibrary',
    component: MediaLibrary,
    meta: { requiresAdmin: true }
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: { requiresAuth: true }
  },
  {
    path: '/blog-edit',
    name: 'blog-edit',
    component: BlogEdit,
    meta: { requiresAdmin: true }
  },
  {
    path: '/test-editor',
    props: true,
    name: 'test-editor',
    component: TestEditor,
    meta: { requiresAdmin: true }
  }
]

const router = new Router({
  mode: 'history',
  linkExactActiveClass: '--active',
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('internal.meditab.com::token')
  if (!token) store.removeUser(null)

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!token) next({ path: '/login?from=' + to.fullPath })
    if (!isAuthenticated(token)) next({ path: '/login?from=' + to.fullPath })
    else {
      if (store.state.user.role === 'Admin') next()
      else next({ path: '/' })
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) next({ path: '/login?from=' + to.fullPath })
    if (!isAuthenticated(token)) next({ path: '/login?from=' + to.fullPath })
    else next()
  } else {
    if (!token) next()
    if (isAuthenticated(token)) next({ path: '/' })
    else next()
  }
})

/* eslint-disable-next-line */
function isAuthenticated(token) {
  const decodedToken = jwtDecode(token)
  let loggedIn = false

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('internal.meditab.com::token')
    store.removeUser(null)
  } else {
    store.setUser(decodedToken)
    loggedIn = !loggedIn
  }

  return loggedIn
}

export default router
