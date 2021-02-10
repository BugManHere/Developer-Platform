<template>
  <div class="gdp-active-table">
    <caption v-html="captionText" />
    <gdp-table :title-list="titleList" :content-array="contentArray" :output-handler="outputHandler" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SelectPage from '@/components/popups/SelectPage.vue';
import OrderDef from '@/components/popups/OrderDef.vue';
import defaultConfig from '@/mixin/Table/index';

export default {
  name: 'gdp-active-table',
  mixins: [defaultConfig],
  data() {
    return {
      captionText: '提示：活跃功能具有额外的标识，可参与到布局当中，作为动态生成布局使用',
      editAble: true,
      currentFuncId: false
    };
  },
  computed: {
    ...mapGetters(['funcDefine_active']),
    imshowModels() {
      return this.deepCopy(this.funcDefine_active);
    },
    selectOptions() {
      const result = {};
      for (const type in this.typeDefine) {
        type.includes('active') && (result[type] = this.typeDefine[type]);
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
          key: 'page',
          descript: '插入页面',
          onDescript: '更换页面',
          method: this._insert
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
    // 插入页面
    _insert(index = false) {
      this.$popup.show({
        size: 'big',
        title: '选择页面',
        bottomBtns: [],
        onCancel: () => {
          this.popupSetType();
          this.$popup.hide();
        },
        componentConfig: {
          name: SelectPage.name,
          default: SelectPage,
          props: {
            pluginMoulds: this.productType.plugin,
            model: this.imshowModels[index],
            outputHandler: model => {
              this.editTempFunc(model);
            }
          }
        }
      });
    },
    // 删除功能
    _del(index) {
      const realIndex = this.getRealIndex(index);
      this.$confirm.show({
        content: `确定删除此功能吗？该模板对应设备的<strong style="color: rgb(128, 157, 225)">[${this.contentArray[index][0].text}]</strong>功能将会失效。`,
        confirmText: '确定',
        cancelText: '取消',
        requiredText: '我已了解，确定删除模板功能',
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
      const { key, rowIndex, value, type, drag } = output;
      let index, model;
      switch (type) {
        // 处理文本编辑事件
        case 'text':
          index = this.getRealIndex(rowIndex);
          funcDefine[index][key] = value;
          this.changeTemp({ funcDefine });
          break;
        // 处理文本编辑事件
        case 'drag':
          model = funcDefine.splice(drag.from, 1)[0];
          funcDefine.splice(drag.to, 0, model);
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
.gdp-active-table {
  padding: 22px;
  padding-top: 0;
  > caption {
    width: 1040px;
  }
}
</style>
