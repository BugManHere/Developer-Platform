<template>
  <div class="gdp-type-define">
    <!-- 搜索栏 -->
    <div class="input-group search-input">
      <!-- 搜索框 -->
      <input type="text" class="form-control" placeholder="Search" />
      <!-- 搜索按钮 -->
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" />
      </span>
    </div>
    <!-- 主体 -->
    <div class="gdp-type-define-body">
      <!-- 筛选条件 -->
      <div class="gdp-type-define-body-filter">
        <caption v-text="'筛选条件'" />
        <caption>
          <span v-text="filterList[currentFilterType].name" @click="showfilterList = !showfilterList" />
          <div v-show="showfilterList">
            <div
              v-for="(item, key) in filterList"
              :key="key"
              :class="{ 'filter-list': key !== currentFilterType }"
              @click="
                currentFilterType = key;
                showfilterList = !showfilterList;
              "
              v-text="item.name"
            />
          </div>
        </caption>
      </div>
      <!-- 内容 -->
      <div class="gdp-type-define-body-content">
        <!-- 标题 -->
        <div class="gdp-type-define-body-content-title">
          <div
            class="title-list"
            v-for="(titleItem, index) in titleList"
            v-text="titleItem.name"
            :style="{ order: titleItem.key === currentFilterType ? -1 : 1, flex: `${titleItem.flex}%` }"
            :key="index"
          />
        </div>
        <!-- 主要内容 -->
        <div class="gdp-type-define-body-content-main">
          <div class="gdp-type-define-list" v-for="(contentInfo, mainType) in contentMap" :key="mainType">
            <!-- 大类 -->
            <div class="gdp-type-define-list-caption">
              <div v-text="mainTypes[mainType]" class="title" />
              <!-- 操作 -->
              <div class="operation">
                <i
                  class="iconfont"
                  v-for="(operation, index) in titleOperation"
                  :key="index"
                  :class="`iconfont-${operation.icon}`"
                  :title="operation.title"
                  @click="operation.method({ mainType })"
                />
              </div>
            </div>
            <!-- 列表：行 -->
            <div class="gdp-type-define-list-content" v-for="(content, index) in contentInfo.list[0]" :key="index">
              <div
                class="gdp-type-define-list-content-item"
                v-for="(subTypeList, subTypeIndex) in contentMap[mainType].list"
                :key="subTypeIndex"
                :style="{ flex: `${titleList[subTypeIndex].flex}%` }"
              >
                <!-- 操作 -->
                <div v-if="subTypeList === 'operation'" class="operation">
                  <i
                    class="iconfont"
                    v-for="(operation, operationIndex) in editOperation"
                    :key="operationIndex"
                    :class="`iconfont-${operation.icon}`"
                    :title="operation.title"
                    @click="operation.method({ mainType, subType: contentInfo.list[0][index], name: contentMap[mainType].list[1][index] })"
                  />
                </div>
                <!-- 文本 -->
                <div v-else v-text="subTypeList[index]" />
              </div>
            </div>
            <!-- 输入 -->
            <div class="gdp-type-define-list-input" v-shuttle="addFlag === mainType">
              <div class="input-box">
                <input
                  class="input-box-item form-control"
                  v-for="(input, inputIndex) in inputOptions.content"
                  :key="inputIndex"
                  :placeholder="input.placeholder"
                  :value="input.value"
                  @change="input.method"
                />
              </div>
              <!-- 操作 -->
              <div class="operation">
                <i
                  class="iconfont"
                  v-for="(operation, index) in inputOptions.operation"
                  :key="index"
                  :class="`iconfont-${operation.icon}`"
                  :title="operation.title"
                  @click="operation.method({ mainType })"
                />
              </div>
            </div>
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
import { deepCopy } from '@utils';

