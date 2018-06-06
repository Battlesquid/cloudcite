import Vue from 'vue'
import Router from 'vue-router'
import CloudCite from '@/components/CloudCite'
const EditCitation = () => import('@/components/EditCitation')
const About = () => import('@/components/About')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CloudCite',
      component: CloudCite
    },
    {
      path: '/edit',
      name: 'EditCitation',
      component: EditCitation
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
