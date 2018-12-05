<template>

  <Modal
    :closable="false"
    :mask-closable="false"
    title="设置角色用户"
    :width="80"
    v-model="showUserModal"
    >
    <Transfer
      :listStyle="listStyle"
      :data="userData"
      :render-format="renderItem"
      :target-keys="targetUsers"
      :operations="['删除用户','分配用户']"
      :titles="['待分配用户','已分配用户']"
      filterable
      @on-change="selectChange"
      >

    </Transfer>
    <div slot="footer">
      <Button type="default" @click="closeUserModal">取消</Button>
      <Button type="primary" @click="saveRole">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import {findAllUser} from "../../api/user";
  import Role from "../../api/sys/role";

  export default {
    name: "user-modal",
    props:{
      role:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data(){
      return{
        showUserModal:false,
        userData:[],
        users:[],
        targetUsers:[],
        listStyle: {
          width: '40%',
          height: '400px',
          'text-align': 'left'
        }
      }
    },
    methods:{
      renderItem:function(item){
        return item.label
      },
      openUserModal:function(){
        this.showUserModal=true;
        console.log(this.role)
        if(this.role&&this.role.users){
          this.role.users.forEach(item=>{
            this.targetUsers.push(item.id)
          })
        }
        console.log(this.targetUsers)
      },
      closeUserModal:function(){
        this.showUserModal=false
        this.targetUsers=[]
      },
      saveRole:function(){
        this.role.users=[] ;
        for(let i =0;i<this.targetUsers.length;i++){
          this.role.users.push(this.findUserById(this.targetUsers[i]))
        }
        Role.saveRole(this.role).then(res=>{
          this.$Modal.success({title:"系统提示",content:"设置角色用户成功"})
          this.closeUserModal()
        })
      },
      findUserById:function(id){
        for(let i = 0 ;i<this.users.length;i++){
          if(this.users[i].id==id){
            return this.users[i];
          }
        }
      },
      selectChange:function(newTargets){
        this.targetUsers = newTargets;
      }
    },
    beforeMount(){
      findAllUser().then(res=>{
        this.users = res.data ;
        this.users.forEach(item=>{
          let obj = {}
          obj.key = item.id ;
          obj.label = item.username
          this.userData.push(obj)
        })
      })
    }
  }
</script>

<style scoped>
  .ivu-transfer{
    text-align: center;
  }
</style>
