import {axiosInstance} from "@/utils/axios";

export function createMission(data) {
  return axiosInstance.post('/api/missions', data)
}

export function getMissions(query) {
  return axiosInstance.get('/api/missions', {
    params: query
  })
}

export function getMission(id){
  return axiosInstance.get(`/api/missions/${id}`)
}

export function updateMission(id,data){
  return axiosInstance.put(`/api/missions/${id}`,data)
}