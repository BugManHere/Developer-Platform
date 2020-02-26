<template>
  <gree-popup 
    v-model="showPopup" 
    position="bottom">
    <div class="popup-bottom">
      <div 
        class="arrow-down" 
        @touchend.stop="hidePopUpDemo" />
      <gree-row v-if="g_funcDefine_btn">
        <gree-col
          v-for="(item, index) in g_funcDefine_btn"
          :class="{
            'set-gray': g_disableFuncArr.includes(item.identifier),
            'set-hide': powDisableArr.includes(item.identifier)
          }"
          :key="index"
          width="25"
        >
          <div
            class="icon"
            @click="changeStatus(item.identifier, g_disableFuncArr.includes(item.identifier))"
          >
            <img 
              v-if="imgList[index].img" 
              :src="imgList[index].img" />
            <div 
              v-else 
              class="blank-btn">
              <img src="@/assets/img/functionBtn/blank.png" />
              <span 
                v-html="imgList[index].text" 
                class="blank-text" />
            </div>
          </div>
          <span>{{ $language(`btn.${item.identifier}`) }}</span>
        </gree-col>
      </gree-row>
    </div>
  </gree-popup>
</template>

<script>
import { Row, Col, Popup } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import PopupConfig from '@/mixins/config/popup.js';
import LogicDefine from '@/logic/define';
import LogicWatch from '@/logic/watch';
import Customize from '@/logic/customize';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup
  },
  mixins: [PopupConfig, LogicDefine, LogicWatch, Customize],
  data() {
    return {
      showPopup: false
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow
    }),
    imgList() {
      if (!this.g_funcDefine_btn) return [];
      const result = [];
      this.g_funcDefine_btn.forEach(item => {
        const id = item.identifier;
        const statusName = this.g_statusMap[id].define.name;
        const map = {};
        // 如果有图片就显示图片，没有图片就显示文字
        try {
          map.img = require(`@/assets/img/functionBtn/${item.name}_${statusName}.png`);
        } catch (err) {
          map.text = `${item.name}<br/>${statusName}`;
        }
        result.push(map);
      });
      return result;
    },
    /**
     * @description 开关机下禁用的图标
     * @return Array
     */
    powDisableArr() {
      const result = [];
      const identifier = this.g_Pow;
      Object.keys(this.g_disableMap).forEach(item => {
        if (this.g_stateToId[item] === identifier) {
          const currentState = this.g_statusMap[identifier].state;
          this.g_disableMap[item].forEach(stateItem => {
            let pass = true;
            const targetId = this.g_stateToId[stateItem];
            const targetOrder = this.g_funcDefineMap[targetId].order;
            targetOrder.forEach(statusItem => {
              const targetState = `${targetId}_${statusItem}`;
              !this.g_disableMap[item].includes(targetState) && (pass = false);
            });
            pass && currentState === item && result.push(this.g_stateToId[stateItem]);
          });
        }
      });
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    hidePopUpDemo() {
      this.showPopup = false;
    },
    changeStatus(identifier, isGray) {
      if (isGray) return;
      const customize = this.g_NextStatusMap[identifier].customize;
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, this.g_NextStatusMap[identifier].status);
          return;
        case 'before':
          this.customizeFunc(identifier, this.g_NextStatusMap[identifier].status);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, this.g_NextStatusMap[identifier].status);
          }, 0);
          break;
        default:
          break;
      }
      this.setState(['watchLock', false]);
      const setData = this.g_NextStatusMap[identifier].setData;
      this.changeData(setData);
    }
  }
};
</script>
