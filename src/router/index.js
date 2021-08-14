import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import develop_Test from '../views/develop_Test.vue'

import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Words',
    name: 'Words',
    meta: {
      requiresAuth: true
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/Words.vue'),
  },
  {
    path: '/Notebooks',
    name: 'Notebooks',
    meta: {
      requiresAuth: true
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/NoteBooks.vue'),
  },

  {
    path: '/Quiz',
    name: 'Quiz',
    meta: {
      requiresAuth: true
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/Quiz.vue'),
  },

  {
    path: '/Stats',
    name: 'Stats',
    meta: {
      requiresAuth: true
    },
    component: () => import( /* webpackChunkName: "about" */ '../views/Stats.vue'),
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  // {
  //   path: '/develop_test',
  //   name: 'develop_test',
  //   component: develop_Test
  // },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const user = firebase.auth().currentUser
  // console.log(requiresAuth, user)
  if (requiresAuth) {
    if (user != null) {
      next()
    } else {
      router.push({
        path: "/"
      })
      // alert("Please login or register.")
    }
  } else {
    next()
  }

})

export default router