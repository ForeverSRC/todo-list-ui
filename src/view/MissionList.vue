<template>
  <el-divider content-position="right">
    <el-button type="danger" circle :icon="SortUp" v-show="model.missionQuery.descending" @click="changeRanking" />
    <el-button type="warning" circle :icon="SortDown" v-show="!model.missionQuery.descending" @click="changeRanking" />
    <el-button type="primary" circle :icon="Plus" @click="toCreateMission" />
    <el-button type="success" circle :icon="RefreshRight" @click="refresh" />
  </el-divider>
  <div style="overflow: auto;height: 80vh;padding: 5px">
    <ul v-infinite-scroll="getMissionList" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="400">
      <li v-for="(mission,index) in model.missions" :key="`m-${index}`">
        <Mission :mission="mission" @click="router.push({name:'mission-detail',params:{mid:mission.id}})"/>
      </li>
    </ul>
    <el-divider>
      <el-icon>
        <Loading v-if="state.loading" />
        <Checked v-if="state.noMore" />
      </el-icon>
    </el-divider>
  </div>


</template>

<script>
export default {
  name: "MissionList"
}
</script>

<script setup>
import {computed, reactive} from "vue";
import Mission from "@/components/mission/Mission";
import {Plus, RefreshRight, Loading, Checked, SortUp, SortDown} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {getMissions} from "@/api/mission";

const router = useRouter()

const model = reactive({
  missions: [],
  missionQuery: {
    page: 1,
    pageSize: 5,
    descending: false,
  }
})

const state = reactive({
  loading: false,
  noMore: false,

})

const disabled = computed(() => state.loading || state.noMore)

function getMissionList() {
  state.loading = true
  getMissions(model.missionQuery).then(resp => {
    state.noMore = resp.data.noMore
    model.missions.push(...resp.data.missions)
    model.missionQuery.page++
    state.loading = false
  }).catch(() => {
    state.noMore = true
    state.loading = false
  })
}

function toCreateMission() {
  router.push({name: "mission-create"})
}

function refresh() {
  model.missions = []
  model.missionQuery.page = 1
  state.noMore = false
}

function changeRanking() {
  model.missionQuery.descending = !model.missionQuery.descending
  refresh()
}


</script>

<style scoped>

</style>