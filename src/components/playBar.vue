<template>
  <div class="play-bar">
    <div class="play-bottom-bar">
      <div class="bar-panel">
        <div class="music-info">
          <div class="picimg music-panel" :class="{active:play}" @click="musicDetails">
            <img :src="audio.picImg" />
          </div>
          <div class="music-desc">
            <p class="music-name">{{ audio.name }}</p>
            <p class="auther">{{ audio.singer }}</p>
          </div>
          <audio :src="audio.url" id="play" ref="audio" :autoplay="play" @canplay="eventMusic"></audio>
        </div>
        <div class="music-set">
          <div class="picimg" @click="playList">
            <img src="../../static/images/playbar_btn_playlist.png" alt />
          </div>
          <div class="play" @click="open()">
            <img v-if="play" src="../../static/images/playbar_btn_pause.png" alt />
            <img v-else src="../../static/images/playbar_btn_play.png" alt />
          </div>
          <div class="picimg" @click="nextMusic">
            <img src="../../static/images/playbar_btn_next.png" alt />
          </div>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="pro">
        <div :class="{progress:widthLength}" :style="{width:widthLength}"></div>
      </div>
    </div>
    <musicList :show="show" @bandlePanel="panel"></musicList>
  </div>
</template>

<script>
  import musicList from '../components/musicList.vue'
  import { mapGetters, mapMutations, mapActions } from "vuex";
  export default {
    components: {
      musicList
    },
    data() {
      return {
        play: true,
        widthLength: "",
        timer: null,
        time: 0,
        show: false,
        idIndex: 0,
        duration: ""
      };
    },
    watch: {
      currentTime(newVal, oldValue) {
      }
    },
    computed: {
      // 获取state里面的audio的数据
      ...mapGetters(["audio", 'currentTime']),
    },
    created() {
      this.time = this.$store.state.currentTime;
      this.getMusicStatus()
    },
    mounted() { // 实例挂载之后执行
      if (this.time) {
        this.$refs.audio.currentTime = this.time;
      }
    },
    methods: {
      getMusicStatus() { //获取音乐播放状态
        this.play = JSON.parse(window.sessionStorage.getItem('isPlay'));
      },
      ...mapActions([
        'changeTime',
        "musciStatus",
        "changeMusicInfo"
      ]),
      musicDetails() { // 跳转到音乐播放详情页面
        this.play = false
        this.musicTime()
        this.$router.push("/play");
      },
      eventMusic() {
        console.log('准备播放')
        this.musicTime()
      },
      musicTime() { // 获取音乐当前播放时间以及修改滚动条显示长度
        if (this.play) {
          // clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.musicPlay()
          }, 1000);
        } else {
          clearInterval(this.timer)
        }
      },
      musicPlay() { // 音乐时长处理
        let duration = this.$refs.audio.duration.toFixed(3);
        //返回音频长度
        let currentTime = this.$refs.audio.currentTime; //获取音频当前播放位置
        this.changeTime(currentTime)
        this.widthLength = (currentTime / duration) * 100 + "%";
        if (this.$refs.audio.ended) {
          console.log('音乐播放完毕！')
          this.nextMusic()
        }
      },
      nextMusic() { // 点击下一曲 获取播放音乐
			console.log('下一曲')
        let musicInfo = JSON.parse(window.sessionStorage.getItem('musicInfo'));
        let musicList = JSON.parse(window.sessionStorage.getItem("musicList"));
        let idArr = JSON.parse(window.sessionStorage.getItem('idArr'));
        idArr.map((item, index) => {
          if (item === musicInfo.id) {
            this.idIndex = index
          }
        })
        let index = this.idIndex > idArr.length ? this.idIndex = 0 : ++this.idIndex;
        this.playMusic(musicList[index]);
      },
      conversion(value) { // 播放展示时间处理
        //处理时间
        let minute = Math.floor(value / 60); //将时间取整数
        minute = minute.toString().length === 1 ? "0" + minute : minute; //判断时间长度是否为1 不为1则自动添加 0
        let second = Math.round(value % 60);
        second = second.toString().length === 1 ? "0" + second : second;
        return `${minute}:${second}`;
      },
      async playMusic(val) {

        let url = await this.getUrl(val.id)
        let data = {
          id: val.id,
          picImg: val.picImg,
          name: val.name,
          singer: val.songer,
          url: url,
          playStatus: true
        };
        if (!url) {
          this.idIndex++
        } else {
          this.changeMusicInfo(data);
        }

      },
      getUrl(id) {
        let url = this.$http.songUrl(id).then(res => {
          let info = res.data.data;
          return info[0].url
        })
        return url
      },
      open() { // 点击播放暂停处理
        this.play = !this.play;
        var music = this.$refs.audio;
        this.musciStatus(this.play)
        if (music.paused) {
          this.$refs.audio.play();
        } else {
          clearInterval(this.timer);
          this.$refs.audio.pause();
        }
        this.musicTime()
       clearInterval(this.timer)
      },
      playList() { //展示播放列表
        this.show = !this.show
        // this.setPanel(this.show)
      },
      panel(msg) { // 点击播放列表展示面板
        this.show = msg
        this.setPanel(msg)
      },
      setPanel(val) {
        window.sessionStorage.setItem('panel', val)
      }
    },
  };
</script>

<style scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .play-bottom-bar {
    background-color: #ffffff;
    /* background: rgba(0,0,0,.1); */
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }

  .bar-panel {
    padding: 5px;
    display: flex;
    justify-content: space-between;
  }

  .music-info,
  .music-set {
    align-items: center;
    display: flex;
    justify-content: flex-start;
  }

  .picimg {
    width: 40px;
    height: 40px;
  }

  .play {
    width: 35px;
    height: 40px;
  }

  .music-panel img {
    border-radius: 30px;
  }

  .picimg img,
  .play img {
    background-image: cover;
    width: 100%;
    height: 100%;
  }

  .music-desc {
    padding-left: 8px;
  }

  .music-desc .music-name {
    color: #666;
    font-size: 14px;
  }

  .music-desc .auther {
    color: #999999;
    font-size: 10px;
  }

  /* 进度条 */
  .progress {
    height: 2px;
    background-color: red;
  }

  .music-panel {
    transform: rotate(360deg);
  }

  @keyframes active {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .active {
    animation: active 20s linear infinite;
  }

  .playPro {
    background-color: red;
  }
</style>