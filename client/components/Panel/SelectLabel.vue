<template>
  <div class="select-label">
    <div class="panel-body">
      <!-- 全选按钮 -->
      <div class="btn-all">
        <div class="edit-check"
        :class="{ checking: isAllSelect }"
        @click="selectItem('all')">
        </div>
        <span v-text="'全选'"/>
      </div>
      <!-- 标签 -->
      <div class="label-group">
        <div v-for="(item, index) in this.labelList" :key="index">
          <div class="label-item" :class="{select: selectType[index]}" @click="selectItem(index)" v-text="item.name"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils';
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      selectType: [],
    }
  },
  watch: {
    labelList: {
      handler(newVal) {
        if (!newVal) return;
        this.updateSelect(newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      deviceKey: state => state.funcModule.deviceKey,
      selectPanel: state => state.funcModule.selectPanel,
      selectLabel: state => state.funcModule.selectLabel,
      labelList: (state, getters) => getters.labelList,
    }),
    isAllSelect() {
      return !this.selectType.some(item => {
        return item === false;
      })
    },
    selectSide() {
      return ['col', 'row'][this.selectPanel];
    }
  },
  methods: {
    ...mapMutations({
      setFuncModule: "SET_FUNC_MODULE",
    }),
    selectItem(index) {
      if (index === 'all') {
        this.selectType = Array(this.selectType.length).fill(!this.isAllSelect);
      } else {
        this.$set(this.selectType, index, !this.selectType[index]);
      }
    },
    updateSelect(labelList=this.labelList) {
      const selectLabel = deepCopy(this.selectLabel);
      const val = selectLabel[this.selectSide];
      if (val.length) {
        this.selectType = selectLabel[this.selectSide];
      } else {
        this.selectType = Array(labelList.length).fill(false);
      }
    },
    commitSelect() {
      const selectLabel = deepCopy(this.selectLabel);
      selectLabel[this.selectSide] = this.selectType.concat();
      this.setFuncModule(['selectLabel', selectLabel]);
    }
  },
}
</script>
