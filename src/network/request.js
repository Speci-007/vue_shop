import axios from 'axios'



const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000
})

//拦截器
instance.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token")//这里是根据api文档要求，需要携带请求令牌
// 只有携带authorization 服务器才回响应
    return config
}, err => {
  // console.log(err);
})

export default instance













