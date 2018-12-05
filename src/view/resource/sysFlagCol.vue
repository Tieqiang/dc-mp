<template>
  <span><Tag :color="tagColor">{{buttonName}}</Tag></span>
</template>
<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'sys-flag-col',
    data() {
      return {
        tagColor:'warning'
      }
    },
    methods:{
      btnClick:function(){
        console.log(this.params)
      }
    },
    computed: {
      buttonName: function () {
        if (this.params.value == 1) {
          this.tagColor='warning'
          return '系统资源'
        } else {
          this.tagColor='primary'
          return "自定义资源"
        }
      }
    }
  })

</script>
