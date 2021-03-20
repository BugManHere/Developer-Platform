<template>
  <div class="main-popup" v-changeHeight:main-popup-box="forceUpdate">
    <div class="main-popup-box" ref="main-popup-box" v-fixSrcollTop:page-content="currentMainBtnIndex">
      <!-- 箭头 -->
      <div class="main-popup-box-arrow" v-show="currentMainBtnIndex !== -1">
        <div class="main-popup-box-arrow-item" :style="{ left: `${currentMainBtnIndex * 25}%` }" />
      </div>
      <keep-alive>
        <component
          v-if="initComponent || (componentMap[currentMainPopup] && componentMap[currentMainPopup].keep)"
          :is="initComponent || componentMap[currentMainPopup].name"
          class="main-popup-box-component"
          ref="main-popup-box-component"
          @updateHeight="updateBoxHeight"
        />
      </keep-alive>
      <component
        v-if="initComponent || (componentMap[currentMainPopup] && !componentMap[currentMainPopup].keep)"
        :is="initComponent || componentMap[currentMainPopup].name"
        class="main-popup-box-component"
        ref="main-popup-box-component"
        @updateHeight="updateBoxHeight"
      />
    </div>
  </div>
</template>

<script>
import TimerSet from '@/components/TimerSet';
import WindSet from '@/components/WindSet/index';
import ModSet from '@/components/ModSet';
import { mapGetters } from 'vuex';
export default {
  name: 'main-popup',
  components: {
    [TimerSet.name]: TimerSet,
    [WindSet.name]: WindSet,
    [ModSet.name]: ModSet
  },
  data() {
    return {
      componentMap: {
        TimerSet: {
          name: 'timer-set-group',
          keep: true,
          init: true
        },
        FanSet: {
          name: 'wind-set-group',
          keep: false
        },
        ModSet: {
          name: 'mod-set-group',
          keep: false
        }
      },
      componentType: false,
      forceUpdate: false,
      initComponent: null
    };
  },
  computed: {
    ...mapGetters(['mainBtnDefine', 'mainPopupDefine', 'mainPopupCurrentStatusName']),
    currentMainPopup() {
      const { statusDefine } = this.mainPopupDefine;
      return statusDefine[this.mainPopupCurrentStatusName] && statusDefine[this.mainPopupCurrentStatusName].value;
    },
    mainBtnOrder() {
      return this.mainBtnDefine.map(mainBtn => mainBtn.identifier);
    },
    currentMainBtnIndex() {
      return this.mainBtnOrder.findIndex(order => order === this.currentMainPopup);
    }
  },
  created() {
    for (const key in this.componentMap) {
      if (Object.hasOwnProperty.call(this.componentMap, key)) {
        const componentObj = this.componentMap[key];
        if (componentObj && componentObj.init) {
          this.initComponent = componentObj.name;
          this.$nextTick(() => {
            this.initComponent = null;
          });
        }
      }
    }
  },
  watch: {
    forceUpdate(newVal) {
      newVal && (this.forceUpdate = false);
    }
  },
  methods: {
    updateBoxHeight() {
      this.forceUpdate = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-popup {
  &-box {
    position: relative;
    $arrowHeight: 36px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-arrow {
      $arrowWidth: 64px;
      position: relative;
      top: 0;
      height: $arrowHeight;
      width: calc(100vw - #{$arrowWidth});
      &-item {
        position: absolute;
        margin-left: 12.5%;
        transform: translateX(-50%);
        transition: left 0.5s;
        width: 0;
        height: 0;
        border-left: $arrowWidth / 2 solid transparent;
        border-right: $arrowWidth / 2 solid transparent;
        border-bottom: calc(#{$arrowHeight} + 4px) solid rgb(243, 248, 255);
      }
    }
  }
}
</style>
