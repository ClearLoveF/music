<template>
  <div class="search">
    <van-loading type="spinner" v-if="load" color="red" class="loading" />
    <div v-else>
      <div class="search-box">
        <van-cell-group>
          <van-field v-model="value" left-icon="search" id="inputvalue" @keyup="searchInfo(value)" placeholder="搜索歌曲,歌手,专辑"  />
        </van-cell-group>
      </div>
      <div class="song-list-show">
        <div class="hot-search" v-if="!searchMusic.length">
          <p class="nice">热门搜索</p>
          <div class="hot-search-music">
            <div class="se-music-list">
              <ul class="musci-list-box">
                <li class="item" v-for="item in hotSearchList"  @click="searchInfo(item.first)" :key="item.id">{{item.first}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="search-music hot-search" v-else>
          <p class="nice">最佳匹配</p>
          <div class="music-list-box">
            <div class="music-list">
              <div class="music-item" v-for="(item,index) in searchMusic"  :id="item.id" @click="play(item)" :key="item.id">
                <div class="musice-name">
                  <p class="musice-title">{{item.name}}</p>
                  <div class="music-desc">
                    <i class="sq-icon"></i>
                    <span v-if="item.artist">{{item.artist.name}}</span>
                    <span v-else-if="item.artists">{{item.artists[0].name}}-{{item.name}}</span>
                    <span v-else>{{item.name}}</span>
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
  </div>
</template>

<script>
	import { mapGetters, mapMutations, mapActions } from "vuex";
  export default {
    data() {
      return {
        value: '',
        hotSearchList: [],
        searchMusic: [],
        load: true,
		currentIndex: 0,
		isShow: "music"
      }
    },
   mounted() {
    
   },
   created() {
     let id = this.$route.query.id
     // this.getSongList(id)
	 this.getData()
   },
  
    methods: {
		...mapActions(["changeMusicInfo", "musciStatus", "getMusicList"]),
      getData() {
        this.getHotSearch();
      },
	  searchInfo(key, type) {
	    this.value = key
	    let _this = this;
	    if (key) {
	      let url = type ? this.$http.hotSearchMusic : this.$http.searchMusic;
	      url(key).then(res => {
	        let info = res.data.result
	  			console.log(info)	
	        let dataInfo = []
	        for (let val in info) {
	          if (type ? val != 'order' || val != 'rec_query' : val != 'order') {
	            dataInfo.push(...info[val])
	          }
	        }
	        this.searchMusic = dataInfo
	  			console.log(this.searchMusic)
	      }).catch(err => {
	        console.log(err)
	      })
	    }
			
	  },
	  async  play(obj) {
	    let url = await this.getMusicUrl(obj.id)
	    let data = {
	      id: obj.id,
	      picImg: obj.artist.picUrl,
		  // picImg:obj.artists.img1v1Url,
	      name: obj.name,
	      singer: obj.artist.name,
	      url:url,
	      playStatus: true
	    }
	    this.changeMusicInfo(data) // 存储音乐信息到vuex
	    this.musciStatus(true)  // 修改音乐播放状态
	    this.getMusicData() //添加播放列表
	  },
	  getMusicUrl(id) {
	    let info = this.$http.searchMusic(id).then(res => {
	      let info = res.config;
		  console.log(info)
	      return info.url
	    })
	    return info;
	  },
	  getMusicData() {
	    let _this = this;
	    let data = JSON.parse(JSON.stringify(_this.searchMusic));
		console.log(data)
	    let info =data.map(item => {
	      return ({
	        id: item.id,
	        picImg: item.picUrl,
	        name: item.name,
	        singer: item.name
	      })
		  
	    });
	    this.getMusicList(info) //歌单列表数据
		console.log(info)
	  },
      getHotSearch() {
        this.$http.hotSearch().then(res => {
          let info = res.data
		  console.log(info)
          this.hotSearchList = info.result.hots
          this.load = false
        })

      },
      
	
    }

  }
</script>

<style scoped>
  .loading {
    text-align: center;
  }

  .search-box {
    padding: 10px;
    border-bottom: 0.4px solid rgba(0, 0, 0, .1);
  }

  .van-cell {
    background-color: #ebecec;
    margin: 10px 0;
    padding: 5px 16px;
    border-radius: 20px;
  }

  .song-list-show {
    padding: 10px;
  }

  .song-list-show .nice {
    font-size: 12px;
    line-height: 12px;
    color: #666666;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .hot-search-music {
    margin: 10px 0;
    font-size: 14px;
  }

  .musci-list-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .musci-list-box .item {
    margin: 0 8px 8px 0;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: inline-block;
  }


  .music-list-box {
    margin-top: 20px;
  }



  .music-item {
    border-bottom: 0 solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    /* padding:10px 0; */
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