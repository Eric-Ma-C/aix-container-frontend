(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6d82e737"],{9712:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container",staticStyle:{display:"flex","flex-direction":"column","align-items":"center"}},[i("h1",{staticStyle:{"align-self":"center"}},[t._v("PIP软件源管理")]),t._v(" "),i("el-button",{on:{click:t.insertSource}},[t._v("添加")]),t._v(" "),i("br"),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],staticStyle:{width:"auto"},attrs:{data:t.list,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[i("el-table-column",{attrs:{align:"center",label:"ID",prop:"id",width:"55"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"名称",prop:"name",width:"155"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"url",prop:"url",width:"455"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"200px"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticStyle:{display:"flex"}},[i("el-button",{on:{click:function(i){return t.jumpToManageDialog(e.row)}}},[t._v("修改")]),t._v(" "),i("el-button",{on:{click:function(i){return t.deleteById(e.row.id)}}},[t._v("删除")])],1)]}}])})],1),t._v(" "),i("el-pagination",{attrs:{"current-page":t.currentPage,"page-size":t.pageSize,layout:"total, prev, pager, next, jumper",total:t.totalCount},on:{"current-change":t.handleCurrentChange}}),t._v(" "),i("el-dialog",{attrs:{title:"管理",visible:t.dialogVisible,width:"1000px"},on:{"update:visible":function(e){t.dialogVisible=e}}},[i("el-form",{attrs:{"label-position":"right","label-width":"auto"}},[i("el-form-item",{staticStyle:{"margin-right":"450px"},attrs:{label:"ID"}},[i("el-input",{attrs:{disabled:!0},model:{value:t.dialogSourceId,callback:function(e){t.dialogSourceId=e},expression:"dialogSourceId"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"PIP源名称"}},[i("div",{staticStyle:{display:"flex"}},[i("el-input",{staticStyle:{"margin-right":"20px"},model:{value:t.inputSourceName,callback:function(e){t.inputSourceName=e},expression:"inputSourceName"}}),t._v(" "),i("el-button",{staticStyle:{"margin-right":"450px"},attrs:{size:"small"},on:{click:t.updateName}},[t._v("修改名称")])],1)]),t._v(" "),i("el-form-item",{attrs:{label:"URL"}},[i("div",{staticStyle:{display:"flex"}},[i("el-input",{staticStyle:{"margin-right":"20px"},attrs:{type:"textarea",autosize:{minRows:3,maxRows:7},maxlength:"1000"},model:{value:t.inputUrl,callback:function(e){t.inputUrl=e},expression:"inputUrl"}}),t._v(" "),i("el-button",{staticStyle:{height:"35px","margin-right":"50px"},attrs:{size:"small"},on:{click:t.updateUrl}},[t._v("修改URL")])],1)])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"添加",visible:t.dialogInsertVisible,width:"1000px"},on:{"update:visible":function(e){t.dialogInsertVisible=e}}},[i("el-form",{attrs:{"label-position":"right","label-width":"auto"}},[i("el-form-item",{attrs:{label:"PIP源名称"}},[i("el-input",{staticStyle:{width:"50%"},model:{value:t.insertSourceName,callback:function(e){t.insertSourceName=e},expression:"insertSourceName"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"URL"}},[i("el-input",{staticStyle:{"margin-right":"20px"},attrs:{type:"textarea",autosize:{minRows:3,maxRows:7},maxlength:"1000"},model:{value:t.insertSourceUrl,callback:function(e){t.insertSourceUrl=e},expression:"insertSourceUrl"}})],1),t._v(" "),i("br"),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.insertPipSource}},[t._v("添加")])],1)],1)],1)},a=[],r=(i("7f7f"),i("e024")),l={data:function(){return{list:null,listLoading:!0,totalCount:0,pageSize:9,currentPage:1,dialogVisible:!1,dialogInsertVisible:!1,dialogWorningVisible:!0,inputSourceName:"",insertSourceName:"",inputUrl:"",insertSourceUrl:"",dialogSourceId:-1}},created:function(){var t=this;this.listLoading=!0,r["d"]().then((function(e){t.totalCount=e.data})),r["e"](1,this.pageSize).then((function(e){t.list=e.data,t.listLoading=!1}))},methods:{updateName:function(){var t=this;r["g"](this.dialogSourceId+"",this.inputSourceName).then((function(e){t.$message({message:"修改成功",type:"success"}),t.refreshPage()}))},updateUrl:function(){var t=this;r["h"](this.dialogSourceId+"",this.inputUrl).then((function(e){t.$message({message:"修改成功",type:"success"}),t.refreshPage()}))},insertSource:function(){this.dialogInsertVisible=!0},deleteById:function(t){var e=this;this.$confirm("确认删除？").then((function(i){r["a"](t).then((function(t){e.$message({message:"删除成功",type:"success"}),e.refreshPage()}))})).catch((function(t){}))},insertPipSource:function(){var t=this,e=!0;""!==this.insertSourceName.trim()&&""!==this.insertSourceUrl.trim()||(e=!1,this.$message.error("不能有空字段!")),e&&r["f"](this.insertSourceName.trim(),this.insertSourceUrl.trim(),"PIP").then((function(e){t.$message({message:"添加成功",type:"success"}),t.insertSourceName="",t.insertSourceUrl="",t.refreshPage(),t.dialogInsertVisible=!1}))},jumpToManageDialog:function(t){this.dialogVisible=!0,this.dialogSourceId=t.id,this.inputSourceName=t.name,this.inputUrl=t.url},handleCurrentChange:function(t){this.currentPage=t,this.refreshPage()},refreshPage:function(){var t=this;r["d"]().then((function(e){t.totalCount=e.data})),r["e"](this.currentPage,this.pageSize).then((function(e){t.list=e.data,t.listLoading=!1}))}}},o=l,s=i("2877"),u=Object(s["a"])(o,n,a,!1,null,"0568b1f5",null);e["default"]=u.exports},e024:function(t,e,i){"use strict";i.d(e,"d",(function(){return r})),i.d(e,"b",(function(){return l})),i.d(e,"e",(function(){return o})),i.d(e,"c",(function(){return s})),i.d(e,"g",(function(){return u})),i.d(e,"h",(function(){return c})),i.d(e,"f",(function(){return d})),i.d(e,"a",(function(){return g}));var n=i("b775"),a="/aix/source";function r(){return Object(n["a"])({url:a+"/pip_count",method:"get"})}function l(){return Object(n["a"])({url:a+"/apt_count",method:"get"})}function o(t,e){return Object(n["a"])({url:a+"/pip_page",params:{page:t,countPerPage:e},method:"get"})}function s(t,e){return Object(n["a"])({url:a+"/apt_page",params:{page:t,countPerPage:e},method:"get"})}function u(t,e){return Object(n["a"])({url:a+"/name",data:{id:t,newName:e},method:"post"})}function c(t,e){return Object(n["a"])({url:a+"/url",data:{id:t,newUrl:e},method:"post"})}function d(t,e,i){return Object(n["a"])({url:a+"/insert",data:{name:t,url:e,type:i},method:"post"})}function g(t){return Object(n["a"])({url:a+"/delete",data:{id:t},method:"post"})}}}]);