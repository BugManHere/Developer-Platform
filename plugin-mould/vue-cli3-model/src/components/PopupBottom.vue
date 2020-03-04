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
                class="blank-text"/>
            </div>
          </div>
          <span 
            :class="{triangle: item.page}" 
            @click="goPage(index, g_disableFuncArr.includes(item.identifier), item.page)"
            v-text="$language(`btn.${item.identifier}`)"/>
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
      const checkIdArr = []; // 需要检查的id
      const identifier = this.g_Pow; // 获取在define.js里面定义的g_Pow
      const powState = this.g_statusMap[identifier].state; // pow的当前状态
      const disableStateArr = this.g_disableMap[powState]; // 被pow禁用的State
      if (!disableStateArr) return [];
      disableStateArr.forEach(stateItem => { // 挑选出需要检查的id
        const checkId = this.g_stateToId[stateItem];
        checkIdArr.includes(checkId) || checkIdArr.push(checkId);
      });
      checkIdArr.forEach(idItem => {
        let pass = true; // 是否满足条件
        const checkOrder = this.g_funcDefineMap[idItem].order; // id对应激活的status
        checkOrder.forEach(statusItem => { // order下的所有status是否都被禁用
          const checkState = `${idItem}_${statusItem}`;
          !disableStateArr.includes(checkState) && (pass = false);
        });
        pass && result.push(idItem); // 如满足条件，记下
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
      this.setState(['watchLock', false]);
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
      const setData = this.g_NextStatusMap[identifier].setData;
      this.changeData(setData);
    },
    goPage(index, isGray, able) {
      if (isGray || !able) return;
      const { routerName, params } = this.g_funcDefine_btn[index].page;
      this.$router.push({
        name: routerName,
        params,
      });
    }
  }
};
</script>
