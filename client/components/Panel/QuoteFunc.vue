<template>
  <div class="quote-func">
      <!-- 搜索栏 -->
     <div class="input-group search-input">
       <!-- 搜索框 -->
      <input type="text" class="form-control" placeholder="Search">
      <!-- 搜索按钮 -->
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" />
      </span>
    </div>
    <!-- 页面内容 -->
    <div class="quote-body">
      <!-- 筛选条件 -->
      <div class="select-filter">
        <caption>筛选条件</caption>
        <caption>
          <span @click="showfilterList=!showfilterList" v-text="filterList[filterBy].name"/>
          <div v-show="showfilterList">
            <div v-for="(item, key) in filterList" :key="key" :class="{'filter-list': key !== filterBy}" @click="filterBy=key;showfilterList=!showfilterList" v-text="item.name"/>
          </div>
        </caption>
      </div>
      <!-- 筛选内容列表 -->
      <div class="select-list">
        <!--标题  -->
        <div class="select-title">
          <div class="title-list" v-for="(titleItem, key) in filterList" :style="{order: key === filterBy ? -1 : 1}" :key="key">
            {{ titleItem.name }}
          </div>
        </div>
        <!-- 主要内容 -->
        <div class="list-content">
          <!-- 根据筛选条件的首字母排序 -->
          <div v-for="(indexArr, letter) in filterContentList.sortMap" :key="letter">
            <!-- 首字母 -->
            <div class="letter" v-text="letter"/>
            <!-- 显示内容 -->
            <div class="content">
              <!-- 根据sortMap定义的顺序显示 -->
              <div class="list-col" v-for="(funcIndex, i) in indexArr" :key="i">
                  <!-- 筛选条件优先排列 -->
                  <div v-for="(titleItem, key) in filterList" :style="{order: key === filterBy ? -1 : 1}" :key="`${i}_${key}`" v-text="filterContentList.result[funcIndex][key]"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pinyin from 'js-pinyin';
import { deepCopy } from '@/utils'
import { mapState } from "vuex";

export default {
  data() {
    return {
      showfilterList: false, // 是否点开筛选条件
      filterList: { // 筛选条件列表
        identifier: {
          name: '标识符', // 显示用
          mapName: 'productFuncInfoById', //搜索用
        },
        name: {
          name: '功能名称',
          mapName: 'productFuncInfoByName',
        },
        json: {
          name: '字段名',
          mapName: 'productInfoByJson',
        }
      },
      filterBy: 'name', // 筛选条件
      selectType: '',
      selectFuncList: []
    }
  },
  computed: {
    ...mapState({
      productFuncInfoById: (state, getters) => getters.productFuncInfoById,
      productFuncInfoByName: (state, getters) => getters.productFuncInfoByName,
      productFuncInfoByJson: (state, getters) => getters.productFuncInfoByJson,
    }),
    // 筛选内容列表
    filterContentList() {
      const result = [];
      const searchKey = 'identifier';
      const selectMapName = this.filterList[searchKey].mapName; // 用于搜索的对象
      if (!this[selectMapName]) return undefined;
      const selectMap = deepCopy(this[selectMapName]); // 深负责，方便后续操作
      const mapKeys = Object.keys(selectMap); // 取得上面数据的key
      mapKeys.map(key => {
        const funcArr = selectMap[key].filter(item => item.define.type === this.selectType); // 挑选出对应的功能
        funcArr.forEach((item, index) => {
          result.push({
            name: item.name,
            json: item.json,
            identifier: item.identifier,
            index: index
          })
        });
      });
      return this.sortByFisrtLetter(result); // 给结果排序
    }
  },
  mounted() {
    this.selectType = this.$parent.$parent.quoteShow;
  },
  methods: {
    // 根据首字母排序，输入值为[{name, josn, identifier}]，输出{result: 结果, sortArr: 排序数组}
    sortByFisrtLetter(arr) {
      const arrCopy = deepCopy(arr); // 深复制，方便后续操作
      const searchKey = this.filterBy; // 作为排序的key
      const letterArr = []; // 存储英文与字符类型的数组，根据此排序
      const sortMap = {};
      // 提取英文与字符类型
      arr.forEach((item, index) => {
        const value = item[searchKey]; // 需要作为排序的值
        const letter = pinyin.getCamelChars(value)[0].toLowerCase(); // 转换成小写英文
        let type = 2;
        console.log(value);
        if (value[0].charCodeAt() >= 97 && value[0].charCodeAt() <= 122) {
          type = 0
        } else if (value[0].charCodeAt() >= 65 && value[0].charCodeAt() <= 90) {
          type = 1;
        }
        letterArr.push([letter, type, index]); // 存储英文首字母
        arrCopy[index].letter = letter;
      });
      // 先按字符类型排序，小写字母 > 大写字母 > 汉字（其他）
      letterArr.sort((thisItem, lastItem) => {
        return thisItem[1] - lastItem[1];
      });
      // 再按首字母排序
      letterArr.sort((thisItem, lastItem) => {
        return thisItem[0].charCodeAt() - lastItem[0].charCodeAt();
      });
      // 给结果排序
      return {
        result: letterArr.map((item, i) => {
          const index = item[2];
          const letter = arrCopy[index].letter.toUpperCase();
          if (!sortMap[letter]) {
            sortMap[letter] = [i]
          } else {
            sortMap[letter].push(i);
          }
          console.log(sortMap);
          return arrCopy[index];
        }),
        sortMap
      };
    }
  },
};
</script>

<style>

</style>