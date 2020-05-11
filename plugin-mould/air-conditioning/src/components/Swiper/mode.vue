<template>
  <div>
    <Swiper
      :ref="ref"
      class="mode-swiper"
      :slides-data="options" 
      @realIndex="swiperChange"
      @activeIndex="setFanName"/>
    <div class="mode-name">
      <span v-text="modeName"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from '@/logic/define';
import Swiper from './index';

export default {
  components: {
    Swiper
  },
  mixins: [LogicDefine],
  data() {
    return {
      ref: 'modeSwiper',
      itemList: [],
      swiperIndex: 3,
      leftLen: 3, // 按下滑轮后左边可供显示的元素数目（为了性能考虑，不全显示）
      rightLen: 3,
      modeList: [
        {img: require('@/assets/img/mode/auto.png'), name: this.$language('mode.auto'), index: 0, key: 'Mod_auto'},
        {img: require('@/assets/img/mode/cool.png'), name: this.$language('mode.cool'), index: 1, key: 'Mod_cool'},
        {img: require('@/assets/img/mode/dry.png'), name: this.$language('mode.dry'), index: 2, key: 'Mod_dry'},
        {img: require('@/assets/img/mode/fan.png'), name: this.$language('mode.fan'), index: 3, key: 'Mod_fan'},
        {img: require('@/assets/img/mode/heat.png'), name: this.$language('mode.heat'), index: 4, key: 'Mod_heat'},
      ],
      modeName: 'auto'
    };
  },
  computed: {
    ...mapState({
      Mod: state => state.dataObject.Mod,
    }),
    imshowList() {
      const result = this.modeList.filter(item => {
        return !this.g_hideFuncArr.includes(item.key) && this.g_identifierArr.includes(item.key);
      });
      result.length || result.push({img: require('@/assets/img/pow.png'), name: '无内容', index: 0});
      return result;
    },
    options() {
      return {
        key: 'mode',
        list: this.itemList,
        isNumber: false
      };
    },
    // swiper显示的slide总数
    swiperLen() {
      return this.leftLen + this.rightLen + 1;
    },
    // 实际index
    currentIndex() {
      return this.Mod;
    },
  },
  watch: {
    currentIndex(newVal) {
      const moveLen = newVal - this.swiperIndex;
      const toIndex = this.leftLen + moveLen;
      this.setFanName(toIndex);
      this.swiperChange(toIndex);
      this.updateSwiper();
    },
  },
  mounted() {
    this.setList();
    this.updateSwiper();
    this.setFanName();
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
    // 给滑轮赋予初始区间
    setList() {
      this.swiperIndex = this.currentIndex;
      const list = [];
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const index = this.countIndex(this.swiperIndex, i);
        list.push(this.imshowList[index]);  
      }
      this.itemList = list;
    },
    // 更新滑轮的显示区间
    updateList(index) {
      const moveLen = index - this.leftLen;
      this.removeSlide(moveLen);
      this.insertSlide(moveLen);
      this.swiperIndex = this.currentIndex;
    },
    // 滑轮定位到当前位置
    updateSwiper() {
      this.$nextTick(() => {
        this.$refs[this.ref].setIndex(this.leftLen); // 定位到中间
      });
    },
    // 计算滑轮向左（右）滑动moveLen个元素后的值                                                                                                              
    countIndex(fromIndex, moveLen) {
      let toIndex = fromIndex + moveLen;
      const maxLen = this.imshowList.length;
      while (toIndex < 0) {
        toIndex += maxLen;
      } 
      while (toIndex >= maxLen) {
        toIndex -= maxLen;
      }
      return toIndex;
    },
    insertSlide(moveLen) {
      const direction = moveLen / Math.abs(moveLen); // 1：往右，-1：往左
      const funcName = direction === 1 ? 'appendSlide' : 'prependSlide';
      for (let i = 1; i <= Math.abs(moveLen); i += 1) {
        const startIndex = this.swiperIndex + direction * (direction ? this.rightLen : this.leftLen);
        const toIndex = this.countIndex(startIndex, i * direction);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imshowList[toIndex].img}></div>`);
      }
    },
    removeSlide(moveLen) {
      const direction = moveLen <= 0; // false：往右滑，true：往左滑
      const removeLen = Math.abs(moveLen) <= this.swiperLen ? Math.abs(moveLen) : this.swiperLen;
      const removeIndexList = Array.from({ length: removeLen }, (item, index) => {
        return direction ? (this.leftLen + this.rightLen) - index : index;
      }); // 需要移除的slide的Index
      this.$refs[this.ref].removeSlide(removeIndexList);
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen) return;
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      const sendData = {Mod: toIndex, Emod: 0, UDFanPort: 0};
      // toIndex === 2 && (sendData.WdSpd = 1);
      this.changeData(sendData);
      this.updateList(index);
    },
    setFanName(index) {
      if (index === undefined) {
        this.modeName = this.imshowList[this.swiperIndex].name;
        return;
      }
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      this.modeName = this.imshowList[toIndex].name;
    }
  }
};
</script>
