<template>
  <div class="quote-func" ref="quote">
    <!-- 搜索栏 -->
    <div class="input-group search-input">
      <!-- 搜索框 -->
      <input type="text" class="form-control" placeholder="Search" v-focus="true" />
      <!-- 搜索按钮 -->
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" />
      </span>
    </div>
    <!-- 页面内容 -->
    <div class="quote-body">
      <!-- 筛选条件 -->
      <div class="select-filter">
        <caption v-text="'筛选条件'" />
        <caption>
          <span @click="showfilterList = !showfilterList" v-text="filterList[filterBy].name" />
          <div v-show="showfilterList">
            <div
              v-for="(item, key) in filterList"
              :key="key"
              :class="{ 'filter-list': key !== filterBy }"
              @click="
                filterBy = key;
                showfilterList = !showfilterList;
              "
              v-text="item.name"
            />
          </div>
        </caption>
      </div>
      <!-- 筛选内容列表 -->
      <div class="select-list">
        <!--标题  -->
        <div class="select-title">
          <div class="title-list" v-for="(titleItem, key) in filterList" v-text="titleItem.name" :style="{ order: key === filterBy ? -1 : 1 }" :key="key" />
        </div>
        <!-- 主要内容 -->
        <div class="list-content">
          <!-- 根据筛选条件的首字母排序 -->
          <div class="frame" v-for="(indexArr, letter) in filterContentList.sortMap" :key="letter">
            <!-- 首字母 -->
            <div class="letter" v-text="letter" v-shuttle="!hideLetter.includes(letter)" />
            <!-- 显示内容 -->
            <div class="content" v-shuttle="!hideLetter.includes(letter)" :key="letter + 0">
              <!-- 根据sortMap定义的顺序显示 -->
              <div
                class="list-col"
                v-for="(funcIndex, index) in indexArr"
                :key="`${funcIndex}_${index}`"
                @click="selectFunc(funcIndex)"
                v-shuttle="!hideContent.includes(funcIndex)"
              >
                <!-- 筛选条件优先排列 -->
                <div
                  v-for="(titleItem, key) in filterList"
                  :style="{ order: key === filterBy ? -1 : 1 }"
                  :key="`${indexArr}_${key}`"
                  v-text="indexTofunc[funcIndex] && indexTofunc[funcIndex][key]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 已选择的功能 -->
      <div class="chosen-func">
        <!--标题  -->
        <div class="chosen-title" v-text="'已选功能'" />
        <!--标题  -->
        <div class="chosen-title">
          <span>功能名称</span>
          <span>字段名</span>
          <span>标识符</span>
        </div>
        <!-- 主要内容 -->
        <div class="chosen-body">
          <div class="chosen-content" v-for="(item, index) in selectFuncList" :key="index">
            <span v-text="item.name" />
            <span v-text="item.json" />
            <span v-text="item.identifier" />
          </div>
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
import pinyin from 'js-pinyin';
import { deepCopy } from '@utils';

