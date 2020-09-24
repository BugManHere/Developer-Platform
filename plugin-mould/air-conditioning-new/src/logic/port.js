import { mapState } from 'vuex';

const LogicPort = {
  data() {
    return {
      g_inputMap: {}
    };
  },
  watch: {
    dataObject: {
      handler(newVal) {
        this.g_inputMap = newVal;
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject
    })
  }
};

export default LogicPort;
