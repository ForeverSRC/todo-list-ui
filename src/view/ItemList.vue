<template>
  <el-container>
    <el-header>
      <h1 style="text-align: center">清单</h1>
    </el-header>

    <el-main>
      <el-divider content-position="right">
        <el-button type="primary" circle :icon="Plus" @click="state.createVisible=!state.createVisible" />
        <el-button type="success" circle :icon="RefreshRight" @click="refresh" />
      </el-divider>
      <el-tabs type="border-card" v-model="state.tabActiveName" @tab-change="onListTabChange">
        <el-tab-pane label="全部" name="total">
          <div style="overflow: auto;height: 70vh;padding: 5px">
            <ul v-infinite-scroll="getItems" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="400">
              <li v-for="(item,index) in model.items" :key="`total-${index}`">
                <Item :item="item" @itemChanged="refresh" />
              </li>
            </ul>
            <el-divider>
              <el-icon >
                <Loading v-if="state.loading" />
                <List v-if="state.noMore" />
              </el-icon>
            </el-divider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待办" name="todo">
          <div style="overflow: auto;height: 80vh;padding: 5px">
            <ul v-infinite-scroll="getItems" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="400">
              <li v-for="(item,index) in model.items" :key="`todo-${index}`">
                <Item :item="item" @itemChanged="refresh" />
              </li>
            </ul>
            <el-divider>
              <el-icon >
                <Loading v-if="state.loading" />
                <List v-if="state.noMore" />
              </el-icon>
            </el-divider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="finished">
          <div style="overflow: auto;height: 80vh;padding: 5px">
            <ul v-infinite-scroll="getItems" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="400">
              <li v-for="(item,index) in model.items" :key="`finished-${index}`">
                <Item :item="item" @itemChanged="refresh" />
              </li>
            </ul>
            <el-divider>
              <el-icon >
                <Loading v-if="state.loading" />
                <List v-if="state.noMore" />
              </el-icon>
            </el-divider>
          </div>
        </el-tab-pane>
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
import {computed, reactive} from "vue";
import {Plus, RefreshRight, Loading, List} from '@element-plus/icons-vue'
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
  tabActiveName: "total",
  loading: false,
  noMore: false
})

const disabled = computed(() => state.loading || state.noMore)

const size = computed(() => {
  return 4 * window.innerHeight.valueOf() / 5
})

function onListTabChange(name) {
  state.tabActiveName = name
  refresh()
}

function refresh() {
  model.items = []
  model.itemQuery.page = 1
  state.noMore = false
  getItems()
}

function getItems() {
  state.loading = true
  model.itemQuery.state = stateMap[state.tabActiveName]
  getItemList(model.itemQuery).then((resp) => {
    state.noMore = resp.data.noMore
    model.items.push(...resp.data.items)
    model.itemQuery.page++
    state.loading = false
  }).catch(() => {
    state.noMore = true
    state.loading = false
  })
}

function onCreateFinish() {
  state.createVisible = false
  state.tabActiveName = "todo"
}


</script>

<style scoped>

</style>