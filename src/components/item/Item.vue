<template>
  <el-card shadow="always"  class="item-card" @click.stop="showDetail">
    <div>
      <el-row>
        <el-col :xs="12" :sm="14" :md="18" :lg="19" :xl="19" :offset="1">
          <span class="item-title" :class="item.state===ItemStateFinished?'item-title-style-finished':''" >
            <el-icon color="#E6A23C" v-show="item.state===ItemStateUnFinished" style="vertical-align: top" :size="25">
              <Aim />
            </el-icon>
            <el-icon color="#67C23A" v-show="item.state===ItemStateFinished" style="vertical-align: top" :size="25">
              <CircleCheck />
            </el-icon>
            {{ item.title }}
          </span>
        </el-col>
        <el-col :xs="11" :sm="9" :md="5" :lg="4" :xl="4">
          <el-button type="success" :icon="Check" circle
                     v-if="item.state===ItemStateUnFinished" @click.stop="onFinishItem" />
          <el-button type="warning" :icon="RefreshRight" circle
                     v-if="item.state===ItemStateFinished" @click.stop="onResetItem" />
          <el-button type="danger" :icon="Delete" circle @click.stop="onDeleteItem" />
        </el-col>
      </el-row>
    </div>
    <el-collapse-transition>
      <div v-show="state.detailVisible" style="border-radius: 3px">
        <el-divider />
        <div @dblclick.stop="onEditItem" @click.stop>
          <md-editor v-if="!itemEditable" :modelValue="item.description" previewOnly class="item-detail-style" />
          <md-editor v-if="itemEditable" v-model="model.item.description" :toolbars="toolbars" />
          <el-button v-if="itemEditable" type="primary" @click.stop="confirmEditItem" :disabled="!itemEditable">确认</el-button>
          <el-button v-if="itemEditable" type="success" @click.stop="state.editable=false" >取消</el-button>
        </div>
        <el-divider />
        <el-descriptions :column="2">
          <el-descriptions-item label="创建时间">
            {{ item.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="最后修改时间">
            {{ item.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="完成时间" v-if="item.state===ItemStateFinished">
            {{ item.finishTime }}
          </el-descriptions-item>
        </el-descriptions>

      </div>
    </el-collapse-transition>
  </el-card>

</template>

<script>
export default {
  name: "Item"
}
</script>

<script setup>
import {Check, Delete, Aim, CircleCheck, RefreshRight} from '@element-plus/icons-vue'
import {reactive, defineProps, defineEmits, computed} from "vue";
import {ElCollapseTransition} from 'element-plus'
import {deleteItem, editItem, finishItem, resetItem} from "@/api/item";
import {ItemStateUnFinished, ItemStateFinished} from "@/constants/item-constants";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {toolbars} from "@/constants/md-editor-constants";

const props = defineProps({
  item: {
    type: Object
  }
})

const emit = defineEmits()

const state = reactive({
  detailVisible: false,
  editable: false
})

const itemEditable = computed(() => props.item.state === ItemStateUnFinished && state.editable)

const model = reactive({
  item: {
    description: props.item.description
  }
})

function showDetail() {
  state.detailVisible = !state.detailVisible
  if (state.detailVisible === false) {
    state.editable = false
  }
}

function onDeleteItem() {
  deleteItem(props.item.id).then(() => {
    emit('itemChanged')
  })
}

function onFinishItem() {
  finishItem(props.item.id).then(() => {
    emit('itemChanged')
  })
}

function onResetItem() {
  resetItem(props.item.id).then(() => {
    emit('itemChanged')
  })
}

function onEditItem() {
  state.detailVisible = true
  state.editable = true
}

function confirmEditItem() {
  editItem(props.item.id, model.item).then(() => {
    state.editable = false
    emit('itemChanged')
  })

}

</script>

<style scoped>
.item-card {
  margin-bottom: 5px;
  border: solid #F2F3F5;
}

.item-title {
  font-weight: bold;
  font-size: large;
}

.item-title-style-finished {
  text-decoration: line-through;
}

.item-detail-style {
  border-radius: 3px;
}
</style>