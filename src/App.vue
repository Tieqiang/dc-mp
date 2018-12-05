<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'App',
    data() {
      return {}
    },
    computed: mapState({
      error:state=>state.app.errorList,
      errorAlias:'error'
    }),
    watch: {
      error: function (newVal) {
        this.$Message.error(newVal[newVal.length-1].mes)
      }
    },
    mounted(){
      console.log(this.error)
    }
  }
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>
