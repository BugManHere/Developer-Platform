<template>
  <gree-popup 
    v-model="showPopup" 
    position="bottom">
    <div class="mod-popup-bottom">
      <div class="popup-title" v-text="title"/>
      <div class="popup-buttons">
        <gree-row>
          <gree-col v-for="(btn, index) in imgList" :key="index" width="25" @touchend.native="setMod(btn.val)">
            <!-- 图标 -->
            <div class="iconfont" v-html="btn.icon" :class="{select: btn.val === Mod}">
            </div>
            <!-- 名称 -->
            <span v-text="btnName[index]"/>
          </gree-col>
        </gree-row>
      </div>
    </div>
  </gree-popup>
</template>

<script>
import { Row, Col, Popup } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from '../logic/define';
import LogicWatch from '../logic/watch';
import Customize from '../logic/customize';
// import {
//   showLoading,
// } from '../../../../../PluginInterface';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup
  },
  mixins: [LogicDefine, LogicWatch, Customize],
  data() {
    return {
      showPopup: false,
      title: '模式',
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
    }),
    imgList() {
      const result = [
        { icon: '&#xe66f;', val: 1},
        { icon: '&#xe66d;', val: 4},
        { icon: '&#xe68d;', val: 3},
        { icon: '&#xe674;', val: 2},
        { icon: '&#xe670;', val: 0},
      ]
      return result;
    },
    btnName() {
      const result = ['制冷', '制热', '送风', '除湿', '自动'];
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
    }),
    setMod(Mod) {
      this.setDataObject({Mod});
    }
  }
};
</script>
