<template>
  <el-form :model="model.item">
    <el-form-item label="事项">
      <el-input v-model="model.item.title" />
    </el-form-item>
    <el-form-item label="描述">
      <md-editor v-model="model.item.description" style="height: 50vh" :toolbars="toolbars" />
    </el-form-item>
  </el-form>
  <div>
    <el-button type="primary" @click="confirmCreateItem" :disabled="state.confirmBtnDisable">确认</el-button>
  </div>
</template>

<script>
export default {
  name: "ItemForm"
}
</script>

<script setup>
import {reactive,defineEmits} from "vue";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {createItem} from "@/api/item";
import {ElMessage} from "element-plus";
import {toolbars} from "@/constants/md-editor-constants";

const model = reactive({
  item: {
    title: "",
    description: ""
  }
})

const state = reactive({
  confirmBtnDisable: false
})

const emit=defineEmits()



function confirmCreateItem() {
  state.confirmBtnDisable = true
  createItem(model.item).then(() => {
    emit('createFinish')
    ElMessage({
      showClose: true,
      type: 'success',
      message: 'create success',
      onClose:()=>{
        state.confirmBtnDisable = false
      }
    })
  })
}
</script>

<style scoped>

</style>