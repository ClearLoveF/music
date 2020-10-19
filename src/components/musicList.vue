<template>
    <div>
        <van-overlay :show="show" @click="closePanel" z-index="20000" lock-scroll>
            <div class="wrapper">
                <div class="block" style="z-index:999999">
                    <div class="wrapper-top">
                        <span class="open-title"> 当前播放（30）</span>
                        <div class="list-loop">
                            <div class="loop">
                                <img src="http://vrqn.liuliangin.com//xym/essence/product/1587713488112" alt="">
                                <span>列表循环</span>
                            </div>
                            <div class="all" >
                                <div class="collect">
                                    <img src="http://vrqn.liuliangin.com//xym/essence/product/1587713671501" alt="">
                                    <span style="color:#333333;">收藏全部</span>
                                </div>
                                <div class="delete">
                                    <img src="http://vrqn.liuliangin.com//xym/essence/product/1587713849292" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="music-list-roll">
                            <div class="music-list-roll-wrapper">
                                <div class="music-item" v-for="(item,index) in musicList" :key="item.id">
                                    <div class="change" @click="playMusic(item)" :class="{active:id==item.id}">
                                        <span>{{item.name}}</span>
                                        <span>-{{item.singer}}</span>
                                    </div>
                                    <i class="remove" @click="removeId(index)" style="color:red ;">
										<img src="../../static/images/delete.jpg" alt="" style="width: 10px; height: 10px;">
									</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    // 获取音乐列表数据---展示页面---点击歌曲显示
    // bug   
    // 2. 播放详情页面没有实现点击列表展示 以及下一曲的功能
    // 3. 播放列表点击删除 数据没有移除 
    // 4. 播放列表滚动的时候 页面也会滚动
    export default {
        data() {
            return {
                musicList: [],
                id: ""
            }
        },
        props: [
            "show"
        ],
        mounted() {
            this.getList()
        },
        methods: {
            deteleObject(obj) {
                var uniques = [];
                var stringify = {};
                for (var i = 0; i < obj.length; i++) {
                    var keys = Object.keys(obj[i]);
                    var str = '';
                    for (var j = 0; j < keys.length; j++) {
                        str += JSON.stringify(keys[j]);
                        str += JSON.stringify(obj[i][keys[j]]);
                    }
                    if (!stringify.hasOwnProperty(str)) {
                        uniques.push(obj[i]);
                        stringify[str] = true;
                    }
                }
                uniques = uniques;
                return uniques
            },
            ...mapActions(["changeMusicInfo", "getMusicList"]),
            getList() {
                this.musicList = this.deteleObject(JSON.parse(window.sessionStorage.getItem('musicList')))
                let musicInfo = JSON.parse(window.sessionStorage.getItem('musicInfo'))
                this.id = musicInfo.id
                let idArr = this.musicList.map(item => {
                    return item.id
                })
                window.sessionStorage.setItem('idArr', JSON.stringify(new Set(idArr)))
            },
            async playMusic(val) {
                let url = await this.getUrl(val.id)
                let data = {
                    id: val.id,
                    picImg: val.picImg,
                    name: val.name,
                    singer: val.singer,
                    url: url,
                    status: true
                };
                this.getList()
                this.changeMusicInfo(data);
            },
            getUrl(id) {
                let url = this.$http.songUrl(id).then(res => {
                    let info = res.data.data;
                    return info[0].url
                })
                return url
            },
            closePanel() {
                this.getList()
                this.$emit("bandlePanel", false)
            },
            removeId(index) {
                this.musicList.splice(index, 1)
                this.getMusicList(this.musicList)

            }
        },
    }
</script>

<style scoped>
    .loading {
        text-align: center;
    }

    div,
    p {
        margin: 0;
        padding: 0;
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .block {
        width: 80vw;
        /* color: #333333; */
        height: 60vh;
        padding: 20px;
        border-radius: 20px;
        background-color: #EBECEC;
        position: relative;
    }


    .open-title {
        font-size: 14px;
        font-weight: 700;
    }

    .list-loop {
        font-size: 12px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .loop img {
        width: 25px;
        height: 25px;
    }

    .collect img {
        width: 20px;
        height: 20px;
    }

    img {
        vertical-align: middle;
    }

    .delete img {
        width: 18px;
        height: 18px;

    }

    .all {
        display: flex;
        justify-content: space-between;
    }

    .collect {
        color: rgba(225, 225, 225, 0.9);
    }

    .collect span:after {
        content: "|";
        margin: 0 10px;
        color: rgba(225, 225, 225, 0.4);
    }

    .music-list-roll {
        overflow: hidden;
        /* height: 400px; */
    }

    .music-list-roll-wrapper {
        height: 330px;
        overflow: scroll;
    }

    .music-item {
        margin: 15px 0;
        display: flex;
        justify-content: space-between;
        font-size: 11px;
    }
	 .music-item:hover div{
		color: red;
	}

    .music-item span:first-child {
        font-size: 13px;
    }

    .music-item span:last-child {
        font-size: 9px;
        transform: scale(0.6);
        color: #333333;
    }

    i {
        color: rgba(225, 225, 225, 0.5);
        width: 20px;
        height: 20px;
        font-size: 20px;
    }

    .music-item .active span {
        color: rgb(252, 0, 0);
    }
</style>