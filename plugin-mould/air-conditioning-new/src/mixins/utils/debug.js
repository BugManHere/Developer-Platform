import { mapState, mapMutations, mapActions } from 'vuex';
import updateStatus from './updateStatus'; // 自定义初始化功能，可以修改

const mixin = {
  mixins: [updateStatus],
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject
    })
  },
  mounted() {
    this.setCheckObject(this.dataObject);
    this.machineInit();
  },
  methods: {
    ...mapMutations('control', {
      setCheckObject: 'SET_CHECK_OBJECT',
      setDataObject: 'SET_DATA_OBJECT'
    }),
    ...mapActions('machine', {
      machineInit: 'INIT'
    })
  }
};

export default mixin;
