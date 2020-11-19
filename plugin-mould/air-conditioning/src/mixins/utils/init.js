// 根据实际业务修改
import { mapActions } from 'vuex';
import updateStatus from './updateStatus';

const mixin = {
  mixins: [updateStatus],
  created() {
    this.init();
  },
  methods: {
    ...mapActions({ init: 'INIT' })
  }
};

export default mixin;
