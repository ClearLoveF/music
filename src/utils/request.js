
import { $http } from '@/utils/config'


export const getRecSongList = (id) => {  //推荐歌单
  return $http.get(`personalized?limit=6&id=${id}`)
}


export const hotSong = () => { //热歌榜
  return $http.get(`top/list?id=3779629`)
}


export const recNewSong = () => {  //推荐音乐
  return $http.get(`personalized/newsong`)
}

export const songListDetails = (id) => { //歌单详情
  return $http.get(`playlist/detail?id=${id}`)
}


export const songUrl = (id) => { //歌曲url
  return $http.post(`song/url?id=${id}`)
}

export const songLyric = (id) => { //歌词
  return $http.post(`/lyric?id=${id}`)
}


export const hotSearch = (id) => { //热搜歌曲
  return $http.get(`search/hot`)
  // /search/hot
}


export const hotSearchMusic = (keywords) => { //搜索歌曲
  return $http.get(`/search/m?s=${keywords}&type=mobile`)
  // /search/multimatch?keywords= 海阔天空
  // /search/m/?s=猪&type=1

}

export const searchMusic = (keywords) => { //热搜词歌曲
  return $http.post(`/search/suggest?keywords= ${keywords}`)
  // /search/multimatch?keywords= 海阔天空
  // /search/suggest?keywords= 海阔天空
}


const login = (form) => {  //邮箱登录
  return $http.post(`/login?email?email=${form.username}&password=${form.password}`)
}

const userInfo = () => {
  return $http.get(`/user/subcount`) //登陆后调用此接口 , 可以获取用户信息
}

const loginStatus = () => {
  return $http.get(`/login/status`) //调用此接口,可获取登录状态
}



export default {
  getRecSongList,
  hotSong,
  recNewSong,
  songListDetails,
  songUrl,
  songLyric,
  hotSearch,
  searchMusic,
  hotSearchMusic,
  login,
  userInfo,
  loginStatus
}

