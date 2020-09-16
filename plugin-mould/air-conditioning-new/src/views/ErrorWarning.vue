<template>
  <error-warning-component :type="error" :errorList="errorList" :warningList="warningList" />
</template>

<script>
export default {
  components: {},
  data() {
    return {
      type: 'error', // error: 故障组件 warning: 提醒组件
      errorList: [
        // { code: 'EC', title: '记忆故障', text: '请联系售后' },
        // { code: 'EE', title: '长时间制水提醒', text: '按复位1键退出，如若再次出现请通知售后' },
        // { code: 'C5', title: '跳线帽故障', text: '请通知售后' }
      ],
      warningList: [
        // { title: '缺盐提示', text: '请添加洗碗机专用盐' },
        // // 滤芯购买链接
        // { title: '滤芯寿命将尽', text: '活性炭滤芯已经使用361天，为了您的健康，请尽快更换滤网', name: '格力商城', href: 'https://www.gree.com/' }
      ]
    };
  }
};
</script>
