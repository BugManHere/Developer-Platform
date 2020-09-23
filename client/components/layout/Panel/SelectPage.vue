<template>
  <div class="select-page">
    <div class="select-page-title">
      <div
        class="select-page-label"
        v-for="(mould, index) in mouldKeys"
        v-text="pluginMoulds[mould].name"
        :key="index"
        :class="{ select: mould === mouldKey }"
        @click="changeMould(mould)"
      />
    </div>
    <div class="select-page-body">
      <div
        @click="chooseOne(key)"
        :class="{ hold: key === currentSelectKey }"
        class="img-box"
        v-for="(item, key) in imgMap[mouldPath]"
        :key="`${mouldKey}-${key}`"
      >
        <img :src="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils';
import { mapState, mapMutations } from 'vuex';
import https from '@/https';

export default {
  data() {
    return {
      pageConfigs: {},
      imgMap: {},
      insertPage: {},
      imgKey: undefined,
      currentSelectKey: '',
      mouldKey: 'default'
    };
  },
  computed: {
    ...mapState({
      productTypeList: state => state.pulicModule.productTypeList,
      productType: (state, getters) => getters.productType,
      funcDefine: (state, getters) => getters.funcDefine
    }),
    funcIndex() {
      return this.$parent.$parent.insertPageShow;
    },
    // 当前页面选项
    pageConfig() {
      return this.pageConfigs[this.mouldPath];
    },
    // 模板
    pluginMoulds() {
      return this.productType.plugin;
    },
    // 模板的key
    mouldKeys() {
      const plugin = this.pluginMoulds;
      let result = plugin ? Object.keys(plugin) : [];
      return result;
    },
    // 模板的地址
    mouldPath() {
      const plugin = this.pluginMoulds;
      return plugin[this.mouldKey] && plugin[this.mouldKey].path;
    }
  },
  mounted() {
    if (!this.productTypeList.length) {
      https
        .fetchGet('/productType')
        .then(data => {
          const productTypeList = data.data.productTypeList;
          this.setPulicModule({ productTypeList });
        })
        .catch(err => {
          console.log(err);
        });
    }
    const page = this.funcDefine[this.funcIndex].page;
    console.log(page);
    page &&
      page.forEach(item => {
        this.insertPage[item.module] = item.key;
      });
    this.currentSelectKey = this.insertPage[this.mouldPath];
  },
  watch: {
    mouldKeys: {
      handler(newVal) {
        if (newVal.length) {
          this.mouldKeys.forEach(mouldKey => {
            const plugin = this.pluginMoulds;
            const mouldPath = plugin[mouldKey].path;
            try {
              const { pageConfig } = require(`@assets/page/${mouldPath}/index.json`);
              this.pageConfigs[mouldPath] = pageConfig;
              this.imgMap[mouldPath] = {};
              Object.keys(pageConfig).forEach(item => {
                this.$set(this.imgMap[mouldPath], item, require(`@assets/page/${mouldPath}/${item}.png`));
              });
            } catch (e) {
              console.log(e);
            }
          });
        }
      },
      immediate: true
    },
    mouldPath() {
      this.currentSelectKey = this.insertPage[this.mouldPath];
      console.log(this.insertPage);
      console.log(this.currentSelectKey);
    }
  },
  methods: {
    ...mapMutations({
      changeTemp: 'CHANGE_TEMPLATE',
      setPulicModule: 'SET_PULIC_MODULE'
    }),
    // 选择页面
    chooseOne(key) {
      this.currentSelectKey = this.currentSelectKey === key ? undefined : key;
      this.$set(this.insertPage, this.mouldPath, this.currentSelectKey);
    },
    // 切换模板
    changeMould(mould) {
      this.mouldKey = mould;
    },
    // 点击完成
    settingDone() {
      const index = this.funcIndex;
      const funcDefine = deepCopy(this.funcDefine);
      // 提取二级页面信息
      let page = Object.keys(this.insertPage)
        .map(mouldPath => {
          const key = this.insertPage[mouldPath];
          if (key) {
            const pageConfig = this.pageConfigs[mouldPath];
            const result = pageConfig[key];
            result.key = key;
            result.module = mouldPath;
            return result;
          }
          return undefined;
        })
        .filter(v => v);
      // 空的话不要
      funcDefine[index].page = page.length ? page : undefined;
      this.changeTemp({ funcDefine });
      this.$parent.$parent.insertPageShow = false;
    }
  }
};
</script>
