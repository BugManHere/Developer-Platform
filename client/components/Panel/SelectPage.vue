<template>
  <div class="select-page">
    <!-- <div class="panel" v-for="(item, key) in imgMap" :key="key">
      <img :src="item" />
    </div> -->
    <div class="panel" v-for="(item, index) in 4" :key="index">
      <img src="@assets/page/Sweep.png" >
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import https from "@/https";

export default {
  data() {
    return {
      pageConfig: {},
      mouldName: ""
    };
  },
  computed: {
    ...mapState({
      productTypeList: state => state.devModule.productTypeList
    }),
    imgMap() {
      const result = {};
      // const pageConfig = this.pageConfig;
      // for (const item in pageConfig) {
      //   result[item] = require(`@plugin/${this.mouldName}/src/assets/page/${item}.png`);
      // }
      return result;
    }
  },
  mounted() {
    // if (!Object.keys(this.productTypeList).length) {
    //   https
    //     .fetchGet("/productType")
    //     .then(data => {
    //       const productTypeList = data.data.productTypeList;
    //       this.setDevState(["productTypeList", productTypeList]);
    //       console.log(this.productTypeList);
    //       this.getImg();
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // } else {
    //   this.getImg();
    // }
  },
  methods: {
    ...mapMutations({
      setDevState: "SET_DEV_OBJECT"
    }),
    // getImg() {
    //   const mouldName = this.productTypeList[0].plugin;
    //   const { pageConfig } = require(`@plugin/${mouldName}/src/assets/page/index.json`);
    //   this.pageConfig = pageConfig;
    //   this.mouldName = mouldName;
    // }
  }
};
</script>

<style></style>
