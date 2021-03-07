<template>
  <div v-if="isShow">
    <gree-picker
      class="svst-picker"
      ref="svst-picker"
      v-model="isShow"
      title="节能"
      :data="silderList"
      :describe="svstText"
      :default-index="currentIndex"
      ok-text
      cancel-text
      @confirm="confirmHandler"
    />
  </div>
</template>

<script>
import { Picker } from 'gree-ui';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
  name: 'svst-picker-popup',
  components: {
    [Picker.name]: Picker
  },
  data() {
    return {
      isShow: false,
      coolMod: [1],
      dryMod: [2],
      heatMod: [4, 6, 7]
    };
  },
  computed: {
    ...mapState('control', {
      SvStPopup: state => state.popup.SvSt,
      SvSt: state => state.dataObject.SvSt,
      CoolSvStTemMin: state => state.dataObject.CoolSvStTemMin || 18,
      HumiSvStTemMin: state => state.dataObject.HumiSvStTemMin || 18,
      HeatSvStTemMax: state => state.dataObject.HeatSvStTemMax || 18
    }),
    ...mapGetters(['modTextKey', 'modIdentifier', 'modCurrentStatusName', 'temSetVal', 'temSetJson', 'temMinVal', 'temMaxVal']),
    ...mapGetters('machine', ['statusMap']),
    // 当前模式的status
    modStatus() {
      return this.statusMap[this.modIdentifier];
    },
    // 制热和制冷不一样的配置
    silderType() {
      const value = this.modStatus ? Number(this.modStatus.status.value) : undefined;
      let result = {};
      if (this.coolMod.includes(value)) {
        result = {
          type: 'cool',
          min: 16,
          max: 30,
          default: 18,
          json: 'CoolSvStTemMin'
        };
      } else if (this.dryMod.includes(value)) {
        result = {
          type: 'dry',
          min: 16,
          max: 30,
          default: 18,
          json: 'HumiSvStTemMin'
        };
      } else if (this.heatMod.includes(value)) {
        result = {
          type: 'heat',
          min: 16,
          max: 30,
          default: 18,
          json: 'HeatSvStTemMax'
        };
      } else {
        result = {
          type: 'cool',
          min: 16,
          max: 30,
          default: 18,
          json: 'CoolSvStTemMin'
        };
      }
      return result;
    },
    // 文案
    svstTextList() {
      if (this.modCurrentStatusName === 'status_1') return ['当前模式为', '，请选择', '温度上限'];
      return ['当前模式为', '，请选择', '温度下限'];
    },
    modText() {
      return this.$language(this.modTextKey);
    },
    svstText() {
      return this.svstTextList[0] + this.modText + this.svstTextList[1] + this.modText + this.svstTextList[2];
    },
    // 滑轮配置
    silderList() {
      if (!this.silderType.type) return [[]];
      const { min, max } = this.silderType;
      const result = [];
      for (let i = min; i <= max; i += 1) {
        result.push({
          text: `${i}`,
          value: i
        });
      }
      return [result];
    },
    // 当前设置温度
    currentIndex() {
      const json = this.silderType.json;
      return [(this[json] || 18) - 16];
    }
  },
  watch: {
    SvStPopup: {
      handler(newVal) {
        this.isShow = newVal;
      },
      immediate: true
    },
    isShow(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs['svst-picker'].refresh();
        }, 10);
      } else {
        this.SetPopup({ SvSt: false });
      }
    },
    temMinVal(newVal) {
      newVal > this.temSetVal &&
        this.stateMatchineInterFace({
          data: { [this.temSetJson]: newVal }
        });
    },
    temMaxVal(newVal) {
      newVal < this.temSetVal &&
        this.stateMatchineInterFace({
          data: { [this.temSetJson]: newVal }
        });
    }
  },
  methods: {
    ...mapMutations('control', {
      SetPopup: 'SET_POPUP'
    }),
    ...mapActions({
      stateMatchineInterFace: 'STATE_MACHINE_INTERFACE'
    }),
    confirmHandler() {
      try {
        const { value } = this.$refs['svst-picker'].getColumnValues()[0];
        const { json } = this.silderType;
        this.stateMatchineInterFace({
          data: {
            [json]: value,
            SvSt: 1
          }
        });
      } catch (e) {
        e;
      }
    }
  }
};
</script>
