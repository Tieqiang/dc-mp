<template>
  <Row :gutter="2">
    <i-col span="6">
      <Card :bordered="false"
            :dis-hover="true"
            title="角色管理"
            :padding="0"
      >
        <p slot="extra">
          <ButtonGroup>
            <Button size="small" type="primary" @click="addNewRole">
              <Icon type="ios-add" />
              添加
            </Button>
            <Button size="small" type="error" @click="removeRole">
              <Icon type="ios-remove" />
              删除
            </Button>
            <Button size="small" @click="modifyRole">
              <Icon type="ios-build" />
              修改
            </Button>
          </ButtonGroup>
        </p>
        <ag-grid-vue :style="gridStyle"
                     class="ag-theme-blue"
                     :columnDefs="roleColumns"
                     :rowData="roles"
                     :enableSorting="true"
                     :enableFilter="true"
                     rowSelection="single"
                     :enableRangeSelection="true"
                     :selectionChanged="onRoleSelected"
                     :gridReady="onGridReady"
                     :rowHeight="30"
                     :gridOptions="gridOptions"
                     :firstDataRendered="firstDataRendered"
        >
        </ag-grid-vue>
      </Card>
    </i-col>
    <i-col span="12">
      <Card :bordered="false"
            :dis-hover="true"
            title="角色权限"
            :padding="0"
      >
        <p slot="extra">
          <ButtonGroup>
            <Button type="primary" @click="setRoleResources" size="small">
              <Icon type="ios-build" />
              设置角色权限资源
            </Button>
          </ButtonGroup>
        </p>
        <ag-grid-vue :style="gridStyle"
                     class="ag-theme-blue"
                     :columnDefs="resourceColumns"
                     :rowData="selectedRole.resources"
                     :enableSorting="true"
                     :enableFilter="true"
                     :gridReady="onResourceGridReady"
                     :rowHeight="30"
        >
        </ag-grid-vue>

      </Card>
    </i-col>
    <i-col span="6">
      <Card :bordered="false"
            :dis-hover="true"
            width="20%"
            title="角色用户"
            :padding="0"
      >
        <p slot="extra">
          <ButtonGroup>
            <Button type="primary" @click="setRoleUser" v-has-permission="'login:login'" size="small">
              <Icon type="ios-build" />
              设置角色用户
            </Button>
          </ButtonGroup>
        </p>
        <ag-grid-vue
          :style="gridStyle"
          :enableSorting="true"
          :enableFilter="true"
          :columnDefs="userColumns"
          :rowData="selectedRole.users"
          rowSelection="single"
          :rowHeight="30"
          class="ag-theme-blue"
          :gridReady="onUserGridReady"
        >
        </ag-grid-vue>
      </Card>
    </i-col>
    <role-modal ref="roleModal" :onSuccess="init"></role-modal>
    <resource-modal ref="resourceModal" :role="selectedRole"></resource-modal>
    <user-modal ref="userModal" :role="selectedRole"></user-modal>
  </Row>

</template>

<script>
  import {AgGridVue} from "ag-grid-vue";
  import {getWindowHeight} from "../../libs/util"
  import Role from "../../api/sys/role";
  import * as user from "../../api/user";
  import RoleModal from "./role-modal";
  import ResourceModal from "./resource-modal";
  import UserModal from "./user-modal";
  export default {
    name: "role",
    components:{
      UserModal,
      ResourceModal,
      RoleModal,
      AgGridVue,
    },
    data(){
      return {
        roles:"",
        users:[],
        roleColumns:[
          {headerName:"角色名称",field:"roleName",checkboxSelection:true},
        ],
        resourceColumns:[
          {headerName: '资源名称', field: 'resourceName'},
          {headerName: '操作名称', field: 'operationName'},
          {headerName: '操作编码', field: 'operationCode'},
        ],
        userColumns:[
          {headerName:'登录名',field:"username"}
        ],
        selectedRole:{},
        gridStyle: {
          height: getWindowHeight() - 45 + 'px',
          width: '100%'
        },
        gridOptions:{
          getRowNodeId:function(data){
            return data.id ;
          }
        }
      }
    },
    methods:{
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
      },
      onUserGridReady:function(params){
        this.userGridApi = params.api;
        this.userGridApi.sizeColumnsToFit();
      },
      onResourceGridReady:function(params){
        this.resourceGridApi = params.api;
        this.resourceGridApi.sizeColumnsToFit();
      },
      firstDataRendered:function(){
        console.log("firstData rendered")
        if(this.roles.length){
          this.selectedRole = this.roles[0]
          const rowNode = this.gridApi.getRowNode(this.selectedRole.id);
          rowNode.setSelected(true)
        }

      },
      setRoleResources:function(){
        this.$refs.resourceModal.openResourceModal();
      },
      setRoleUser:function(){
        this.$refs.userModal.openUserModal();
      },
      init:function(){
        Role.findAllRole().then(res=>{
          this.roles = res.data;
        })
      },
      onRoleSelected:function(){
        const selectedRows = this.gridApi.getSelectedNodes()
        this.selectedRole =selectedRows[0].data
      },
      addNewRole:function(){
        this.$refs.roleModal.openRoleModal();
      },
      removeRole:function(){
        let that = this ;
        if(this.selectedRole.id){
          this.$Modal.confirm({
            title:"系统提示",
            content:"确认要删除该角色？",
            onOk:function(){
              Role.removeRole(that.selectedRole).then(res=>{
                this.$Modal.success({title:"系统提示",content:"删除成功"})
                that.init();
              })
            }
          })
        }else{
          this.$Modal.warning({title:"系统提示",content:"请选择要删除的角色！"})
        }
      },
      modifyRole:function(){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectDatas = selectedNodes.map(node => node.data)
        let modifyObject={};
        modifyObject.id = selectDatas[0].id
        modifyObject.roleName = selectDatas[0].roleName
        modifyObject.resources= selectDatas[0].resources

        modifyObject.users = selectDatas[0].users
        console.log(modifyObject)
        this.$refs.roleModal.openRoleModal(modifyObject)
      }
    },
    beforeMount(){
      this.init()
    }
  }
</script>

<style scoped>

</style>
