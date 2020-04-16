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
            <div class="frame" v-for="(indexArr, letter) in filterContentList.sortMap" :key="letter">
              <!-- 首字母 -->
                <div class="letter" v-text="letter" v-slow="!hideLetter.includes(letter)"/>
                <!-- 显示内容 -->
                    <div class="content" v-slow="!hideLetter.includes(letter)" :key="letter + 0">
                      <!-- 根据sortMap定义的顺序显示 -->
                      <!-- <transition-group name="slow" @after-enter="log"> -->
                          <div class="list-col" v-for="funcIndex in indexArr" :key="funcIndex" @click="selectFunc(funcIndex)" v-slow="!hideContent.includes(funcIndex)">
                              <!-- 筛选条件优先排列 -->
                              <div v-for="(titleItem, key) in filterList" :style="{order: key === filterBy ? -1 : 1}" :key="`${indexArr}_${key}`" v-text="indexTofunc[funcIndex][key]"/>
                          </div>
                      <!-- </transition-group> -->
                    </div>
            </div>
        </div>
      </div>
      <!-- 已选择的功能 -->
      <div class="chosen-func">
        <!--标题  -->
        <div class="chosen-title" v-text="'已选功能'" />
        <!--标题  -->
        <div class="chosen-title" >
          <span>功能名称</span>
          <span>字段名</span>
          <span>标识符</span>
        </div>
        <!-- 主要内容 -->
        <div class="chosen-body">
          <div class="chosen-content" v-for="(item, index) in selectFuncList" :key="index">
            <span v-text="item.name"/>
            <span v-text="item.json"/>
            <span v-text="item.identifier"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pinyin from 'js-pinyin';
import https from '@/https';
import { deepCopy } from '@/utils'
import { mapState, mapMutations } from "vuex";

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
      admin: state => state.userModule.admin,
      deviceKey: state => state.devModule.deviceKey,
      funcImport: (state, getters) => getters.funcImport,
      productFuncInfoById: (state, getters) => getters.productFuncInfoById,
      productFuncInfoByName: (state, getters) => getters.productFuncInfoByName,
      productFuncInfoByJson: (state, getters) => getters.productFuncInfoByJson,
    }),
    // 筛选内容列表
    filterContentList() {
      const result = [];
      const searchMap = this.searchMap; // 深负责，方便后续操作
      const mapKeys = Object.keys(searchMap); // 取得上面数据的key
      mapKeys.map((key, index) => {
        const filteTypeArr = searchMap[key].filter(item => this.selectType.includes(item.define.type)); // 挑选出对应的功能
        // const filteRepeatArr = filteTypeArr.filter(item => !this.selectFuncID.includes(item._id));
        filteTypeArr.forEach(item => {
          result.push({
            name: item.name,
            json: item.json,
            identifier: item.identifier,
            _id: item._id,
            index
          })
        });
      });
      return this.sortByFisrtLetter(result); // 给结果排序
    },
    // 用于搜索
    searchMap() {
      if (!this.filterList) return {};
      const searchKey = 'identifier';
      const selectMapName = this.filterList[searchKey].mapName; // 用于搜索的对象
      return this[selectMapName];
    },
    // 已选择的功能的id
    selectFuncID() {
      return this.selectFuncList.map(item => {
        return item._id
      });
    },
    // 隐藏已选择的功能
    hideContent() {
      const result = this.selectFuncID.map(id => {
        return this.filterContentList.result.find(item => item._id === id).index;
      });
      return result;
    },
    // 隐藏字母
    hideLetter() {
      const result = [];
      Object.keys(this.filterContentList.sortMap).forEach(letter => {
        let hide = true;
        this.filterContentList.sortMap[letter].forEach(index => {
          !this.hideContent.includes(index) && (hide = false);
        });
        hide && (result.push(letter));
      });
      return result;
    },
    // 根据index找到对应的功能
    indexTofunc() {
      const result = {};
      if (!this.filterContentList) return result;
      this.filterContentList.result.forEach(item => {
        result[item.index] = item;
      });
      return result;
    }
  },
  mounted() {
    this.selectType = this.$parent.$parent.quoteShow;
    this.selectFuncList = this.funcImport.map(id => {
      return this.filterContentList.result.find(item => item._id === id);
    });
  },
  methods: {
    ...mapMutations({
      setDevModule: "SET_DEV_MODULE",
      setTempModule: "SET_TEMP_MODULE"
    }),
    // 根据首字母排序，输入值为[{name, josn, identifier}]，输出{result: 结果, sortArr: 排序数组}
    sortByFisrtLetter(arr) {
      const arrCopy = deepCopy(arr); // 深复制，方便后续操作
      const searchKey = this.filterBy; // 作为排序的key
      const letterArr = []; // 存储英文与字符类型的数组，根据此排序
      const sortMap = {};
      // 提取英文与字符类型
      arr.forEach(item => {
        const value = item[searchKey]; // 需要作为排序的值
        const letter = pinyin.getCamelChars(value)[0].toLowerCase(); // 转换成小写英文
        let type = 2;
        if (value[0].charCodeAt() >= 97 && value[0].charCodeAt() <= 122) {
          type = 0
        } else if (value[0].charCodeAt() >= 65 && value[0].charCodeAt() <= 90) {
          type = 1;
        }
        letterArr.push([letter, type, item.index]); // 存储英文首字母
        arrCopy[item.index].letter = letter;
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
        result: letterArr.map(item => {
          const index = item[2];
          const letter = arrCopy[index].letter.toUpperCase();
          if (!sortMap[letter]) {
            sortMap[letter] = [index];
          } else {
            sortMap[letter].push(index);
          }
          return arrCopy[index];
        }),
        sortMap
      };
    },
    // 点击选择此功能
    selectFunc(index) {
      if (!this.selectFuncList.length || !this.selectFuncList.find(contentItem => contentItem.index === index)) {
        this.$set(this.selectFuncList, this.selectFuncList.length, this.indexTofunc[index]);
        this.$forceUpdate();
      }
    },
    // 点击完成
    async importDone() {
      const res = await https.fetchPost('/userDevice/save', {idList: JSON.stringify(this.selectFuncID), id: this.deviceKey ,admin: this.admin});
      this.setDevModule(['userDeviceList', res.data]);
    },
  },
};
</script>
