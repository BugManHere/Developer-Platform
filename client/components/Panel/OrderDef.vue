<template>
  <div>
    <div class="order-body" role="group">
      <transfer v-if="settingStep === 1" class="transfer-body" :optionslList="optionslList" @itemList="getOrderList"/>
      <div class="order-buttons col-md-5">
        <button type="button" class="btn btn-default btn-cancel" @click="jumpStep()">上一步</button>
        <button type="button" class="btn btn-primary btn-save" @click="settingDone">完&emsp;成</button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "@/utils";
import transfer from '@components/Transfer';
import _difference from 'lodash/difference';
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    transfer,
  },
  data() {
    return {
      constList: ['undefined', 'default'],
      isTransferShow: true,
      inputKey: {},
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.funcModule.currentFuncId,
      deviceKey: state => state.funcModule.deviceKey,
      settingStep: state => state.funcModule.settingStep,
      statusList: state => state.funcModule.statusList,
      orderList: state => state.funcModule.orderList,
      funcDefine: function getFuncDefine(state) {
        return state.funcModule.funcDefineList[state.funcModule.deviceKey];
      },
    }),
    statusListLen() {
      return this.statusList.length;
    },
    rightList() {
      const order = this.funcDefine[this.currentFuncId].order;
      return _difference(this.funcDefine[this.currentFuncId].order, this.constList);
    },
    leftList() {
      return _difference(this.statusList, [...this.rightList, ...this.constList]);
    },
    optionslList() {
      return {
        left: this.keyToName(this.leftList, 'left'),
        right: this.keyToName(this.rightList, 'right'),
        const: this.keyToName(this.constList, 'const'),
      }
    }
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE",
    }),
    jumpStep() {
      this.setFuncObject(["settingStep", 0]);
    },
    keyToName(arr, key) {
      if (!this.funcDefine.length) return {};
      switch (key) {
        case 'left':
        case 'right':
          this.inputKey[key] = arr;
          break;
        default:
          break;
      }
      return arr.map(item => {
        return this.funcDefine[this.currentFuncId].statusDefine[item].name;
      });
    },
    settingDone() {
      const orderList = ['default'].concat(this.orderList);
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.currentFuncId].order = orderList;
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.setFuncObject(["currentFuncId", false]);
      this.setFuncObject(["settingStep", 0]);
    },
    getOrderList(val) {
      const map = {};
      val.right.forEach((item, index) => {
        if (item !== -1) {
          map[item] = this.inputKey.right[index];
        }
      })
      val.left.forEach((item, index) => {
        if (item !== -1) {
          map[item] = this.inputKey.left[index];
        }
      })
      const orderList = Object.values(map);
      this.setFuncObject(['orderList', orderList]);
    }
  }
}
</script>
