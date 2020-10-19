import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  // strict: true, // 开启严格模式
  state: {
    type: 0,
    isPlay: false,
    audio: {
      id: '', // 音乐id
      picImg: '', // 播放器封面图片
      singer: '', // 演唱者
      name: '', // 歌曲名称
      playStatus: false,  //底部播放条
      url: "", // 音乐url
    },
    play: true,   //音乐播放状态
    currentTime: 0, //当前播放时间
    loginStatus: false,
    playList: []  //歌单列表
  },
  getters: {
    type: state => state.type,
    audio: state => state.audio,
    currentTime: state => state.currentTime,
    play: state => state.play,
    loginStatus: state => state.loginStatus
  },
  mutations: { // 同步
    changeBar(state, type) {
      state.type = type
    },
    //修改底部播放条状态
    changeStatus(state, status) {
      state.audio.playStatus = status
    },
    currentTime(state, time) {
      state.currentTime = time
    },
    add_Music(state, data) {
      state.audio = { ...data }
    },
    musciStatus(state, play) {
      state.play = play
    },
    changeLoginStatus(state, status) {
      state.loginStatus = status
    },
    getMusicList(state, data) {
      // state.playList = state.playList.concat(data);
      state.playList = data;

    }
  },
  actions: { // 异步操作
    changeMusicInfo({  // 存储音乐信息
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        resolve()
      }).then(res => {
         // 将音乐信息存储到sessionStorge 避免刷新页面的时候vuex数据更新
         window.sessionStorage.setItem('musicInfo', JSON.stringify(data))
        commit('add_Music', data)
      }).catch(err => err)
    },

    changeTime({ commit }, data) {
      commit('currentTime', data)
    },
    musciStatus({ commit }, data) { // 音乐是否播放
      window.sessionStorage.setItem('isPlay', JSON.stringify(data))
      commit('musciStatus', data)

    },
    changeLoginStatus({ commit }, data) { // 登录状态是否存在
      window.sessionStorage.setItem('loginStatus', JSON.stringify(data))
      commit('changeLoginStatus', data)
    },
    getMusicList({ commit }, data) {
      window.sessionStorage.setItem('musicList', JSON.stringify(data)) // 存歌单到
      commit('getMusicList', data)
    }
  }
})

export default store
