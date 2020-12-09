// 根据实际业务修改
import { mapActions, mapMutations } from 'vuex';
import updateStatus from './updateStatus';
import { types } from '@/store/types';

const mixin = {
  mixins: [updateStatus], // 该mixin自定义初始化时检测故障等功能，需更改
  created() {
    /**
     *  @description 初始化，并将小卡片传进来的值赋予 state
     */
    this.controlInit();
    this.machineInit();
    // this.getVirtualData();
  },
  methods: {
    ...mapMutations({
      // setDataObject: types.SET_DATA_OBJECT,
      // setCheckObject: types.SET_CHECK_OBJECT
    }),
    ...mapActions({
      controlInit: types.CONTROL_INIT,
      machineInit: types.MACHINE_INIT
    })
    // 虚拟体验数据
    // getVirtualData() {
    //   const Pow = sessionStorage.getItem(`isRun_${process.env.VUE_APP_MID}`);
    //   const Mod = sessionStorage.getItem(`mode_${process.env.VUE_APP_MID}`);
    //   this.setDataObject({ Pow, Mod });
    //   this.setCheckObject({ Pow, Mod });
    // }
  }
};

export default mixin;
