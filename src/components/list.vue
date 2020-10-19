<template>
  <div class="list-box">
    <div class="header-box">
      <div class="header">
        <van-nav-bar>
         <template #left>
			<img @click="home" src="../../static/images/download_logo_3x.png" alt />
          </template> 
          <template #right>	   
			  <p class="text-app">下载APP</p>        
          </template>
        </van-nav-bar>
        <div class="header-logo">
          <div class="menu"></div>
        </div>
      </div>
      <div class="list">
        <a class="nav-tabs" v-for="(item,index) in list" @click="navBar(index)" :key="index">
          <div class="nav" :class="{navitem:index==type}">{{item}}</div>
        </a>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  export default {
    data() {
      return {
        loading: false,
        list: ["推荐音乐", "热歌榜", "搜索"],
        change: 0,
        show: false,
        userInfo: {
          head: "",
          name: ""

        }
      };
    },
    computed: {
      ...mapGetters(["type", 'loginStatus'])
    },
    created() {
      this.navBar(this.type);
      this.getUserInfo();

    },
    methods: {
      getUserInfo() {
        let info = JSON.parse(window.sessionStorage.getItem('userInfo'));
        if (info) {
          this.$set(this.userInfo, 'head', info.profile.avatarUrl)
          this.$set(this.userInfo, 'name', info.profile.nickname)
        }
        this.changeLoginStatus(info ? true : false)

      },
      ...mapMutations(["changeBar", "changeLoginStatus"]),
      navBar(val) {
        this.changeBar(val);
        let path = this.type == 1 ? 'hot' : this.type == 2 ? 'search' : 'recommend'
        this.$router.push({
          name: path
        });
      },
      home() {
        this.navBar(0)
        this.$router.push('/')
      }, 
    }
  };
</script>

<style scoped>
  .van-nav-bar {
    background-color: #d43c33;
  }

  /* 弹出层 */
  .van-popup {
    opacity: 0.8;
    height: 100%;
    background-color: #5c5858;
  }

  .van-nav-bar {
    height: 75px;
    line-height: 75px;
  }

  .content {
    margin-top: 120px;
  }

  .header-box {
    z-index: 9999;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }

  .header {
    background-color: #d43c33;
    width: 100%;
  }

  .header img {
    width: 142px;
    height: 25px;
    vertical-align: middle;
  }

  .list {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    align-items: center;
  }

  .nav {
    width: 100%;
    height: 100%;
    padding: 8px 2px;
    position: relative;
  }

  .navitem::after {
    position: absolute;
    bottom: 0;
    content: "";
    display: inline-block;
    width: 100%;
    left: -1px;
    background-color: #d43c33;
    height: 2px;
  }


  /* 侧边栏 */

  .aside {
    padding: 40px 20px;
    text-align: left;

  }

  .login {
    color: #fff;
    letter-spacing: 2px;
  }

  .userInfo {
    display: flex;
    justify-content: flex-start;
    color: #fff;
    height: 50px;
    align-items: center;
    line-height: 50px;

  }

  .userInfo p {
    display: -webkit-box;
    /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1;
    /*设置多少行*/
    -webkit-box-orient: vertical;
    /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
    overflow: hidden;
    /*文本会被修剪，并且剩余的部分不可见*/
    /*显示省略号来代表被修剪的文本*/
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: bold;

  }

  .userInfo img {
    vertical-align: middle;
    width: 40px;
    height: 40px;
    border-radius: 30px;
    margin-right: 10px;
  }

  .menu-list {
    color: #fff;
    font-size: 10px;
    margin-top: 40px;
    line-height: 30px;
  }

  .menu-list p {
    /* margin: 0 ; */
    margin-left: 5px;
  }
  .text-app {
	  width: 100px;
	  height: 35px;
	  background: rgb(255,255,255);
	  line-height: 35px;
	  border-radius:50px;
	  color: #C2352B;
	  font-size: 16px;
  }

  .van-icon {
    vertical-align: middle;
    margin-right: 5px;
  }
</style>