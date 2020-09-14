import axios from 'axios';
import qs from 'qs';

axios.defaults.timeout = 5000; // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头

axios.defaults.baseURL = `${process.env.VUE_APP_SERVE_URL}:3000`; // 配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined' && window.myvm) {
      const vm = window.myvm;
      vm.$loading.show();
    }
    //在发送请求之前做某件事
    if (config.method === 'post') {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    console.log('错误的传参');
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    if (window && window.myvm) {
      const vm = window.myvm;
      vm.$loading.hide();
    }
    //对响应数据做些事
    if (!res.data.success) {
      return Promise.resolve(res);
    }
    return res;
  },
  error => {
    if (window && window.myvm) {
      const vm = window.myvm;
      vm.$loading.hide();
      if (error.response && error.response.data) {
        vm.$toast.error(error.response.data);
        error.response.status === 403 && vm.$router.push('/Account/Login');
      } else {
        vm.$toast.error('网络异常');
      }
    }
    return Promise.reject(error);
  }
);

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    const eleToken = localStorage.getItem('eleToken');
    let token = '';
    eleToken && (token = eleToken.split('Bearer ')[1]);
    axios
      .post(url, { ...params, token })
      .then(
        response => {
          resolve(response);
        },
        error => {
          reject(error);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
//返回一个Promise(发送get请求)
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    const eleToken = localStorage.getItem('eleToken');
    let token = '';
    eleToken && (token = eleToken.split('Bearer ')[1]);
    axios
      .get(url, { params: { ...param, token } })
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
export default {
  fetchPost,
  fetchGet
};
