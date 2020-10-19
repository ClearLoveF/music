import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: { name: 'list' } },
    {
      path: '/person',
      name: "person",
      component: () => import('@/views/person/person.vue'),
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/components/list.vue'),
      redirect: "/recommend",
      children: [{
        path: "/recommend",
        name: 'recommend',
        component: () => import('@/views/recommend.vue')
      },
      {
        path: "/hotmusic", //
        name: 'hot',
        component: () => import('@/views/hotMusic.vue')
      },
      {
        path: "/search",
        name: 'search',
        component: () => import('@/views/search.vue')
      }
      ]
    },
    {
      path: "/play",
      name: "play",
      meta: {
        name: true
      },
      component: () => import('@/components/playDetails.vue')
    },
    {
      path: "/musiclist",
      name: "musiclist",
      component: () => import('@/components/musicList.vue')
    },
    {
      path: "/playlist",
      name: "playlist",
      component: () => import('@/views/playlist.vue')
    },
    {
      path: "/playbar",
      name: "playbar",
      component: () => import('@/components/playBar.vue')
    }

  ]
})




router.beforeEach((to, from, next) => {

  // 如果页面点击到详情页 将playbar隐藏
  // 如果点击播放之后 判断是否退出播放列表 更改底部播放条状态
  if (to.meta.name) {
    console.log(store.state.audio.playStatus)
    store.commit('changeStatus', false)
    next()

  } else {
    if (from.path === '/play') {
      store.commit('changeStatus', true)
    }
    next()
  }
})




export default router
