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
    <div class="select-page-body-box">
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
    <!-- 底部按钮组 -->
    <div class="btn-group btn-group-justified col-md-12">
      <button class="btn " v-for="(btn, index) in bottomBtns" v-html="btn.text" :class="`btn-${btn.class}`" :key="index" @click="btn.method" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'gdp-select-page',
  props: {
    pluginMoulds: {
      type: Object,
      default: () => {
        return {};
      }
    },
    model: {
      type: Object,
      default: () => {
        return {};
      }
    },
    outputHandler: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    bottomBtns: {
      type: Array,
      default: function() {
        return [
          {
            class: 'primary',
            text: '完&emsp;成',
            method: () => {
              this.selectDone();
            }
          }
        ];
      }
    }
  },
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
    // 当前页面选项
    pageConfig() {
      return this.pageConfigs[this.mouldPath];
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
    const { page } = this.model;
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
    }
  },
  methods: {
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
    selectDone() {
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
      this.model.page = page.length ? page : undefined;
      this.$popup.hide();

      this.outputHandler(this.model);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-page {
  $baseColor: #f5f5f5;
  $pageHeight: 580px;
  $titleHeight: 40px;
  $buttonHeight: 64px;
  position: relative;
  max-height: $pageHeight;
  height: auto;
  margin-bottom: 15px;
  overflow: hidden;
  .select-page-title {
    width: 100%;
    height: $titleHeight;
    display: flex;
    justify-content: flex-start;
    background-color: $baseColor;
    border-bottom: #ddd 1px solid;
    .select-page-label {
      min-width: 120px;
      height: 100%;
      font-size: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 15px;
      border-bottom: 1px transparent solid;
      cursor: pointer;
      &.select {
        border-bottom: 1px CadetBlue solid;
        background-color: $baseColor !important;
        color: #404657;
      }
      &:hover {
        background-color: #eaeaea;
      }
    }
  }
  .select-page-body-box {
    position: relative;
    height: auto;
    .select-page-body {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      overflow-y: scroll;
      max-height: $pageHeight - $titleHeight - $buttonHeight;
      .img-box {
        &:hover {
          border: 1px CadetBlue solid;
        }
        img {
          height: 400px;
        }
        &.hold {
          background-color: CadetBlue;
        }
      }
    }
  }
  .btn-group {
    position: relative;
    bottom: 0;
    width: 100%;
    height: $buttonHeight;
    display: flex;
    justify-content: center;
    background-color: #fff;
    padding: 15px 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    button {
      width: 80px;
      margin-right: 10px;
      margin-left: 10px;
    }
  }
}
</style>
