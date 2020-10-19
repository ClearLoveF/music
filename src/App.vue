<template>
  <div id="app">
    <router-view />
    <!-- <div class="loading"><span></span><span></span><span></span><span></span><span></span></div> -->
    <Play v-if="audio.playStatus"></Play>
  </div>
</template>

<script>
  import Play from "./components/playBar.vue";
  import { mapGetters } from "vuex";
  export default {
    name: "App",
    components: {
      Play
    },
    data() {
      return {
        panel: false
      }
    },
    mounted() {
      this.panel = JSON.parse(window.sessionStorage.getItem('panel'))
    },
    computed: {
      ...mapGetters(["audio"])
    }
  };
</script>

<style scoped>
  .loading {
    width: 80px;
    height: 40px;
    margin: 0 auto;
    padding-top: 50%;
    text-align: center;
  }

  .loading span {
    display: inline-block;
    width: 4px;
    height: 100%;
    border-radius: 10px;
    background: rgba(218, 18, 18, 0.767);
    -webkit-animation: load 1s ease infinite;
  }

  @-webkit-keyframes load {

    0%,
    100% {
      height: 10px;
      background: rgb(245, 16, 0);
    }

    50% {
      height: 30px;
      margin: -15px 1px;
      background: rgb(221, 41, 41);
    }
  }

  .loading span:nth-child(2) {
    -webkit-animation-delay: 0.2s;
  }

  .loading span:nth-child(3) {
    -webkit-animation-delay: 0.4s;
  }

  .loading span:nth-child(4) {
    -webkit-animation-delay: 0.6s;
  }

  .loading span:nth-child(5) {
    -webkit-animation-delay: 0.8s;
  }

  body {
    overflow-x: hidden;
  }

  div,
  p {
    margin: 0;
    padding: 0;
  }

  #app {
    font: Helvetica, sans-serif, STHeiTi;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    color: #333;
    font-size: 15px;
    background-color: #fcfcfd;
  }
</style>