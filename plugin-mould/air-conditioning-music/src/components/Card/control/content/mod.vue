<template>
  <div class="mod-content">
    <div class="mod-content-box" ref="content" :style="isMounted && { height: modUnfold ? `${contentHeight}px` : 0 }">
      <btn-content :btn-list="btnList" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import WorkLogic from '@logic/work';
import BtnContent from './btn/index';

export default {
  mixins: [WorkLogic],
  components: {
    'btn-content': BtnContent
  },
  props: {
    modUnfold: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contentHeight: 0,
      isMounted: false,
      modStatusList: [], // 模式的顺序
      currentStatus: '', // 当前状态
      lastStatus: '' // 上一个状态,
    };
  },
  mounted() {
    const mountedTimer = setInterval(() => {
      this.contentHeight = this.$refs && this.$refs.content.clientHeight;
      if (this.contentHeight) {
        clearInterval(mountedTimer);
        this.isMounted = true;
        console.log(this.contentHeight);
      }
    }, 20);
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow
    }),
    currentModName() {
      const defined = this.btnList.find(fan => fan.key === this.currentStatus);
      const result = defined && defined.name;
      return result;
    },
    // 按钮列表
    btnList() {
      const result = this.modStatusList.map(modStatus => {
        // status定义
        const statusDefine = this.work_modDefine.statusDefine[modStatus];
        // 定义key
        const key = modStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${this.work_modIdentifier}_${statusName}`;
        const name = this.$language(`mod.${stateName}`);
        // 图标
        const icon = {
          key: statusDefine.icon.key,
          type: this.currentStatus === modStatus ? 'on' : 'off'
        };
        // 是否置灰
        const gray = !this.Pow;
        // 是否隐藏
        const hide = false;
        // 跳转页面
        const page = false;
        // 执行的函数
        const func = (modStatus, disable = false) => {
          this.changeStatus(modStatus, disable || this.currentStatus === modStatus);
        };
        return { key, name, icon, gray, hide, page, func };
      });
      return result;
    }
  },
  watch: {
    g_statusLoop: {
      handler(newVal) {
        const startStatus = 'default';
        if (!this.work_modDefine) return;
        const id = this.work_modIdentifier;
        const modLoop = newVal[id];
        if (modLoop) {
          const result = JSON.parse(JSON.stringify(newVal[id]));
          const length = result.length;
          let i = 0;
          while (result[0] !== startStatus && i < length) {
            result.push(result.shift());
            i += 1;
          }
          this.modStatusList = result;
        }
      },
      deep: true,
      immediate: true
    },
    g_statusMap: {
      handler(newVal) {
        const statusMap = newVal[this.work_modIdentifier];
        if (statusMap && this.currentStatus !== statusMap.status) {
          this.lastStatus = this.currentStatus;
          this.currentStatus = statusMap.status;
        }
      },
      immediate: true,
      deep: true
    },
    currentModName: {
      handler(newVal) {
        this.$emit('modName', newVal);
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    // 发送指令
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    changeStatus(status, isGray) {
      if (isGray) return;
      const funcDefine = this.work_modDefine;
      const statusDefine = funcDefine.statusDefine[status];
      const identifier = funcDefine.identifier;
      const currentStatus = this.currentStatus;
      const customize = statusDefine.customize;
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, status);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, status);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, status);
          }, 0);
          break;
        default:
          break;
      }
      const moreCommand = statusDefine.moreCommand;
      const json = funcDefine.json;
      const value = statusDefine.value;
      let setData = moreCommand || {};
      setData[json] = value;
      // 发送指令前缓存数据
      const dataObject = JSON.parse(JSON.stringify(this.dataObject));
      // 发送指令
      this.changeData(setData);
      this.cacheData(dataObject);
    },
    cacheData(dataObject) {
      const isCacheTem = this.g_moreOption.temCache;
      const isCacheFan = this.g_moreOption.fanCache;
      const storage = window.storage;
      const cache = (able, storageKey, jsons) => {
        if (able) {
          const data = storage.get(storageKey) || {};
          const sendData = data[this.currentStatus] || {};
          const lastData = {};
          jsons.forEach(json => {
            lastData[json] = dataObject[json] || 0;
          });
          data[this.lastStatus] = lastData;
          storage.set(storageKey, data);
          this.changeData(sendData);
        }
      };
      setTimeout(() => {
        this.$nextTick(() => {
          // 此处作了特殊处理，应该去掉感叹号
          cache(!isCacheTem, 'temSetting', ['SetTem', 'Add0.5', 'Add0.1']);
          cache(!isCacheFan, 'fanSetting', ['WdSpd', 'Tur', 'Quiet']);
        });
      }, 0);
    }
  }
};
</script>

<style lang="scss">
$fontSize: 44px;
.mod-content {
  position: relative;
  transition: all 0.5s;
  &-box {
    position: relative;
    transition: all 0.5s;
    bottom: 0;
    background-color: #fff;
    font-size: $fontSize;
    padding: 0 32px;
    .col,
    .col-25 {
      padding: 20px 0 56px 0 !important;
    }
  }
}
</style>
