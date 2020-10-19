<template>
  <div class="play-box" :style="{background:`url(${audio.picImg})`}">
    <div class="play-details">
      <div class="back">
        <div class="back-box">
          <div class="back-arr">
            <div class="back-img" @click="back()">
              <img src="../../static/images/back.png" alt />
            </div>
            <div class="auther-info">
              <p class="aut-musci">{{audio.name}}</p>
              <div class="aut-name">
                <span>{{audio.singer}}</span>
              </div>
            </div>
          </div>
          <div class="back-img">
            <img src="../../static/images/share.png" alt />
          </div>
        </div>
      </div>
      <div class="song-box">
        <div class="song-warp">
          <div class="song-img" :class="{active:open}" @click="play()">
            <img id="img " :src="audio.picImg" alt />
          </div>
        </div>
        <div class="song-click-area"></div>
      </div>
      <!-- 歌词 -->
      <div class="song-info">
        <div class="song-lyric">
          <div class="lyric-box">
            <div id="ul" ref="ul" :class="{fontRoll:open}">
              <p :class="{color:index<=currentTime}" v-for="(item,index) in lyric" :key="index">{{item}}
              </p>
            </div>
          </div>
        </div>
        <div class="song">
          <audio ref="music" :autoplay="open" type="audio/mpeg" :src="audio.url" id="play">
          </audio>
        </div>
      </div>

      <!-- 播放条 -->
      <div class="play-state">
        <div class="prog">
          <div class="pro-item">
            <span>{{currentTime}}</span>
            <div class="progresss">
              <div :class="{prg:widthLength}" :style="{'width':widthLength}"></div>
            </div>
            <span>{{duration}}</span>
          </div>
        </div>
        <div class="m-set">
          <div class="set-list">
            <ul class="set-item">
              <li>
                <div class="bar-img">
                  <img src="../../static/images/seq.png" alt />
                </div>
              </li>
              <li>
                <div class="bar-img" @click="prevMusic">
                  <img src="../../static/images/prev.png" alt />
                </div>
              </li>
              <li>
                <div class="barplay" @click="play()" :class="[open?'player':' stop']"></div>
              </li>
              <li>
                <div class="bar-img" @click="nextMusic">
                  <img src="../../static/images/next.png" alt />
                </div>
              </li>
              <li>
                <div class="bar-img" @click="showPanel">
                  <img src="../../static/images/list.png" alt />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <musicList :show="show" @bandlePanel="panel"></musicList>
    </div>
  </div>
</template>

<script>
  // 引入滚动
  import musicList from '../components/musicList.vue'
  import { mapGetters, mapActions, mapMutations } from "vuex";
  export default {
    components: {
      musicList
    },
    data() {
      return {
        music: {
          isPlay: true,
          currentTime: 0,
          maxTime: 0,
          volume: 100
        },
        open: true,
        lyric: [],
        url: "",
        audio: {},
        widthLength: "",
        duration: "00:00",
        currentTime: "00:00",
        timer: null,
        len: 0, //歌词长度
        time: "",
        show: false,
        idIndex: 0
      };
    },
    created() {
      this.time = this.$store.state.currentTime;
      this.open = this.$store.state.play;
      console.log(this.open)
      this.getMusicInfo()
      // 获取歌词
      this.getMusicLrc();
      this.progrssFun()  //数据更新之后重新渲染数据
    },
    mounted() {
      this.$nextTick(() => {
        if (this.time) {
          this.$refs.music.currentTime = this.time
          // this.getMusicInfo()
        }
        this.progrssFun()  //数据更新之后重新渲染数据
      })
    },
    updated() {
      // this.getMusicInfo()
      // this.progrssFun()  //数据更新之后重新渲染数据
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      getMusicInfo() {
        let music = window.sessionStorage.getItem("musicInfo");
        this.audio = JSON.parse(music);
		console.log(this.audio)
      },
      ...mapActions([
        'changeTime',
        'musciStatus',
        "changeMusicInfo"
      ]),
      ...mapMutations(["changeStatus"]),
      //封装一个时间转化函数
      //4.142687s => 转化成分钟4.142687/60 分钟 4.142687%60 秒 00:00
      conversion(value) {
        //处理时间
        let minute = Math.floor(value / 60); //将时间取整数
        minute = minute.toString().length === 1 ? "0" + minute : minute; //判断时间长度是否为1 不为1则自动添加 0
        let second = Math.round(value % 60);
        second = second.toString().length === 1 ? "0" + second : second;
        return `${minute}:${second}`;
      },
      //歌词处理
      lyricsList(data) {
        let lrc = data;
        //设置一个空对象
        let obj = {}; //obj.a obj[a]=当前key值所在的value值
        //设置一个正则 把数组[]去掉
        let reg = /\[(.*?)](.*)/g;
        lrc.replace(reg, (a, b, c) => {
          b = b.slice(0, 5);
          obj[b] = c;
        });
        this.lyric = obj
        this.len = Object.keys(obj).length;

      },

      // 播放条进度
      progrssFun() {
        //监控播放器的播放进度
        if (this.open) {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.musicPlay()
          }, 1000);
        } else {
          clearInterval(this.timer)
        }
      },
      musicPlay() {
        let duration = this.$refs.music.duration.toFixed(3);
        let currentTime = this.$refs.music.currentTime;
        this.duration = this.conversion(duration); //歌曲长度
        this.currentTime = this.conversion(currentTime); //播放位置
        this.widthLength = (currentTime / duration) * 100 + "%";
        this.changeTime(currentTime)
        if (this.$refs.music.ended) {
          console.log('音乐播放完毕！')
          this.nextMusic()
        }
      },
      getMusicLrc() {
        this.$http.songLyric(this.audio.id).then(res => {
          let info = res.data;
					console.log(info)
          this.lyricsList(info.lrc.lyric);
        })
      },
      back() {
        // 返回上一个界面
        this.changeStatus(this.open)
        this.$router.go(-1);
      },
      play() {
        this.open = !this.open;
        var music = this.$refs.music;
        this.musciStatus(this.open)
        if (music.paused) {
          this.$refs.music.play();
        } else {
          clearInterval(this.timer);
          this.$refs.music.pause();
        }
      },
	  prevMusic() { // 点击下一曲 获取播放音乐
	    console.log('上一曲')
	    let musicInfo = JSON.parse(window.sessionStorage.getItem('musicInfo'));
	    let musicList = JSON.parse(window.sessionStorage.getItem("musicList"));
	    let idArr = JSON.parse(window.sessionStorage.getItem('idArr'));
	    idArr.map((item, index) => {
	      if (item === musicInfo.id) {
	        this.idIndex = index
	      }
	    })
	    let index = this.idIndex > idArr.length ? this.idIndex = 0 : --this.idIndex;
	    this.playMusic(musicList[index]);
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
        let index = this.idIndex > idArr.length ? this.idIndex = 1 : ++this.idIndex;
        this.playMusic(musicList[index]);
      },
      async playMusic(val) {
        let url = await this.getUrl(val.id)
        let data = {
          id: val.id,
          picImg: val.picImg,
          name: val.name,
          singer: val.singer,
          url: url,
          playStatus: false
        };
        this.audio = data
        this.changeMusicInfo(data);
        // 切歌重新获取数据
        this.getMusicInfo()
        this.getMusicLrc();
        this.progrssFun()  
      },
      getUrl(id) {
        let url = this.$http.songUrl(id).then(res => {
          let info = res.data.data;
          return info[0].url
        })
        return url
      },
      showPanel() {
        this.show = !this.show
      },
      panel(msg) {
        this.show = msg;
        this.getMusicInfo()
      }
    }
  }
