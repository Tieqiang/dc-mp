<template>

  <Modal
    title="角色权限管理"
    v-model="showResourceModal"
    :mask-closable="false"
    :closable="false"
    :width="80">

    <Transfer
      :listStyle="listStyle"
      :data="resourceData"
      :target-keys="targetResource"
      filterable
      :render-format="renderFormat"
      :operations="['删除权限','添加权限']"
      :titles="['待分配权限','已分配权限']"
      @on-change="handler"
    >
    </Transfer>
    <div slot="footer">
      <Button type="default" @click="closeModal">取消</Button>
      <Button type="primary" @click="saveRole">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import resource from "../../api/sys/resource";
  import Role from "../../api/sys/role";

  export default {
    name: "resource-modal",
    props:{
      role:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data(){
      return {
        showResourceModal:false,
        resourceData:[],
        resources:[],
        targetResource:[],
        listStyle: {
          width: '40%',
          height: '400px',
          'text-align': 'left'
        }
      }
    },
    methods:{
      openResourceModal:function(){
        this.showResourceModal=true;
        console.log(this.role)
        if(this.role&&this.role.resources){
          this.role.resources.forEach(item=>{
            this.targetResource.push(item.id)
          })
        }
      },
      closeModal:function(){
        this.showResourceModal=false;
        this.targetResource=[]
      },
      init:function(){

        resource.getAllResource().then(res=>{
          this.resources = res.data ;
          res.data.forEach(item=>{
            let obj ={};
            obj.label=item.resourceName
            obj.key = item.id
            obj.description= item.operationName
            this.resourceData.push(obj)
          })
        })
      },
      renderFormat:function(item){
        return item.label+"-"+item.description
      },
      handler:function(newTargeKeys){
        console.log(newTargeKeys)
        this.targetResource = newTargeKeys;
      },
      saveRole:function(){
        this.role.resources=[] ;
        for(let i =0;i<this.targetResource.length;i++){
          this.role.resources.push(this.findResourceById(this.targetResource[i]))
        }
        Role.saveRole(this.role).then(res=>{
          this.$Modal.success({title:"系统提示",content:"设置角色权限成功"})
          this.closeModal()
        })
      },
      findResourceById:function(id){
        for(let i = 0 ;i<this.resources.length;i++){
          if(this.resources[i].id==id){
            return this.resources[i];
          }
        }
      }
    },
    beforeMount(){
      this.init();
    }
  }
</script>

<style scoped>
  .ivu-transfer{
    text-align: center;
  }
</style>
