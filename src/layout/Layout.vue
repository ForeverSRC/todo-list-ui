<template>
  <router-view />
  <van-tabbar route>
    <van-tabbar-item name="items" :to="{name:'item-page'}" style="border-right: #F0F2F5 solid">
      <template #icon>
        <el-icon :size="30">
          <List />
        </el-icon>
      </template>

    </van-tabbar-item>
    <van-tabbar-item name="missions" :to="{name:'mission-page'}">
      <template #icon>
        <el-icon :size="30">
          <Checked />
        </el-icon>
      </template>

    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "Layout",
}
</script>

<script setup>
import {List, Checked} from "@element-plus/icons-vue"


</script>

<style scoped>

</style>