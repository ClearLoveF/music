<template>
  <div class="palylist">
    <van-loading type="spinner" v-if="load" color="red" class="loading" />
    <div class="playbox">
      <div class="plsy-title" :style="{'background': 'url('+mainInfo.img+')'}">
      </div>
      <div class="play-info">
        <!-- 歌单标题 -->
        <div class="play-item">
          <div class="play-item-left">
            <div class="u-img">
              <img v-lazy="mainInfo.img" alt="mainInfo.img" :key="mainInfo.img">
            </div>
            <span class="listen">
              <img src="../../static/images/music.png" alt="">
              <span class="listen-num">{{mainInfo.number}}万</span>
            </span>
            <p class="song-order">歌单</p>
          </div>
          <div class="play-item-title">
            <p>{{mainInfo.title}}</p>
            <div class="music-intro">
              <div class="imgv">
                <img
                  src="http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.webp?imageView&thumbnail=90x0&quality=75&tostatic=0&type=webp"
                  alt="">
                <span class="v-icon"></span>
              </div>
              <span class="m-font">网易云音乐</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 歌单简介 -->
      <div class="song-order-desc">
        <div class="desc-details">
          <div class="label">
            <div>
              <span>标签：</span>
            </div>
            <span v-for="item in mainInfo.tag" class="label-item">{{item}}</span>
          </div>
          <div class="desc-info" :class="{show:show}" @click="showInfo()">
            <span>
              简介：{{mainInfo.desc}}
            </span>

          </div>
        </div>
      </div>


      <!-- 歌曲列表 -->
      <div class="song-list">
        <p class="song-list-title">歌曲列表</p>
        <div>
          <div class="music-list">
            <div class="music-box">
              <div class="music-item" v-for="(item,index) in songList" :id="item.id" :pic="item.al.picUrl"
                @click="player(item)">
                <div class="order">
                  <span v-if="index<9" :class="{first:index<3}">0{{index+1}}</span>
                  <span v-else>{{index+1}}</span>
                </div>
                <div class="musice-name">
                  <p class="musice-title">{{item.name}}</p>
                  <div class="music-desc">
                    <i class="sq-icon"></i><span>{{item.ar[0].name}} - {{item.name}}</span>
                  </div>
                </div>
                <div class="paly">
                  <img src="../../static/images/play.png" alt="">
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </div>
    <!-- 底部收藏 -->
    <div class="collect">
      <div class="collect-song">
        <span>
          <img src="../../static/images/collent.png" alt="">收藏歌单</span>
      </div>
    </div>

  </div>

</template>

<script>
  import {
    mapMutations,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        show: true,
        number: '', //收听人数
        songList: [],
        mainInfo: {},
        mainImg: '',
        mainTitle: '',
        load: true
      }
    },
    mounted() {
      this.$nextTick(() => {    
      })
    },
    created() {
      let id = this.$route.query.id
      this.getSongList(id)
    },
    methods: {
      ...mapActions(["changeMusicInfo", "musciStatus", "getMusicList"]),
      getSongList(id) {
        this.$http.songListDetails(id).then(res => {
          console.log(res)
          let info = res.data.playlist
          this.songList = info.tracks;
          this.mainInfo = {
            img: info.coverImgUrl,
            tag: info.tags,
            desc: info.description,
            title: info.name,
            number: info.trackCount
          }
          this.load = false

        })
      },
      showInfo() {
        this.show = !this.show
      },
      getListMusic() { //歌单列表
        let data = this.songList.map(item => {
          return {
            id: item.id,
            picImg: item.al.picUrl,
            name: item.name,
            singer: item.ar[0].name
          }
        })
        this.getMusicList(data)
      },
      async player(val) {
        let url = await this.getUrl(val.id)
        let data = {
          id: val.id,
          picImg: val.al.picUrl,
          name: val.name,
          singer: val.ar[0].name,
          url: url,
          playStatus: true
        };
        this.changeMusicInfo(data) // 存储音乐信息到vuex
        this.musciStatus(true)    // 修改音乐播放状态
        this.getListMusic()
      },
      getUrl(id) {
        let url = this.$http.songUrl(id).then(res => {
          let info = res.data.data;
          console.log(info)
          return info[0].url
        })
        return url

      },
    }
  }
</script>

