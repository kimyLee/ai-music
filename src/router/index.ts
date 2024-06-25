import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Music from '@/views/Music.vue'
import Music1 from '@/views/Music1.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path: '/music1',
      name: 'music1',
      component: Music1
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
