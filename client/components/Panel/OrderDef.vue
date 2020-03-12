<template>
  <div>
    <div class="order-body" role="group">
      <caption>惰性状态：不参与互斥（禁用），不主动跳转到此状态<br/>
      活跃状态：参与互斥（禁用），可<strong>按照排列顺序</strong>主动跳转到此状态（由上往下）</caption>
      <div class="row">
        <div class="col">
          <h3>惰性状态</h3>
          <draggable class="list-group" :list="leftList" group="people">
            <div
              class="list-group-item"
              v-for="(element, index) in leftList"
              :key="index"
              v-text="element.name"
            />
          </draggable>
        </div>
        <div class="col">
          <h3>活跃状态</h3>
          <draggable class="list-group" :list="rightList" group="people">
            <div
              class="list-group-item"
              v-for="(element, index) in rightList"
              :key="index"
              v-text="element.name"
            />
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { deepCopy } from "@/utils";
import _difference from 'lodash/difference';
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    draggable
  },
  data() {
    return {
      constKeys: ['default', 'undefined'], // 固定的状态
      leftList: [], // 左边List
      rightList: [], // 右边List
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.funcModule.currentFuncId,
      deviceKey: state => state.funcModule.deviceKey,
      statusSetStep: state => state.funcModule.statusSetStep,
      currentStatusList: state => state.funcModule.currentStatusList,
      activeStatusList: state => state.funcModule.activeStatusList,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
  },
  mounted() {
    // 填入左边List
    const leftListKeys = _difference(this.currentStatusList, [...this.activeStatusList, ...this.constKeys]); // 所有的状态 - 活跃的状态 - 固定的状态 = 惰性状态
    this.leftList = leftListKeys.map(key => {
      return {
        name: this.funcDefine[this.currentFuncId].statusDefine[key].name, // 利用key获取状态名称
        key
      };
    });
    // 填入右边List
    this.rightList = this.activeStatusList.map(key => {
      return {
        name: this.funcDefine[this.currentFuncId].statusDefine[key].name, // 利用key获取状态名称
        key
      };
    });
  },
  methods: {
    ...mapMutations({
      setFuncModule: "SET_FUNC_MODULE",
    }),
    ...mapActions({
      editFunc: "EDIT_FUNC",
    }),
    settingDone() {
      // 根据右边List生成order
      const order = this.rightList.map(item => {
        return item.key;
      });
      // 深复制funcDefine
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.currentFuncId].order = order;
      // 改变state里的funcDefine
      this.editFunc({
        index: this.currentFuncId,
        key: this.deviceKey,
        funcDefine: JSON.stringify(funcDefine)
      })
      // 设置完成，数据初始化
      this.setFuncModule(["currentFuncId", false]);
      this.setFuncModule(["statusSetStep", 0]);
      this.setFuncModule(["activeStatusList", null]);
    }
  }
}
</script>
