<template>
  <div class="recommend">
    <van-loading type="spinner" v-if="load" color="red" class="loading" />
    <div class="recommend-box" v-else>
      <div class="rec">
        <span class="title">推荐歌单</span>
      </div>
      <div class="rec-list">
        <div class="rec-item">
          <div class="rec-item-info" @click="songDetails(item.id)" v-for="(item,index) in palylists" :key="index"
            :id="item.id">
            <div>
              <img v-lazy="item.picUrl" alt="item.picUrl" :key="item.picUrl" />
            </div>
            <p>{{item.name}}</p>
            <div class="user">
              <img src="../../static/images/data_image_svg+xml;….svg" alt />
              <span>{{Math.round((item.playCount/10000)*100)/100}}万</span>
            </div>
          </div>
        </div>
      </div>
    
    <!-- 最新音乐 -->
    <div class="new-music">
      <div class="rec">
        <span class="title">最新音乐</span>
      </div>
      <div class="music-list-box" :style="{'margin-bottom':audio.playStatus?'80px':''}">
        <div class="music-list">
          <div class="music-item" v-for="item in newSong" @click="open(item)" :key="item.id" :id="item.id">
            <div class="musice-name">
              <p class="musice-title">{{item.name}}</p>
              <div class="music-desc">
                <i class="sq-icon"></i>
                <span>{{item.artists[0].name}} - {{item.name}}</span>
              </div>
            </div>
            <div class="paly">
              <img src="../../static/images/play.png" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  // 获取音乐播放列表--实现切歌--存缓存--
  import { mapGetters, mapMutations, mapActions } from "vuex";
  export default {
    data() {
      return {
        palylists: [], // 推荐歌单
        newSong: [], // 推荐音乐
        load: true
      };
    },
    created() {
      this.$http.getRecSongList().then((res) => {
        this.palylists = res.data.result;
        this.load = false
      }).catch(err => err)
      this.getNewSong()
    },
    computed: {
      ...mapGetters(["audio"])
    },
    methods: {
      ...mapActions(["changeMusicInfo", 'getMusicList', "musciStatus"]),
      getNewSong() {
        this.$http.recNewSong().then((res) => {
          res.data.result.filter((item, index) => {
            let info = item.song;
            this.newSong.push(info)
          });
        })
      },
      getMusicUrl() {
        let _this = this;
        let data = JSON.parse(JSON.stringify(_this.newSong));
        let info = data.map(item => {
          return ({
            id: item.id,
            singer: item.artists[0].name,
            picImg: item.album.picUrl,
            name: item.name,
          })
        });
        this.getMusicList(info) //歌单列表数据
      },
      async open(val) {
        let url = await this.getUrl(val.id)
        let data = {
          id: val.id,
          picImg: val.album.picUrl,
          name: val.name,
          singer: val.artists[0].name,
          url: url,
          playStatus: true
        };
        this.musciStatus(true)
        this.changeMusicInfo(data);
        this.getMusicUrl()

      },
      getUrl(id) {
        let url = this.$http.songUrl(id).then(res => {
          let info = res.data.data;
          return info[0].url
        })
        return url
      },
      songDetails(id) {
        // 歌单id
        this.$router.push({
          name: "playlist",
          query: {
            id: id
          }
        });
      }
    }
  }
</script>

<style scoped>
  .loading {
    text-align: center;
  }

  .rec {
    padding-top: 20px;
  }

  .title {
    font-size: 17px;
    display: inline-block;
    padding-bottom: 15px;
  }

  .title::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 15px;
    vertical-align: middle;
    margin-right: 10px;
    background-color: #d43c33;
  }

  .rec-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .rec-item-info {
    position: relative;
    margin-bottom: 20px;
    width: 33%;
  }

  .rec-item-info img {
    vertical-align: top;
    width: 100%;
  }

  .rec-item-info p {
    display: -webkit-box;
    margin: 0;
    min-height: 30px;
    padding: 6px 2px 0 6px;
    font-size: 13px;
  }

  .user {
    position: absolute;
    top: 0;
    left: 0;
    color: #ffffff;
    text-align: right;
    width: 100%;
    font-size: 12px;
  }

  .user span {
    display: inline-block;
    padding-top: 2px;
    padding-right: 6px;
  }

  .user img {
    width: 13px;
    height: 18px;
    vertical-align: top;
  }

  /* 最新音乐 */
  p {
    margin: 0;
    padding: 0;
  }

  .music-item {
    border-bottom: 0 solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0 10px 10px;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .music-desc {
    font-size: 12px;
    color: #888;
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

  .musice-title {
    font-size: 17px;
  }
</style>