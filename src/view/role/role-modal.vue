<template>
  <Modal
    title="角色维护"
    :closable="false"
    :mask-closable="false"
    v-model="showRoleModal">

    <Form :model="role" ref="roleForm" :rules="roleRules" :label-width="80">
      <FormItem label="角色名称" prop="roleName">
        <Input v-model="role.roleName"/>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="default" @click="cancleRole">取消</Button>
      <Button type="primary" @click="saveRole">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import role from "../../api/sys/role";

  export default {
    name: "role-modal",
    props:{
      onSuccess:{
        type:Function,
        default:()=>{
          return ()=>{}
        }
      }
    },
    data(){
      return {
        showRoleModal:false,
        roleRules:{
          roleName:[
            {required:true,message:"角色名称不能为空！"}
          ]
        },
        role:{
          id:"",
          roleName:""
        },
      }
    },
    methods:{
      saveRole:function(){
        this.$refs.roleForm.validate((valid)=>{
          if(valid){
            role.saveRole(this.role).then(res=>{
              this.cancleRole()
              this.$Modal.success({title:"系统提示",content:"角色添加成功"})
              this.onSuccess()
            })
          }else{
          }
        })
      },
      cancleRole:function(){
        this.$refs['roleForm'].resetFields();
        this.role={
          id:"",
          roleName:""
        }
        this.showRoleModal=false;
      },
      openRoleModal:function(role){
        if(role){
          this.role=role;
        }
        this.showRoleModal=true;
      }
    }
  }
</script>

<style scoped>

</style>
