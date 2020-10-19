<template>
    <div class="person-box">
        <van-nav-bar left-arrow @click-left="onClickLeft" />
        <div>
            <div class="person-info">
                <div class="avatarUrl">
                    <img :src="userInfo.head" alt="">
                </div>
                <div class="name">
                    <span class="nick-name">{{userInfo.name}}</span>
                    <div class="fans">
                        <span>关注 10</span>
                        <span>粉丝 10</span>
                    </div>
                    <div class="edit">
                        <div class="tag">
                            <p>95后</p>
                            <p>LV 8</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="song-panel">
                <van-tabs v-model="active" :border="false" background="transparent" color="#d9d2c1" line-width="30px"
                    title-inactive-color="#fff" title-active-color="#fff">
                    <van-tab title="主页">
                        <div class="music-list">
                            <div class="list-item">
                                <div class="rank-img">
                                    <img src="http://vrqn.liuliangin.com//xym/essence/product/1587610993401" alt="">
                                </div>
                                <div class="rank-num">
                                    <p>听歌排行</p>
                                    <p>累计听歌5468首</p>
                                </div>
                            </div>
                            <div class="list-item">
                                <div class="like-img">
                                    <img src="http://vrqn.liuliangin.com//xym/essence/product/1587612681946" alt="">
                                </div>
                                <div class="rank-num">
                                    <p>我喜欢的音乐</p>
                                    <p>140首,播放1520次</p>
                                </div>
                            </div>

                            <!-- 我创建的歌单 -->
                            <div class="song-list">
                                <p class="create">创建的歌单 <span class="create-num">(7个,被收藏0次)</span></p>
                                <div class="list-item">
                                    <div class="rank-img">
                                        <img src="http://vrqn.liuliangin.com//xym/essence/product/1587610993401" alt="">
                                    </div>
                                    <div class="rank-num">
                                        <p>听歌排行</p>
                                        <p>累计听歌5468首</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </van-tab>
                    <van-tab title="动态">内容 2</van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from "vuex"
    export default {
        data() {
            return {
                active: 0,
                tab: ['主页', '动态'],
                userInfo: {
                    head: "",
                    name: ""
                }
            }
        },
        created() {
            this.getUserInfo();
            this.getLoginStatus();
            let user = JSON.parse(window.sessionStorage.getItem('userInfo'))
            if (user) {
                this.$set(this.userInfo, 'head', user.profile.avatarUrl)
                this.$set(this.userInfo, 'name', user.profile.nickname)
            }
        },
        computed: {
            ...mapGetters(["loginStatus"])
        },
        methods: {
            getLoginStatus() { //获取用户登录状态
                this.$http.loginStatus().then(res => {
                    console.log(res)
                })
            },
            getUserInfo() {  // 获取用户资料
                this.$http.userInfo().then(res => {
                    console.log(res)
                })
            },
            onClickLeft() {
                this.$router.go(-1)
            }
        },
    }
</script>

<style scoped>
    .person-box {
        background-image: url('http://vrqn.liuliangin.com//xym/essence/product/1587545432431');
        background-size: cover;
        width: 100%;
        height: 100%;
        background-attachment: fixed;
        top: 0;
        left: 0;
        bottom: 0;
    }

    .van-nav-bar {
        background-color: transparent;
        border-bottom: none;
    }

    .van-nav-bar .van-icon {
        color: #ffffff;
    }

    .van-nav-bar::after {
        border-bottom: none;
    }

    .person-info {
        padding: 0 20px;
        margin-top: 40px;
    }

    .avatarUrl {
        width: 70px;
        height: 70px;
        vertical-align: middle;
    }

    .avatarUrl img {
        width: 100%;
        height: 100%;
        border-radius: 50px;
    }

    .name {
        margin-top: 15px;
        font-size: 14px;
        /* text-align: center; */
    }

    .nick-name {
        color: #fff;
        font-weight: 700;
    }

    .fans {
        margin-top: 5px;
        font-size: 9px;
        color: #9e9e9e;
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.80);
    }

    .fans span:first-child::after {
        content: '|';
        padding: 0 5px;

    }

    .tag {
        /* margin-top: 8px; */
    }

    .tag p:first-child {
        background-color: #854760;
        /* margin-right: 0; */
    }

    .tag p {
        margin: 0;
        padding: 3px 12px;
        background-color: rgb(139, 131, 131);
        display: inline-block;
        text-align: center;
        border-radius: 20px;
        opacity: 0.9;
        font-size: 10px;
        color: #ffffff;
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.7);
    }

    /* 歌单面板 */
    .song-panel {
        width: 100%;
        margin-top: 15px;
        background-color: rgb(255, 253, 253, 0.2);
        height: calc(100vh - 250px);
        /* opacity: 0.2; */
        border-top-right-radius: 30px;
        border-top-left-radius: 30px;
    }

    .music-list {
        padding: 10px 20px;
    }

    .list-item {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }

    .rank-img,
    .like-img {
        /* margin-right: 10px; */
        width: 50px;
        height: 50px;
        border-radius: 5px;
        text-align: center;
        line-height: 45px;

    }

    .rank-img {
        background: linear-gradient(30deg, #983a32, #c2352b, #db6b63, #f3887c)
    }

    .like-img {
        background-color: #fff;
    }

    .rank-img img,
    .like-img img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
    }

    .rank-num p {
        color: #fff;
        margin: 0 auto;
    }

    .rank-num p:first-child {
        font-size: 14px;
        transform: scale(0.8);


    }

    .rank-num p:last-child {
        font-size: 9px;
        transform: scale(0.7);
        margin-left: -5px;
    }

    .create {
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 1px;
    }

    .create .create-num {
        font-weight: normal;
        font-size: 8px;
        transform: scale(0.5);
        letter-spacing: 0;
    }
</style>