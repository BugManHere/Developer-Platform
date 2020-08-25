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

      statusMap: {},
      statusToName: {},
      diagram: null,
      nodeDataArray: [
        {key: "iscroll容器-1", name: "iscroll容器-1", compId: "111", color: "pink", cursor: "grab",loc: "0 0"},
        {key: "iscroll容器-2", name: "iscroll容器-1", compId: "222", color: "pink", cursor: "grab",loc: "0 -100"},
      ],
      relation: [
        {from: "111", fromNodeType: "component", to: "222", toNodeType: "event"},
      ]
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.tempModule.currentFuncId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      funcDefine: (state, getters) => getters.funcDefine,

      currentStatusList: state => state.tempModule.currentStatusList,
      activeStatusList: state => state.tempModule.activeStatusList,
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
      setTempModule: "SET_TEMP_MODULE",
      setPulicModule: "SET_PULIC_MODULE",
    }),
    ...mapActions({
      editTempFunc: "EDIT_TEMP_FUNC",
    }),
    async settingDone() {
// 根据右边List生成order
      const order = this.rightList.map(item => {
        return item.key;
      });
      // 深复制funcDefine
      const subFuncDefine = deepCopy(this.funcDefine[this.currentFuncId]);
      subFuncDefine.order = order;
      await this.editTempFunc(subFuncDefine);
      // 设置完成，数据初始化
      this.setTempModule(["currentFuncId", false]);
      this.setTempModule(["activeStatusList", null]);
      this.setPulicModule(["statusSetStep", 0]);
    },
  }
}
</script>
