<template>
  <el-card shadow="always" class="mission-card">
    <div>
      <el-row>
        <el-col :span="6">
          <span class="mission-title">
            <el-icon color="#E6A23C" style="vertical-align: top" :size="25">
              <Collection />
            </el-icon>
            {{ mission.title }}
          </span>
        </el-col>
        <el-col :span="4">
          <el-tag :type=PriorityMap[mission.priority].type round effect="dark">
            {{ PriorityMap[mission.priority].label }}
          </el-tag>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Mission"
}
</script>

<script setup>
import {defineProps} from "vue";
import {Collection} from "@element-plus/icons-vue"
import {PriorityMap} from "@/constants/mission-constants";


defineProps({
  mission: {
    type: Object
  }
})
</script>

<style scoped>
.mission-card {
  margin-bottom: 5px;
  border: solid #F2F3F5;
}

.mission-title {
  font-weight: bold;
  font-size: large;
}
</style>