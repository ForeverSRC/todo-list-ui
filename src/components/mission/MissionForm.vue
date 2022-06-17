<template>
  <el-form v-model="model.mission">
    <el-form-item label="标题">
      <el-input v-model="model.mission.title" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-select v-model="model.mission.priority" placeholder="选择优先级">
        <el-option
            v-for="(v,k) in PriorityMap"
            :key="k"
            :label="k"
            :value="v.value"
        >
          <el-tag :type="v.type">{{ k }}</el-tag>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <md-editor v-model="model.mission.detail" style="height: 70vh" :toolbars="toolbars" />
    </el-form-item>
  </el-form>
  <div>
    <el-button type="primary" @click="onCreateMission" :disabled="state.confirmBtnDisable">确认</el-button>
  </div>
  <el-divider />

</template>

<script>
export default {
  name: "MissionForm"
}
</script>

<script setup>
import {reactive} from "vue";
import {PriorityMap} from "@/constants/mission-constants";
import {toolbars} from "@/constants/md-editor-constants";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {createMission} from "@/api/mission";
import {useRouter} from "vue-router";

const router = useRouter()

const model = reactive({
  mission: {
    title: "",
    priority: null,
    detail: "",
  }
})

const state = reactive({
  confirmBtnDisable: false
})

function onCreateMission() {
  state.confirmBtnDisable = true
  createMission(model.mission).then(() => {
    router.push({name: 'mission-page'})
  }).catch(()=>{
    state.confirmBtnDisable = false
  })
}

</script>

<style scoped>

</style>