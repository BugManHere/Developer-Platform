// 根据实际业务修改
import { INIT } from '@/store/types';
import { mapActions } from 'vuex';
import updateStatus from './updateStatus';

const mixin = {
  mixins: [updateStatus], // 该mixin自定义初始化时检测故障等功能，需更改
  created() {
    /**
     *  @description 初始化，并将小卡片传进来的值赋予 state
     */
    this.init();
  },
  methods: {
    ...mapActions({
      init: INIT
    })
  }
};

export default mixin;
