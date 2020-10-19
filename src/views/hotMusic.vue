<template>
  <div class="hot-music">
    <div class="hot-desc">
      <div class="hotpct">
        <div class="hot-gb">
          <div class="hot-name hot-p">
          </div>
          <p class="hotdate">更新日期：{{date}}</p>
        </div>
      </div>

      <div class="music-list">
        <div class="music-box">
          <div class="music-item" v-for="(item,index) in hotMusicList" :id="item.id" :img="item.al.picUrl"
            @click="play(item)">
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
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        hotMusicList: [],
        date: ''
      }
    },
    created() {
      this.getHotMusic()
    },
    methods: {
      getHotMusic() {
        this.$http.hotSong().then((res) => {
			console.log(res)
          let info = res.data.playlist;
					console.log(info)
          this.date = (this.timeUpdate(info.updateTime)).substr(5, 6);
          this.hotMusicList = info.tracks.filter((item, index) => {
            return index < 50
          });
        })
      },
      ...mapActions([
        "changeMusicInfo", "musciStatus", "getMusicList"
      ]),
      getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
      },
      timeUpdate(time = +new Date()) {
        var date = new Date(time + 8 * 3600 * 1000);
        return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
      },
      async  play(obj) {
        let url = await this.getMusicUrl(obj.id)
        let data = {
          id: obj.id,
          picImg: obj.al.picUrl,
          name: obj.name,
          singer: obj.ar[0].name,
          url: url,
          playStatus: true
        }
        this.changeMusicInfo(data) // 存储音乐信息到vuex
        this.musciStatus(true)  // 修改音乐播放状态
        this.getMusicData() //添加播放列表
      },
      getMusicData() {
        let _this = this;
        let data = JSON.parse(JSON.stringify(_this.hotMusicList));
		console.log(data)
        let info = data.map(item => {
          return ({
            id: item.id,
            picImg: item.al.picUrl,
            name: item.name,
            singer: item.ar[0].name
          })
        });
        this.getMusicList(info) //歌单列表数据
      },

      getMusicUrl(id) {
        let info = this.$http.songUrl(id).then(res => {
          let info = res.data.data;
          return info[0].url
        })
        return info;
      }
    }
  }
</script>
<style scoped>
  .first {
    color: #D43C33;
  }

  .hotpct {
    position: relative;
    width: 100%;
    height: 160px;
    background-size: 100% 100%;
    background-image: url(https://s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee=);
  }

  .hot-gb {
    position: absolute;
    margin: 30px 30px 20px;
  }


  .hot-gb .hot-p {
    width: 142px;
    height: 67px;
    background-position: -24px -30px;
  }

  .hot-name {
    background: url(../../static/images/index_icon_2x.png) no-repeat;
    background-size: 166px 97px;
  }

  .hotdate {
    color: hsla(0, 0%, 100%, .8);
    margin-top: 10px;
    font-size: 12px;
  }

  p {
    margin: 0;
    padding: 0;
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
    font-size: 17px;
  }
</style>