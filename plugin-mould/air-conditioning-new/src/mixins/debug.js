import { mapState, mapMutations, mapActions } from 'vuex';
import updateStatus from './updateStatus'; // 自定义初始化功能，可以修改
import { Dialog } from 'gree-ui';

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
    navigator.PluginInterface = navigator.PluginInterface || {};
    navigator.PluginInterface.showConfirm = (title, content, callback) => {
      const onConfirm = () => {
        callback(1);
      };
      const onCancel = () => {
        callback(0);
      };
      const onHide = onCancel;
      Dialog.confirm({ title, content, onConfirm, onCancel, onHide });
    };
  },
  methods: {
    ...mapMutations('control', {
      setCheckObject: 'SET_CHECK_OBJECT'
    }),
    ...mapActions('machine', {
      machineInit: 'INIT'
    })
  }
};

export default mixin;
