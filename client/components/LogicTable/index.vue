<template>
  <div class="logic-table">
    <div>
      <caption>
        提示：点击纵轴后是否执行横轴的互斥
      </caption>
      <!-- 添加标签- -->
      <div class="label-select" v-for="(option, type) in labelOptions" :key="type">
        <!-- 标题 -->
        <span class="label-theme">{{ option }}</span>
        <!-- 已添加的标签 -->
        <div class="label-body">
          <div v-for="(label, key) in labelList[type]" :key="key" class="name">
            {{label}}
            <span @click="removeOneLabel(type, key)"/>
          </div>
        </div>
        <!-- 按钮组 -->
        <div class="label-buttons">
          <span class="glyphicon glyphicon-remove-circle add-button" @click="addlabel"/>
          <span class="glyphicon glyphicon-remove-circle close-button" @click="removeLabel(type)"/>
        </div>
      </div>
      <!-- 互斥表格 -->
      <table class="table">
        <tbody>
          <tr v-for="index in 2">
            <td v-for="(item, key) in labelList.col" :key="key">
              {{item}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "@/utils";

export default {
  data() {
    return {
      tableItem: '是否执行互斥',
      labelOptions: {
        col: '纵轴',
        row: '横轴'
      },
      rowList: ['1','2'],
      colList: [],
      labelList: {
        col: {
          SwLR: '上下扫风',
          SwUD: '左右扫风',
          Sleep: '睡眠',
        },
        row: {

        }
      },
    };
  },
  methods: {
    removeOneLabel(type, key) {
      this.$delete(this.labelList[type], key);
    },
    removeLabel(type) {
      this.labelList[type] = {};
    },
    addlabel(type) {
    }
  },
};
</script>