<style scoped>
  .first {
    color: #D43C33;
  }

  .palylist {
    position: relative;
    overflow: hidden;
  }

  .u-img {
    width: 145px;
    height: 145px;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .play-info {
    position: absolute;
    top: 0;
    left: 0;
  }

  .play-item {
    justify-content: space-between;
    display: flex;
    padding: 30px 15px;
  }

  .play-item-left {
    position: relative;
  }

  .listen {
    background: rgba(0, 0, 0, 0.1);
    display: inline-block;
    width: 100%;
    height: 20px;
    position: absolute;
    top: 0;
    right: 0;
    text-align: right;
  }

  .listen img {
    width: 12px;
    height: 12px;
  }

  .listen-num {
    font-size: 12px;
    color: #FFFFFF;
    padding-right: 5px;
  }

  .song-order {
    position: absolute;
    top: 10px;
    margin: 0;
    padding: 1px 8px;
    background-color: #D43C33;
    color: #FFFFFF;
    font-size: 9px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }


  .plsy-title {
    background: url('http://p1.music.126.net/edLP5wkYk_9M6Vruhf_WRA==/109951164599925853.webp?imageView&thumbnail=378x0&quality=75&tostatic=0&type=webp');
    background-size: cover;
    padding: 30px 10px;
    height: 90px;
    position: relative;
    transform: scale(1.5);
    filter: blur(20px);
  }

  .plsy-title::before {
    background-color: rgba(0, 0, 0, .25);
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .show-play {
    z-index: 2;
  }

  .play-item-title {
    padding: 0 20px;
  }

  .music-intro {
    margin-top: 25px;
    display: flex;
    justify-content: flex-start;
  }



  .imgv {
    width: 30px;
    height: 30px;
    position: relative;
  }

  .imgv img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  .v-icon {
    vertical-align: middle;
    display: inline-block;
    position: absolute;
    right: -4px;
    bottom: 0;
    width: 12px;
    height: 12px;
    background-image: url(../../static/images/usericn_3x.png);
    background-size: 70px auto;
  }

  .play-box {
    overflow: auto;
    position: relative;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .play-item-title p {
    font-size: 17px;
    color: #FFFFFF;
  }

  .music-intro .m-font {
    margin: 5px;
    color: hsla(0, 0%, 100%, .7);
  }


  .song-order-desc {
    padding: 20px;
    margin-top: 50px;
    background-color: #f8f8f8;
  }

  .label {
    display: flex;
    justify-content: flex-start;
    color: #666;
  }

  .label-item {
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, .1);
    color: #999;
    padding: 1px 8px;
    /* line-height: 10px; */
    border-radius: 20px;
    margin-right: 10px;
  }

  .desc-info {
    margin-top: 10px;
    line-height: 19px;
    color: #666;
    font-size: 14px;
    overflow: hidden;


  }

  .show {
    display: -webkit-box;
    /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 3;
    /*设置多少行*/
    -webkit-box-orient: vertical;
    /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
    overflow: hidden;
    /*文本会被修剪，并且剩余的部分不可见*/
    text-overflow: ellipsis;
    /*显示省略号来代表被修剪的文本*/
  }


  .song-list-title {
    background-color: #eeeff0;
    padding: 3px 5px;
    color: #666;
    font-size: 12px;
  }


  .music-item {
    border-bottom: 0 solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 10px;
    /* justify-content: space-between; */
    /* margin-bottom: 10px; */
  }

  .order {
    color: #999;
    font-size: 17px;
    margin-right: 10px;
  }

  .music-desc {
    width: 100%;
    height: 20px;
    overflow: hidden;
    display: inline-block;

    font-size: 12px;
    color: #888;
  }

  .musice-name {
    flex: 4;
  }

  .sq-icon {

    width: 12px;
    height: 10px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    background: url(../../static/images/index_icon_2x.png) no-repeat;
    background-size: 166px 97px;
  }

  .play {
    flex-grow: 1;
  }

  .musice-title {
    width: 100%;
    height: 25px;
    overflow: hidden;
    display: inline-block;
    font-size: 17px;
  }

  .music-box {
    padding-bottom: 70px;
  }


  /* 收藏 */
  .collect {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    /* top: 0px; */
    width: 100%;
    background-color: #FFFFFF;
  }

  .collect-song {
    background-color: #ff3a3a;
    height: 40px;
    margin: 5px 40px;
    border-radius: 20px;
    text-align: center;
    color: #FFFFFF;
    line-height: 40px;
    font-size: 16px;
  }

  .collect-song img {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    margin-right: 5px;
  }
</style>