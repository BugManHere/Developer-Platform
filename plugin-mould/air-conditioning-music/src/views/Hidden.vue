<template>
  <div class="hidden"><component :is="hiddenComponent" @defaultFunction="setFunc" ref="sonComponent" /></div>
</template>

<script>
import { mapState } from 'vuex';
import { functionPage } from '../router';

export default {
  components: functionPage,
  data() {
    return {
      defaultFunction: () => {}
    };
  },
  computed: {
    ...mapState('control', {
      hiddenComponent: state => state.hiddenComponent
    })
  },
  methods: {
    // 从二级页面获取方法
    setFunc(fn) {
      this.defaultFunction = fn;
    },
    // 确保页面加载完毕后将方法输出
    getFunc() {
      const outTime = 3000; // 设置超时时间
      return new Promise((resolve, reject) => {
        let currentTime = 0; // 计时用
        const timeStep = 10; // 轮询间隔
        const timer = setInterval(() => {
          const ref = this.$refs.sonComponent; // 二级页面
          if (ref && ref._isMounted) {
            // 如果加载完毕,将方法输出
            resolve(this.defaultFunction);
          } else if ((currentTime += timeStep) >= outTime) {
            // 如果超时，则退出
            clearInterval(timer);
            reject('二级页面加载超时');
          }
        }, timeStep);
      });
    }
  }
};
</script>

<style></style>
