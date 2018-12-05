<template>
  <div style="height: 100%;">
    <Card :bordered="false"
          :dis-hover="true"
          :padding="1"
          title="资源管理"
    >
      <p slot="extra">
        <Button type="primary" icon="md-add" @click="addNewResource">新增</Button>
        <Button type="error" icon="md-remove" @click="deleteResource">删除</Button>
        <Button type="warning" icon="md-create" @click="modifyResource">修改</Button>
      </p>
      <ag-grid-vue :style="gridStyle"
                   class="ag-theme-blue"
                   :columnDefs="columnDefs"
                   :rowData="rowData"
                   :enableSorting="true"
                   :enableFilter="true"
                   rowSelection="single"
                   :gridReady="onGridReady"
                   :rowHeight="30"
                   :getContextMenuItems="getContentMenuItems"
      >
      </ag-grid-vue>
    </Card>
    <resource-form ref="resourceForm" :onSuccess="operationSuccess"></resource-form>
  </div>

</template>

<script>
  import {AgGridVue} from "ag-grid-vue";
  import resource from "../../api/sys/resource";
  import {getWindowHeight} from "../../libs/util"
  import sysFlagCol from "./sysFlagCol"
  import ResourceForm from "./resource-form";

  export default {
    name: "resource",
    components: {
      ResourceForm,
      AgGridVue,
      sysFlagCol,
    },
    data() {
      return {
        columnDefs: [
          {headerName: '资源名称', field: 'resourceName', checkboxSelection: true},
          {headerName: '操作名称', field: 'operationName'},
          {headerName: '操作编码', field: 'operationCode', width: 500},
          {headerName: '系统标志', field: 'sysFlag', width: 100, cellRendererFramework: sysFlagCol}
        ],
        rowData: "",
        gridStyle: {
          height: getWindowHeight() - 30 + 'px',
          width: '100%'
        }
      }
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
      },
      operationSuccess: function () {
        this.getAllResource()
      },
      getSelectedRows() {
        const selectNodes = this.gridApi.getSelectedNodes();
        const selectDatas = selectNodes.map(node => node.data)
        return selectDatas;
      },
      getAllResource() {
        /**
         * 获取所有的resource资源
         */
        resource.getAllResource().then(res => {
          // console.log(res.data)
          this.rowData = res.data;
        })
      },
      getContentMenuItems(params) {
        console.log("获取右键菜单")
        return contentMenus = [
          {
            name: "删除",
            action: function () {
              console.log(params)
            },

          }
        ]
      },
      sysFlagRender(params) {
        let template = ""
        if (params.value == '1') {
          template = "<span style='color:red'>系统资源</span>"
        } else {
          template = "<span>自定义资源</span>"
        }
        return template
      },
      addNewResource() {
        this.$refs.resourceForm.showResource();
      },
      modifyResource() {
        const selectedRows = this.getSelectedRows();
        if (selectedRows.length != 1) {
          this.$Modal.error({title: "系统提示", content: "请选择一个资源进行操作"})

        } else {
          if(selectedRows[0].sysFlag=='1'){
            this.$Modal.error({title:'系统提示',content:'不能修改系统权限资源'});
            return ;
          }
          this.$refs.resourceForm.showResource(selectedRows[0])
        }
      },
      deleteResource() {
        const selectedRows = this.getSelectedRows();
        if (selectedRows.length != 1) {
          this.$Modal.error({title: "系统提示", content: "请选择一个资源进行操作"})

        } else {
          let that= this;
          if(selectedRows[0].sysFlag=='1'){
            this.$Modal.error({title:'系统提示',content:'不允许删除系统权限资源'});
            return ;
          }
          this.$Modal.confirm({
            title: '系统提示',
            content: '确定要删除，资源权限么',
            onOk: function () {
              resource.removeResource(selectedRows[0]).then(res=>{
                that.$Modal.success({title:'系统提示',content:"删除成功！"})
                that.operationSuccess();
              })
            }
          })
          // this.$refs.resourceForm.showResource(selectedRows[0])
        }

      }
    },
    beforeMount() {
      this.getAllResource();
    }
  }
</script>

<style scoped>

</style>
