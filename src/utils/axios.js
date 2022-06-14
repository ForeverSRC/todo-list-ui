import axios from "axios";
import {ElMessage} from "element-plus";

export const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 20000,
});

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

axiosInstance.interceptors.response.use(resp => {
  if (!resp.status || resp.status !== 200) {
    return Promise.reject(resp);
  }

  if (resp.data && resp.data.code !== 0) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: resp.data.message
    })
    return Promise.reject(resp);
  }

  return resp.data

}, error => {

  ElMessage.error({
    showClose: true,
    message: `Call service error, message: ${error.message}`
  })

  return Promise.reject(error)
})