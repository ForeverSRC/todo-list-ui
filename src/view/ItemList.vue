<template>
  <el-container>
    <el-header>
      <h1 style="text-align: center">清单</h1>
    </el-header>

    <el-main>
      <el-tabs type="border-card" v-model="state.tabActiveName" @tab-change="onListTabChange">
        <el-tab-pane label="全部" name="total">
          <div v-for="(item,index) in model.items" :key="`total-${index}`">
            <Item :item="item" @itemChanged="onListTabChange(state.tabActiveName)" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="待办" name="todo">
          <div v-for="(item,index) in model.items" :key="`todo-${index}`">
            <Item :item="item" @itemChanged="onListTabChange(state.tabActiveName)" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="finished">
          <div v-for="(item,index) in model.items" :key="`finished-${index}`">
            <Item :item="item" />
          </div>
        </el-tab-pane>

        <el-divider>
          <el-button type="primary" circle :icon="Plus" @click="state.createVisible=!state.createVisible"></el-button>
        </el-divider>
      </el-tabs>

    </el-main>
  </el-container>

  <el-drawer v-model="state.createVisible" direction="btt" :size="size">
    <template #header>
      <h1>新建事项</h1>
    </template>
    <div>
      <ItemForm @createFinish="onCreateFinish" />
    </div>
  </el-drawer>

</template>

<script>
export default {
  name: "ItemList"
}
</script>

<script setup>
import Item from "@/components/item/Item"
import ItemForm from "@/components/item/ItemForm";
import {computed, onMounted, reactive} from "vue";
import {Plus} from '@element-plus/icons-vue'
import {getItemList} from "@/api/item";

const stateMap = {
  "todo": 1,
  "finished": 2,
  "total": 0
}

const model = reactive({
  items: [],
  itemQuery: {
    state: 1,
    page: 1,
    pageSize: 5

  }
})

const state = reactive({
  createVisible: false,
  tabActiveName: "total"
})

const size = computed(() => {
  return 4 * window.innerHeight.valueOf() / 5
})

function onListTabChange(name) {
  state.tabActiveName = name
  model.itemQuery.state = stateMap[name]
  getItemList(model.itemQuery).then((resp) => {
    model.items = resp.data.items
  })
}

onMounted(() => {
  onListTabChange(state.tabActiveName)
})

function onCreateFinish() {
  state.createVisible = false
  onListTabChange("todo")
}
</script>

<style scoped>

</style>