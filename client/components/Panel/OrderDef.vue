<template>
  <div>
    <div class="order-body" role="group">
      <transfer v-if="statusSetStep === 1" class="transfer-body" :optionslList="optionslList" @itemList="getOrderList"/>
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
      statusSetStep: state => state.funcModule.statusSetStep,
      allStatusList: state => state.funcModule.allStatusList,
      selectStatusList: state => state.funcModule.selectStatusList,
      orderList: state => state.funcModule.orderList,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
    rightList() {
      // return _difference(this.funcDefine[this.currentFuncId].order, this.constList);
      console.log(this.selectStatusList);
      return this.selectStatusList.concat();
    },
    leftList() {
      return _difference(this.allStatusList, [...this.rightList, ...this.constList]);
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
      setFuncDefine: "SET_FUNC_DEFINE"
    }),
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
        console.log(arr);
        console.log(item);
        return this.funcDefine[this.currentFuncId].statusDefine[item].name;
      });
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
      console.log(orderList);
    },
    settingDone() {
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.currentFuncId].order = this.orderList;
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.setFuncObject(["currentFuncId", false]);
      this.setFuncObject(["statusSetStep", 0]);
      this.setFuncObject(["selectStatusList", null]);
    }
  }
}
</script>