</script>

<style scoped>
  .play-box {
    height: 100vh;
    overflow: hidden;
  }

  p {
    margin: 0;
    padding: 0;
  }

  /* 顶部导航 */
  .back-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
    border-bottom: 0.5px solid #e6e6e6;
  }

  .back-arr {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .aut-musci {
    font-size: 16px;
    color: #ffffff;
  }

  .aut-name {
    color: #eeeff0;
    font-size: 10px;
  }

  .back-img {
    width: 32px;
    height: 32px;
    margin-right: 5px;
  }

  .back-img img {
    width: 100%;
    height: 100%;
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

  .play-details {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    /* filter: blur(100px); */
    /*让图片模糊*/
    /* background: url(../../static/images/daniel-olah-jy0FzwZ876c-unsplash.jpg); */
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .song-box {
    position: relative;
    padding-top: 88px;
  }

  .song-warp {
    /* animation: active 10s linear .3s infinite; */
    width: 342px;
    height: 342px;
    margin: 0 auto;
  }

  .song-img::before {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    content: "";
    background-image: url(../../static/images/disc-plus.png);
    background-size: contain;
  }

  .song-img {
    width: 100%;
    height: 100%;
    position: relative;
    margin: 0 auto;
    text-align: center;
  }

  .song-img img {
    margin-top: 66px;
    width: 212px;
    height: 212px;
    vertical-align: top;
  }

  .song-click-area {
    position: absolute;
    top: 0;
    left: 45%;
    width: 102px;
    height: 160px;
    background-image: url(../../static/images/needle-plus.png);
    background-size: 100% 100%;
    transform-origin: 20% 40%;
    transform: rotateY(20deg);
  }

  .play {
    position: absolute;
    left: 43%;
    top: 41%;
    background-image: url(../../static/images/play1.svg);
    width: 48px;
    height: 48px;
    z-index: 999;
    display: inline-block;
  }

  /* 歌词 */
  .song-lyric {
    text-align: center;
    z-index: 999;
    padding: 10px 60px;
    line-height: 30px;
    color: hsla(0, 0%, 100%, 0.6);
    font-weight: 700;
    overflow: hidden;
    height: 50px;
  }

  .lyric-box {
    overflow: hidden;
    font-size: 16;
    height: 60px;
  }

  .l-active {
    color: #ffffff;
  }

  /* 播放条 */
  .prog {
    padding: 10px 40px;
  }

  .pro-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pro-item .progresss {
    background-color: #ffffff;
    height: 2px;
    width: 75%;
  }

  .pro-item span {
    font-size: 12px;
    color: #e6e6e6;
  }

  .set-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px;
  }

  .barplay {
    width: 48px;
    height: 48px;
  }

  .bar-img {
    width: 25px;
    height: 25px;
  }

  .bar-img img,
  .barplay img {
    width: 100%;
    height: 100%;
  }

  .player {
    background-image: url(../../static/images/stop.png) !important;
    background-size: cover !important;
  }

  .stop {
    background-image: url(../../static/images/open.png) !important;
    background-size: cover !important;
  }

  .prg {
    background-color: red;
    height: 2px;
  }

  #ul {
    height: auto;
  }

  .fontRoll {
    animation: roll 240s linear infinite normal;
  }

  @keyframes roll {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translate3d(0, -1560px, 0);
    }

  }

  .color {
    color: #ffffff;
  }
</style>