export default {
  name: 'gdp-quote-func',
  props: {
    funcDefine: {
      type: Array,
      default: () => {
        return [];
      }
    },
    funcImport: {
      type: Array,
      default: () => {
        return [];
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
              this.importDone();
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      showfilterList: false, // 是否点开筛选条件
      filterList: {
        // 筛选条件列表
        identifier: {
          name: '标识符', // 显示用
          mapName: 'productFuncInfoById' //搜索用
        },
        name: {
          name: '功能名称',
          mapName: 'productFuncInfoByName'
        },
        json: {
          name: '字段名',
          mapName: 'productInfoByJson'
        }
      },
      filterBy: 'name', // 筛选条件
      selectType: '',
      selectFuncList: []
    };
  },
  computed: {
    // 根据id进行搜索的功能列表
    productFuncInfoById() {
      const result = {};
      this.funcDefine.forEach(item => {
        const map = {
          identifier: item.identifier,
          name: item.name,
          json: item.json,
          _id: item._id,
          define: item
        };
        if (result[item.identifier]) {
          result[item.identifier].push(map);
        } else {
          result[item.identifier] = [map];
        }
      });
      return result;
    },
    // 根据name进行搜索的功能列表
    productFuncInfoByName() {
      const result = {};
      this.funcDefine.forEach(item => {
        const map = {
          identifier: item.identifier,
          name: item.name,
          json: item.json,
          _id: item._id,
          define: item
        };
        if (result[item.name]) {
          result[item.name].push(map);
        } else {
          result[item.name] = [map];
        }
      });
      return result;
    },
    // 根据json进行搜索的功能列表
    productFuncInfoByJson() {
      const result = {};
      this.funcDefine.forEach(item => {
        const map = {
          identifier: item.identifier,
          name: item.name,
          json: item.json,
          _id: item._id,
          define: item
        };
        if (result[item.json]) {
          result[item.json].push(map);
        } else {
          result[item.json] = [map];
        }
      });
      return result;
    },
    // 筛选内容列表
    filterContentList() {
      const result = [];
      const searchMap = this.searchMap; // 深负责，方便后续操作
      const mapKeys = Object.keys(searchMap); // 取得上面数据的key
      mapKeys.map((key, index) => {
        if (!this.selectType.length) return [];
        const filteTypeArr = searchMap[key].filter(item => this.selectType.some(check => item.define.type.includes(check))); // 挑选出对应的功能
        // const filteRepeatArr = filteTypeArr.filter(item => !this.selectFuncID.includes(item._id));
        filteTypeArr.forEach(item => {
          result.push({
            name: item.name,
            json: item.json,
            identifier: item.identifier,
            _id: item._id,
            index
          });
        });
      });
      return this.sortByFisrtLetter(result); // 给结果排序
    },
    // 用于搜索
    searchMap() {
      if (!this.filterList) return {};
      const selectMapName = this.filterList.identifier.mapName; // 用于搜索的对象
      return this[selectMapName];
    },
    // 已选择的功能的id
    selectFuncID() {
      return this.selectFuncList.map(item => {
        return item._id;
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
        hide && result.push(letter);
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
    // this.selectType = this.$parent.$parent.quoteShow;
    this.selectType = ['inertia', 'active'];
    this.selectFuncList = this.funcImport
      .map(id => {
        return this.filterContentList.result.find(item => item._id === id);
      })
      .filter(v => v);
  },
  methods: {
    // setDevModule: 'SET_DEV_MODULE'
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
          type = 0;
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
      }
    },
    // 点击完成
    importDone() {
      this.outputHandler(JSON.stringify(this.selectFuncID));
    }
  }
};
</script>

<style lang="scss" scoped>
.quote-func {
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .search-input {
    padding: 10px 0;
    font-family: 'Glyphicons Halflings';
    width: 90%;
    > span button {
      &::before {
        content: '\e003';
        font-size: 12px;
      }
    }
  }
  .quote-body {
    height: auto;
    width: 90%;
    margin-bottom: 10px;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    border: 1px #ccc solid;
    transition: 0.4s linear all;
    // 筛选条件
    .select-filter {
      position: relative;
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      border-radius: 4px;
      border-bottom: 1px #ccc solid;
      caption {
        user-select: none;
        padding: 5px 15px;
        width: 100px;
        text-align: center;
        &:last-child {
          cursor: pointer;
          > span {
            &::after {
              position: relative;
              top: 1px;
              left: 2px;
              font-size: 10px;
              font-family: 'Glyphicons Halflings';
              content: '\e252';
              transform: rotate(70deg);
            }
          }
          > div {
            position: absolute;
            border-radius: 3px;
            background-color: #eee;
            border: 1px #ccc solid;
            border-bottom: 0;
            > div {
              display: none;
              &.filter-list {
                font-size: 14px;
                display: block;
                padding: 6px;
                border-bottom: 1px #ccc solid;
                &:hover {
                  background-color: #dedede;
                }
              }
            }
          }
        }
      }
    }
    // 筛选内容列表
    .select-list {
      height: 370px;
      width: 65%;
      overflow: hidden;
      border-right: 1px #ccc solid;
      .select-title {
        width: 100%;
        height: 30px;
        overflow: auto;
        display: flex;
        justify-content: space-around;
        text-align: center;
        background-color: #fcfcfc;
        // 标题
        .title-list {
          width: 100%;
          padding-top: 5px;
          color: #777777;
          border-bottom: 1px #ccc solid;
        }
      }
      // 主要内容
      .list-content {
        overflow-y: auto;
        overflow-x: hidden;
        height: 337px;
        .frame {
          display: flex;
          flex-wrap: wrap;
          .letter {
            font-size: 18px;
            text-align: center;
            background-color: #ddd;
          }
          .content {
            width: 100%;
            .list-col {
              cursor: pointer;
              display: flex;
              justify-content: space-around;
              text-align: center;
              border-bottom: 1px #f0f0f0 solid;
              padding: 5px 0;
              &:hover {
                background-color: #eee;
              }
            }
          }
        }
        div {
          width: 100%;
        }
      }
    }
    .chosen-func {
      height: 370px;
      width: 35%;
      .chosen-title {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 30px;
        color: #777777;
        border-bottom: 1px #ccc solid;
        span {
          width: 33%;
          display: flex;
          justify-content: center;
        }
      }
      .chosen-body {
        height: 307px;
        overflow-y: auto;
        .chosen-content {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: auto;
          height: 31px;
          background-color: #eee;
          border-bottom: 1px #ccc solid;
          span {
            height: 30px;
            width: 33%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &:nth-child(2n) {
            background-color: #ddd;
          }
        }
      }
    }
  }
  .btn-group {
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
  .slow-enter,
  .slow-leave-to {
    background-color: #ccc;
    opacity: 1;
  }
  .slow-leave,
  .slow-enter-to {
    background-color: red;
    opacity: 0;
  }
  .slow-enter-active,
  .slow-leave-active {
    transition: all 0.5s;
  }
}
</style>