export default {
  name: 'gdp-type-define',
  props: {
    typeDefine: {
      type: Object,
      default: () => {
        return {
          active: '默认',
          'active-button': '高级按钮',
          'active-homeButton': '主页按钮',
          inertia: '默认',
          'inertia-tem': '温度设定',
          'inertia-temMin': '温度下限',
          'inertia-temMax': '温度上限',
          'inertia-imshowSlot1': '显示插槽1',
          'inertia-imshowSlot2': '显示插槽2',
          // 'inertia-imshowSlot3': '显示插槽1',
          // 'inertia-imshowSlot4': '显示插槽2',
          // 'inertia-imshowSlot5': '显示插槽1',
          // 'inertia-imshowSlot6': '显示插槽2',
          // 'inertia-imshowSlot7': '显示插槽2',
          // 'inertia-imshowSlot8': '显示插槽1',
          // 'inertia-imshowSlot9': '显示插槽2',
          'inertia-mod': '模式设定',
          'inertia-fan': '风速设定'
        };
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
              this.settingDone();
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      typeDefineCopy: {},
      mainTypes: {
        active: '显性功能',
        inertia: '隐性功能'
      },
      showfilterList: false,
      currentFilterType: 'mainType',
      filterList: {
        // 筛选条件列表
        mainType: {
          name: '主类型',
          mapName: 'mainTypeMap'
        },
        subType: {
          name: '细分类型',
          mapName: 'mainTypeMap'
        },
        name: {
          name: '作用',
          mapName: 'mainTypeMap'
        }
      },
      titleList: [
        {
          key: 'subType',
          name: '细分类型',
          flex: 40
        },
        {
          key: 'name',
          name: '作用',
          flex: 40
        },
        {
          key: 'operation',
          name: '操作',
          flex: 20
        }
      ],
      addFlag: false,
      editFlag: false,
      delFlag: false,
      editValue: {},
      mainTypeMap: {},
      contentMap: {}
    };
  },
  created() {
    this.typeDefineCopy = deepCopy(this.typeDefine) || {};
    this.initEdit();
    this.updateData();
  },
  computed: {
    // 标题按钮
    titleOperation() {
      return [
        {
          key: 'add',
          title: '添加',
          icon: 'tianjia',
          method: this._add
        }
      ];
    },
    // 内容按钮
    editOperation() {
      return [
        {
          key: 'edit',
          title: '编辑',
          icon: 'bianji',
          method: this._edit
        },
        {
          key: 'del',
          title: '删除',
          icon: 'disable',
          method: this._del
        }
      ];
    },
    // 输入框
    inputOptions() {
      return {
        content: [
          {
            placeholder: ' 请输入细分类型',
            value: this.editValue.subType,
            method: e => {
              this.editValue.subType = e.target.value;
              console.log(this.editValue.subType);
            }
          },
          {
            placeholder: ' 请输入简要描述',
            value: this.editValue.name,
            method: e => {
              this.editValue.name = e.target.value;
              console.log(this.editValue.name);
            }
          }
        ],
        operation: [
          {
            key: 'enter',
            title: '确定',
            icon: 'queding',
            method: this._enter
          }
        ]
      };
    }
  },
  methods: {
    // 初始化输入框
    initEdit() {
      this.addFlag = false;
      this.editValue = {
        subType: '',
        name: ''
      };
    },
    // 初始化数据
    updateData() {
      const getMainTypeMap = () => {
        const result = { active: {}, inertia: {} };
        const splitType = (type, name, mainType) => {
          const subType = type.split(`${mainType}-`)[1];
          if (!subType) return;
          result[mainType][subType] = name;
        };
        for (const type in this.typeDefineCopy) {
          for (const checkType in this.mainTypes) {
            splitType(type, this.typeDefineCopy[type], checkType);
          }
        }
        this.mainTypeMap = result;
      };
      const getContentMap = () => {
        const result = {};
        for (const mainType in this.mainTypes) {
          const title = this.mainTypes[mainType];
          const subTypeInfo = this.mainTypeMap[mainType];
          const subType = Object.keys(subTypeInfo);
          const content = {
            title
          };
          // content.list = this.mainTypeMap[mainType];
          // result[mainType] = content;
          content.list = this.titleList.map(item => {
            if (item.key === 'subType') {
              return subType;
            } else if (item.key === 'name') {
              return subType.map(item => subTypeInfo[item]);
            } else if (item.key === 'operation') {
              return 'operation';
            }
          });
          result[mainType] = content;
        }
        this.contentMap = result;
      };
      getMainTypeMap();
      getContentMap();
    },
    _add({ mainType }) {
      this.addFlag = mainType;
    },
    _del({ mainType, subType, name }) {
      this.$confirm.show({
        content: `确定删除类型定义<strong style="color: rgb(128, 157, 225)">[${name}]</strong>吗？`,
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: () => {
          const type = `${mainType}-${subType}`;
          delete this.typeDefineCopy[type];
          this.updateData();
        }
      });
    },
    _edit({ mainType }) {
      console.log(mainType);
    },
    _enter({ mainType }) {
      const type = `${mainType}-${this.editValue.subType}`;
      this.typeDefineCopy[type] = this.editValue.name;
      this.initEdit();
      this.updateData();
    },
    settingDone() {
      this.outputHandler(this.typeDefineCopy);
      this.$popup.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
$boderColorLighter: #ddd;
$boderColorBold: #aaa;
.gdp-type-define {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 20px;
  .search-input {
    padding: 10px 0;
    width: 100%;
    font-family: 'Glyphicons Halflings';
    > span button {
      &::before {
        content: '\e003';
        font-size: 12px;
      }
    }
  }
  &-body {
    height: 480px;
    width: 100%;
    border-radius: 4px;
    border: 1px $boderColorBold solid;
    &-filter {
      position: relative;
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      border-radius: 4px;
      border-bottom: 1px $boderColorBold solid;
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
            border: 1px $boderColorBold solid;
            border-bottom: 0;
            > div {
              display: none;
              &.filter-list {
                font-size: 14px;
                display: block;
                padding: 6px;
                border-bottom: 1px $boderColorBold solid;
                &:hover {
                  background-color: #dedede;
                }
              }
            }
          }
        }
      }
    }
    &-content {
      height: auto;
      width: auto;
      overflow: hidden;
      &-title {
        width: 100%;
        height: 30px;
        overflow: auto;
        display: flex;
        justify-content: space-around;
        text-align: center;
        background-color: $boderColorLighter;
        // 标题
        .title-list {
          width: 100%;
          padding-top: 5px;
          color: #777777;
          border-bottom: 1px $boderColorBold solid;
          border-right: 1px $boderColorBold solid;
          &:last-child {
            border-right: 0;
          }
        }
      }
      &-main {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        .gdp-type-define-list {
          &-caption {
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            .title {
              font-size: 18px;
              text-align: center;
              background-color: #ddd;
              flex: 80%;
              border-bottom: 1px $boderColorBold solid;
            }
            .operation {
              border-left: 1px $boderColorBold solid;
              border-bottom: 1px$boderColorLighter solid;
              text-align: center;
              flex: 20%;
            }
          }
          &-content {
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
            text-align: center;
            border-bottom: 1px$boderColorLighter solid;
            &-item {
              padding: 5px 0;
              display: flex;
              justify-content: center;
              width: 100%;
            }
            > :last-child {
              border-left: 1px $boderColorBold solid;
            }
          }
          &-input {
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            .input-box {
              display: flex;
              flex-wrap: nowrap;
              justify-content: space-around;
              overflow: hidden;
              width: 100%;
              height: 100%;
              flex: 80%;
              padding: 10px 0px;
              &-item {
                padding: 0;
                height: auto;
                height: 30px;
                width: auto;
              }
            }
            .operation {
              display: flex;
              justify-content: center;
              align-items: center;
              border-left: 1px $boderColorBold solid;
              border-bottom: 1px$boderColorLighter solid;
              flex: 20%;
            }
          }
        }
      }
    }
  }
  .operation {
    width: 100%;
    padding: 0 12px;
    display: flex;
    justify-content: space-around;
    i {
      font-weight: 500;
      color: #000;
      cursor: pointer;
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
}
</style>
