import { mapState } from 'vuex';

const LogicPort = {
  data() {
    return {
      g_inputMap: {},
      g_Pow: 'Pow', // 开关的identifier
      g_Mod: 'Mod', // 模式的identifier
      g_Fan: 'WdSpd', // 风档的identifier
    };
  },
  watch: {
    dataObject: {
      handler(newVal) {
        this.g_inputMap = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
    })
  },
};

export default LogicPort;
