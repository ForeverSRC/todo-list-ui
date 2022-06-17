<template>
  <el-divider content-position="right">
    <el-button type="primary" circle :icon="Plus" @click="toCreateMission" />
  </el-divider>
  <div v-for="(mission,index) in model.missions" :key="`m-${index}`">
    <Mission :mission="mission" />
  </div>
</template>

<script>
export default {
  name: "MissionList"
}
</script>

<script setup>
import {onMounted, reactive} from "vue";
import Mission from "@/components/mission/Mission";
import {Plus} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {getMissions} from "@/api/mission";

const router = useRouter()

const model = reactive({
  missions: [],
  missionQuery: {
    page: 1,
    pageSize: 10

  }
})

onMounted(() => {
  getMissionList()
})

function getMissionList() {
  getMissions(model.missionQuery).then(resp => {
    model.missions = resp.data.missions
  })
}

function toCreateMission() {
  router.push({name: "mission-create"})
}


</script>

<style scoped>

</style>