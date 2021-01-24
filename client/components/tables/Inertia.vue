<template>
  <div class="gdp-inertia-table">
    <caption v-html="captionText" />
    <gdp-table :title-list="titleList" :content-array="contentArray" :output-handler="outputHandler" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import OrderDef from '@/components/popups/OrderDef.vue';
import defaultConfig from '@/mixin/Table/index';

export default {
  name: 'gdp-inertia-table',
  mixins: [defaultConfig],
  data() {
    return {
      captionText: '提示：惰性功能可参与到逻辑处理当中，一般有以下使用场景：1.已在模板中固定其布局；2.不作为布局显示。',
      editAble: true,
      currentFuncId: false
    };
  },
  computed: {
    ...mapGetters(['funcDefine_inertia']),
    imshowModels() {
      return this.funcDefine_inertia;
    },
    selectOptions() {
      const result = {};
      for (const type in this.typeDefine) {
        type.includes('inertia') && (result[type] = this.typeDefine[type]);
      }
      return result;
    },
    // 右边操作图标组
    iconOptions() {
      return [
        {
          key: 'more',
          descript: '状态定义',
          select: false,
          method: this._more
        },
        {
          key: 'disable',
          descript: '删除',
          method: this._del
        }
      ];
    }
  },
  watch: {
    currentFuncId(newVal) {
      if (Number.isInteger(newVal)) {
        this.$popup.show({
          size: 'big',
          title: (this.imshowModels && this.imshowModels.length && this.imshowModels[newVal] && this.imshowModels[newVal].name) || '',
          bottomBtns: [],
          onCancel: () => {
            this.popupSetType();
            this.$popup.hide();
          },
          componentConfig: {
            name: OrderDef.name,
            default: OrderDef,
            props: {
              model: this.imshowModels[newVal],
              currentStatusId: this.currentStatusId,
              iconArr: this.iconArr,
              outputHandler: async currentModel => {
                await this.editTempFunc(currentModel);
                this.popupSetType();
              }
            }
          }
        });
      }
    }
  },
  methods: {
    ...mapMutations({
      setTempModule: 'SET_TEMP_MODULE',
      changeTemp: 'CHANGE_TEMPLATE'
    }),
    ...mapActions({
      delTempFunc: 'DEL_TEMP_FUNC',
      editTempFunc: 'EDIT_TEMP_FUNC'
    }),
    // 选择类型
    _select(rowIndex) {
      this.changeOneModel(this.imshowModels, rowIndex);
    },
    // 状态详细定义
    _more(index, statusIndex) {
      this.popupSetType(index, statusIndex);
    },
    // 删除功能
    _del(index) {
      const realIndex = this.getRealIndex(index);
      this.$confirm.show({
        content: `确定删除<strong>[${this.contentArray[index][0].text}]</strong>吗？<br/>删除后功能即刻失效。`,
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: () => {
          this.delTempFunc(realIndex);
        }
      });
    },
    // 设置状态
    popupSetType(index = false, statusIndex = 0) {
      this.currentFuncId = index;
      this.currentStatusId = statusIndex ? statusIndex + 1 : 0;
    },
    // 处理表格输出
    outputHandler(output) {
      const funcDefine = this.deepCopy(this.funcDefine);
      const { key, rowIndex, value, type } = output;
      const index = this.getRealIndex(rowIndex);
      switch (type) {
        // 处理文本编辑事件
        case 'text':
          funcDefine[index][key] = value;
          this.changeTemp({ funcDefine });
          break;
        default:
          break;
      }
    },
    changeOneModel(models, index) {
      this.editTempFunc(models[index]);
    }
  }
};
</script>

<style lang="scss" scpoed>
.gdp-inertia-table {
  padding: 22px;
  padding-top: 0;
  > caption {
    width: 1040px;
  }
}
</style>
