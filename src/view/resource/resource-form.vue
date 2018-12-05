<template>
  <Modal
    title="权限资源管理"
    :closable="false"
    :mask-closable="false"
    @on-ok="mergeResource"
    @on-cancel="closeResource"
    v-model="showModal"
    width="40"
  >
    <Form ref="resourceForm" :rules="rules" :model="resourceData" :label-width="80">
      <FormItem prop="resourceName" label="资源名称">
        <Input type="text" v-model="resourceData.resourceName" placeholder="请输入资源名称"/>
      </FormItem>
      <FormItem prop="operationName" label="操作名称">
        <Input type="text" v-model="resourceData.operationName" placeholder="请输入操作名称"/>
      </FormItem>
      <FormItem prop="operationCode" label="操作编码">
        <Input type="text" v-model="resourceData.operationCode" placeholder="请输入操作编码"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="closeResource">取消</Button>
      <Button type="primary" size="large" @click="mergeResource">确定</Button>
    </div>
  </Modal>

</template>

<script>
  import resource from "../../api/sys/resource";
  import Input from "iview/src/components/input/input";

  export default {
    components: {Input},
    props: {
      resourceNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '资源形成不能为空', trigger: 'blur'}
          ]
        }
      },
      operationNameRules: {
        type: Array,
        default: () => {
          return [{required: true, message: '操作名称不能为空', trigger: 'blur'}]
        }
      },
      operationCodeRules: {
        type: Array,
        default: function() {
          let that = this;
          return [
            {required: true, message: "操作编码不能为空", trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                resource.getResourceByOperationCode(value).then(res=>{
                  if(res.data&&res.data.id!=that.resourceData.id){

                    callback(new Error('编码为：' + value + '的操作已经存在了，请重新设置编码'))
                  }else{
                    callback();
                  }
                });
              }, trigger: 'blur'
            }
          ]
        }
      },
      onSuccess:{
        type:Function,
        default:()=>{
          return ()=>{}
        }
      }
    },
    name: "ResourceForm",
    data() {
      return {
        showModal: false,
        resourceData: {
          id: "",
          resourceName: "",
          operationName: "",
          operationCode: "",
          sysFlag: "0"
        },
        validate: undefined
      }
    },
    computed: {
      rules() {
        return {
          resourceName: this.resourceNameRules,
          operationCode: this.operationCodeRules,
          operationName: this.operationNameRules
        }
      }
    },
    methods: {
      mergeResource: function () {
        this.validate = this.$refs.resourceForm.validate((valid) => {
          if (valid) {
            resource.saveResource(this.resourceData).then(res => {
              if (res) {
                this.$Modal.success({title: "系统提示", content: "保存成功！"})
                this.onSuccess();
                this.closeResource();
              }
            })
          }
        });
      },
      showResource: function (resourceData) {
        this.showModal = true;
        if (resourceData) {
          this.resourceData = resourceData;
        }
      },
      closeResource: function () {
        this.$refs['resourceForm'].resetFields();
        this.resourceData = {
          id: "",
          resourceName: "",
          operationName: "",
          operationCode: "",
          sysFlag: "0"
        }
        this.showModal = false;
      }
    }
  }
</script>

<style scoped>

</style>
