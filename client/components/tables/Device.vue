<template>
  <div class="gdp-device-table">
    <caption v-html="captionText" />
    <gdp-table :title-list="titleList" :content-array="contentArray" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import defaultConfig from '@/mixin/Table/index';

export default {
  name: 'gdp-device-table',
  mixins: [defaultConfig],
  data() {
    return {
      captionText: '',
      editAble: false
    };
  },
  computed: {
    ...mapGetters(['funcImport']),
    imshowModels() {
      if (!this.funcDefine.length) return [];
      return this.deepCopy(
        this.funcImport.map(_id => {
          return this.funcDefine.find(model => model._id === _id);
        })
      );
    },
    selectOptions() {
      return this.typeDefine;
    },
    // 右边操作图标组
    iconOptions() {
      return [
        {
          key: 'disable',
          descript: '删除',
          method: this._del
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      delDevFunc: 'DEL_DEV_FUNC'
    }),
    // 删除功能
    _del(index) {
      this.$confirm.show({
        content: `确定删除<strong style="color: rgb(128, 157, 225)">[${this.contentArray[index][0].text}]</strong>吗？删除后功能即刻失效。`,
        confirmText: '确定',
        cancelText: '取消',
        requiredText: '我已了解，确定删除设备功能',
        onConfirm: () => {
          this.delDevFunc({ index });
        }
      });
    }
  }
};
</script>

<style lang="scss" scpoed>
.gdp-device-table {
  padding: 22px;
  padding-top: 0;
  > caption {
    width: 1040px;
  }
}
</style>
