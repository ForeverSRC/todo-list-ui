import {axiosInstance} from "@/utils/axios";
import {ItemStateFinished, ItemStateUnFinished} from "@/constants/item-constants";

export function getItemList(query) {
  return axiosInstance.get('/api/items', {
    params: query,
  })
}

export function createItem(item) {
  return axiosInstance.post('/api/items', item)
}

export function deleteItem(id) {
  return axiosInstance.delete(`/api/items/${id}`)
}

export function finishItem(id) {
  return axiosInstance.put(`/api/items/${id}/state`, {
    state: ItemStateFinished
  })
}

export function resetItem(id) {
  return axiosInstance.put(`/api/items/${id}/state`, {
    state: ItemStateUnFinished
  })
}

export function editItem(id, data) {
  return axiosInstance.put(`/api/items/${id}`, data)
}