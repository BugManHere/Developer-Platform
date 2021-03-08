<template>
  <div class="gdp-json-define">
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
    <div class="gdp-json-define-body">
      <!-- 筛选条件 -->
      <div class="gdp-json-define-body-filter">
        <caption v-text="'筛选条件'" />
        <!-- <caption>
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
        </caption> -->
      </div>
      <!-- 内容 -->
      <div class="gdp-json-define-body-content">
        <!-- 标题 -->
        <div class="gdp-json-define-body-content-title">
          <div
            class="title-list"
            v-for="(titleItem, index) in titleList"
            v-text="titleItem.name"
            :style="{ order: titleItem.key === currentFilterType ? -1 : 1, flex: `${titleItem.flex}%` }"
            :key="index"
          />
        </div>
        <!-- 主要内容 -->
        <div class="gdp-json-define-body-content-main">
          <!-- 列表：行 -->
          <div class="gdp-json-define-list-content" v-for="(contentInfo, index) in contentList" :key="index">
            <div
              class="gdp-json-define-list-content-item"
              v-for="(content, contentIndex) in contentInfo"
              :key="contentIndex"
              :style="{ flex: `${titleList[contentIndex].flex}%` }"
            >
              <!-- 操作 -->
              <div v-if="content === 'operation'" class="operation">
                <i
                  class="iconfont"
                  v-for="(operation, operationIndex) in editOperation"
                  :key="operationIndex"
                  :class="`iconfont-${operation.icon}`"
                  :title="operation.title"
                  @click="operation.method(index)"
                />
              </div>
              <!-- 文本 -->
              <div v-else v-text="content" />
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
  name: 'gdp-json-define',
  props: {
    jsonDefine: {
      type: Array,
      default: () => {
        return [
          {
            name: '开关',
            json: 'Pow',
            type: 'Number',
            protocol: 1,
            local: false,
            default: '1'
          },
          {
            name: '细分码',
            json: 'Vender',
            type: 'String',
            protocol: 0,
            local: false,
            default: ''
          }
        ];
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
            class: 'default',
            text: '添&emsp;加',
            method: () => {
              this.initInput();
              this.$input.show(this.inputConfig);
            }
          },
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
      currentFilterType: 'json',
      titleList: [
        {
          key: 'json',
          name: '字段名',
          flex: 40
        },
        {
          key: 'name',
          name: '含义',
          flex: 40
        },
        {
          key: 'type',
          name: '数据类型',
          flex: 40
        },
        {
          key: 'protocol',
          name: '读/写',
          flex: 40
        },
        {
          key: 'default',
          name: '默认值',
          flex: 40
        },
        {
          key: 'local',
          name: '本地字段',
          flex: 40
        },
        {
          key: 'operation',
          name: '操作',
          flex: 20
        }
      ],
      contentList: [],
      inputVal: {
        name: '',
        json: '',
        type: '',
        protocol: '',
        local: false,
        default: 0
      },
      transformMap: {
        protocol: ['默认', '只读', '只写'],
        local: {
          false: '否',
          true: '是'
        }
      },
      typeOptions: ['Number', 'String', 'Boolean'],
      protocolOptions: ['默认', '只读', '只写']
    };
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
    // 弹出的input框
    inputConfig() {
      return {
        title: '添加字段类型',
        inputFormConfig: [
          {
            type: 'input',
            title: '字段名',
            placeholder: '请输入字段名称',
            required: true,
            default: this.inputVal.json,
            method: e => {
              this.inputVal.json = e.target.value;
            }
          },
          {
            type: 'input',
            title: '字段含义',
            placeholder: '请输入字段含义',
            required: true,
            default: this.inputVal.name,
            method: e => {
              this.inputVal.name = e.target.value;
            }
          },
          {
            type: 'select',
            title: '数据类型',
            default: 0,
            options: this.typeOptions,
            method: index => {
              this.inputVal.type = this.typeOptions[index];
            }
          },
          {
            type: 'select',
            title: '读/写',
            default: 0,
            options: this.protocolOptions,
            method: index => {
              this.inputVal.protocol = index;
            }
          },
          {
            type: 'input',
            title: '默认值',
            placeholder: '请输入字段默认值',
            defalut: 0,
            method: e => {
              this.inputVal.default = e.target.value;
            }
          },
          {
            type: 'switch',
            title: '是否本地字段',
            onText: '是',
            offText: '否',
            default: false,
            method: value => {
              this.inputVal.local = value;
            }
          }
        ],
        onConfirm: () => {
          this._add();
        }
      };
    }
  },
  created() {
    this.jsonDefineCopy = deepCopy(this.jsonDefine);
    this.updateData();
  },
  methods: {
    initInput() {
      this.inputVal = {
        name: '',
        json: '',
        type: this.typeOptions[0],
        protocol: 0,
        local: false,
        default: '0'
      };
    },
    // 初始化数据
    updateData() {
      const getContentList = () => {
        this.contentList = this.jsonDefineCopy.map(jsonInfo => {
          return this.titleList.map(title => {
            if (title.key === 'operation') return 'operation';
            if (title.key === 'default') return JSON.stringify(jsonInfo[title.key]);
            const trans = this.transformMap[title.key];
            if (trans) return trans[jsonInfo[title.key]];
            return jsonInfo[title.key];
          });
        });
      };
      getContentList();
    },
    settingDone() {
      this.$popup.hide();
    },
    async _add() {
      if (this.checkInput()) {
        this.$input.hide();
        const status = await this.outputHandler({
          type: 'add',
          addJson: this.inputVal
        });
        if (status) {
          this.jsonDefineCopy.push(deepCopy(this.inputVal));
          this.updateData();
        }
      }
    },
    _edit() {},
    _del(index) {
      const { json, name } = this.jsonDefineCopy[index];
      this.$confirm.show({
        content: `确定删除字段类型定义<strong style="color: rgb(128, 157, 225)">[${name}]</strong>吗？`,
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: async () => {
          const status = await this.outputHandler({
            type: 'del',
            json
          });
          if (status) {
            this.jsonDefineCopy.splice(index, 1);
            this.updateData();
          }
        }
      });
    },
    checkInput() {
      const { name, json } = this.inputVal;
      if ([name, json].includes('')) {
        this.$toast.info('字段名或字段含义不能为空');
        return false;
      }
      if (this.jsonDefineCopy.some(item => item.json === json)) {
        this.$toast.info('字段名已存在定义');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
$boderColorLighter: #ddd;
$boderColorBold: #aaa;
.gdp-json-define {
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
        overflow: hidden;
        &:hover {
          overflow-y: scroll;
          .gdp-json-define-list-content {
            width: calc(100% + 17px);
            padding-right: 0px;
          }
        }
        .gdp-json-define-list-content {
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
          text-align: center;
          border-bottom: 1px $boderColorLighter solid;
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
            border-bottom: 1px $boderColorLighter solid;
            flex: 20%;
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
}
</style>
