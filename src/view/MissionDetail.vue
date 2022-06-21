<template>
  <el-card>
    <el-skeleton animated :loading="state.pageLoading">
      <template #template>
        <el-skeleton-item variant="h1" />
        <el-divider />
        <el-skeleton-item variant="text" />
      </template>
      <template #default>
        <span style="font-size: xx-large;font-weight: bold" v-show="!state.missionEdit" @dblclick="editMission">
          <el-icon color="#E6A23C" style="vertical-align: middle" :size="25">
          <Collection />
          </el-icon>
         {{ model.mission.title }}
        </span>
        <el-input v-model="model.missionValue.title" v-show="state.missionEdit" />
        <el-divider />

        <h2>任务信息</h2>
        <el-descriptions border :column="1">
          <el-descriptions-item label="优先级">
            <el-tag :type=PriorityMap[model.mission.priority].type round effect="dark" v-show="!state.missionEdit" @dblclick="editMission">
              {{ PriorityMap[model.mission.priority].label }}
            </el-tag>
            <el-select v-model="model.missionValue.priority" placeholder="选择优先级" v-show="state.missionEdit">
              <el-option
                  v-for="(v,k) in PriorityMap"
                  :key="k"
                  :label="v.label"
                  :value="v.value"
              >
                <el-tag :type="v.type" round effect="dark">{{ v.label }}</el-tag>
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="完成进度">
            <el-progress :text-inside="true" :percentage="missionProgress" :stroke-width="20" style="text-align: center">
              <span >{{model.mission.finishedItems}}/{{model.mission.totalItems}}</span>
            </el-progress>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ model.mission.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ model.mission.updateTime }}
          </el-descriptions-item>
        </el-descriptions>


        <h2>任务详细</h2>
        <el-divider />
        <md-editor :model-value="model.mission.detail" preview-only v-show="!state.missionEdit" @dblclick="editMission" />
        <div v-show="state.missionEdit">
          <md-editor v-model="model.missionValue.detail" :toolbars="toolbars" />
          <div style="margin-top: 5px;">
            <el-button type="primary" @click="updateMissionInfo">确认修改</el-button>
            <el-button type="success" @click="editDetailCancel">取消</el-button>
          </div>

        </div>

        <el-divider />

        <h2>关联事项</h2>
        <div style="border:1px solid #EBEDF0">
          <el-empty v-if="model.mission.items===null||model.mission.items.length===0" />
          <ul>
            <li v-for="(item,index) in model.mission.items" :key="`m-${index}`">
              <Item :item="model.mission.itemDetails[item]" @itemChanged="refresh" />
            </li>
          </ul>
          <el-divider>
            <el-button circle :icon="Plus" type="primary" @click="state.itemAddVisible=true" />
          </el-divider>

        </div>

      </template>
    </el-skeleton>

  </el-card>
  <el-drawer v-model="state.itemAddVisible" direction="btt" :size="drawerSize">
    <template #header>
      <h1>添加事项</h1>
    </template>
    <div>
      <el-radio-group v-model="model.addItemReq.addType">
        <el-radio :label="1">添加现有未完成事项</el-radio>
        <el-radio :label="2">创建新事项</el-radio>
      </el-radio-group>
      <el-divider />
      <el-select v-model="model.addItemReq.itemId"
                 v-show="model.addItemReq.addType===1"
                 @visible-change="getUnfinishedItemList"
                 no-data-text="无待办事项"
                 placeholder="请选择待办事项"
                 clearable>
        <el-option v-for="(item,index) in model.unfinishedItems"
                   :key="`ui-${index}`"
                   :label="item.title"
                   :value="item.id" />
      </el-select>
      <el-form :model="model.addItemReq.itemInfo" v-show="model.addItemReq.addType===2">
        <el-form-item label="事项">
          <el-input v-model="model.addItemReq.itemInfo.title" />
        </el-form-item>
        <el-form-item label="描述">
          <md-editor v-model="model.addItemReq.itemInfo.description" style="height: 50vh" :toolbars="toolbars" />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-button type="primary" @click="addItemToMission">确认</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "MissionDetail"
}
</script>

<script setup>
import {onMounted, reactive, computed} from "vue";
import {addItem, getMission, updateMission} from "@/api/mission";
import {useRoute} from "vue-router";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {PriorityMap} from "@/constants/mission-constants";
import {Collection, Plus} from "@element-plus/icons-vue";
import Item from "@/components/item/Item";
import {toolbars} from "@/constants/md-editor-constants";
import {getItemList} from "@/api/item";

const route = useRoute()

const model = reactive({
  mission: {},
  missionValue: {
    detail: "",
    priority: null,
    title: ""
  },
  unfinishedItems: [],
  addItemReq: {
    addType: 1,
    itemId: "",
    itemInfo: {
      title: "",
      description: ""
    }
  }
})

const state = reactive({
  pageLoading: true,
  missionEdit: false,
  itemAddVisible: false,
})

const missionProgress = computed(() => {
  if (model.mission.totalItems === 0) {
    return 100
  }

  return 100 * model.mission.finishedItems / model.mission.totalItems
})

const drawerSize = computed(() => {
  return 4 * window.innerHeight.valueOf() / 5
})

onMounted(() => {
  refresh()
})

function copyValue() {
  model.missionValue.detail = model.mission.detail
  model.missionValue.title = model.mission.title
  model.missionValue.priority = model.mission.priority
}

const refresh = () => {
  state.pageLoading = true
  let id = route.params.mid

  getMission(id).then(resp => {
    model.mission = resp.data.mission
    state.pageLoading = false
    copyValue()
  }).catch(() => {
    state.pageLoading = false
  })

}

function editMission() {
  state.missionEdit = true
}

function editDetailCancel() {
  state.missionEdit = false
}

function updateMissionInfo() {
  let id = route.params.mid

  updateMission(id, model.missionValue).then(() => {
    state.missionEdit = false
    refresh()
  })
}

const getUnfinishedItemList = async (visible) => {
  if (visible) {
    let query = {
      state: 1,
      page: 1,
      pageSize: 10
    }
    model.unfinishedItems = []
    let noMore = false
    while (!noMore) {
      await getItemList(query).then(resp => {
        model.unfinishedItems.push(...resp.data.items)
        noMore = resp.data.noMore
        query.page++
      }).catch(() => {
        noMore = true
      })
    }
  }

}

function addItemToMission() {
  let id = route.params.mid
  let req = {
    addType: model.addItemReq.addType
  }
  if (model.addItemReq.addType === 1) {
    req.itemId = model.addItemReq.itemId
  } else {
    req.itemInfo = model.addItemReq.itemInfo
  }
  addItem(id, req).then(() => {
    refresh()
    state.itemAddVisible = false
  })
}


</script>

<style scoped>

</style>