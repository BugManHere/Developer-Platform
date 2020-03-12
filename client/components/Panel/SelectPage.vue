<template>
  <div class="select-page">
    <div 
      @click="chooseOne(key)" 
      :class="{hold: key === imgKey}"
      class="panel" 
      v-for="(item, key) in imgMap" 
      :key="key">
      <img :src="item" />
    </div>
  </div>
</template>

<script>
import { deepCopy } from "@/utils";
import { mapState, mapMutations } from "vuex";
import https from "@/https";

export default {
  data() {
    return {
      pageConfig: {},
      mouldName: "",
      imgKey: undefined
    };
  },
  computed: {
    ...mapState({
      productTypeList: state => state.devModule.productTypeList,
      funcDefine: (state, getters) => getters.funcDefine,
      deviceKey: state => state.funcModule.deviceKey,
    }),
    imgMap() {
      const result = {};
      const pageConfig = this.pageConfig;
      for (const item in pageConfig) {
        item && this.mouldName && (result[item] = require(`@assets/page/${this.mouldName}/${item}.png`));
      }
      return result;
    },
    funcIndex() {
      return this.$parent.$parent.insertPageShow;
    }
  },
  mounted() {
    if (!Object.keys(this.productTypeList).length) {
      https
        .fetchGet("/productType")
        .then(data => {
          const productTypeList = data.data.productTypeList;
          this.setDevModule(["productTypeList", productTypeList]);
          this.getImg();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.getImg();
    }
    this.funcDefine[this.funcIndex].page && (this.imgKey = this.funcDefine[this.funcIndex].page.key);
  },
  methods: {
    ...mapMutations({
      setFuncDefine: "SET_FUNC_DEFINE",
      setDevModule: "SET_DEV_MODULE"
    }),
    chooseOne(key) {
      this.imgKey = this.imgKey === key ? undefined : key;
      this.$forceUpdate();
    },
    getImg() {
      const mouldName = this.productTypeList[0].plugin;
      if (mouldName) {
        const { pageConfig } = require(`@assets/page/${mouldName}/index.json`);
        this.pageConfig = pageConfig;
        this.mouldName = mouldName;
      }
    },
    settingDone() {
      const index = this.funcIndex;
      console.log(this.funcDefine[index]);
      const funcDefine = deepCopy(this.funcDefine);
      if (this.imgKey) {
        funcDefine[index].page = this.pageConfig[this.imgKey];
        funcDefine[index].page.key = this.imgKey;
      } else {
        funcDefine[index].page = undefined;
      }
      console.log(funcDefine[index].page);
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.$parent.$parent.insertPageShow = false;
    }
  }
};
</script>

<style></style>
