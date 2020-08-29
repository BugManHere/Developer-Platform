<template>
  <gree-popup v-model="showPopup" position="bottom">
    <div class="func-popup-bottom">
      <div class="popup-title" v-text="title" />
      <div class="popup-buttons">
        <gree-row>
          <gree-col
            v-for="(btn, index) in g_funcDefine_btn"
            :key="index"
            width="25"
            :class="{
              'set-gray': g_noDirectionFuncArr.includes(btn.identifier),
              'set-hide': powHideFuncArr.includes(btn.identifier) && !Pow
            }"
          >
            <!-- 图标 -->
            <div class="icon" @click="changeStatus(btn.identifier, g_noDirectionFuncArr.includes(btn.identifier))">
              <img :src="imgList[index].img" v-if="imgList[index].img" />
              <div v-else class="blank-btn">
                <img src="@/assets/img/functionBtn/blank.png" />
                <span v-html="imgList[index].text" class="blank-text" />
              </div>
            </div>
            <!-- 名称 -->
            <span :class="{ triangle: btn.page }" v-text="btnName[index]" @click="goPage(index, g_noDirectionFuncArr.includes(btn.identifier), btn.page)" />
          </gree-col>
        </gree-row>
      </div>
    </div>
  </gree-popup>
</template>

<script>
import { Row, Col, Popup } from 'gree-ui';
import { mapState } from 'vuex';
import LogicDefine from '../logic/define';
import LogicWatch from '../logic/watch';
import Customize from '../logic/customize';
// import {
//   showLoading,
// } from '../../../../../PluginInterface';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup
  },
  mixins: [LogicDefine, LogicWatch, Customize],
  data() {
    return {
      showPopup: false,
      title: '高级'
    };
  },
  mounted() {
    setInterval(() => {
      this.powHideFuncArr;
    }, 1000);
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow
    }),
    imgList() {
      if (!this.g_funcDefine_btn) return [];
      const result = [];
      this.g_funcDefine_btn.forEach(item => {
        let id = item.identifier;
        const statusName = this.g_noDirectionFuncArr.includes(id) ? 'default' : this.g_statusMap[id].define.name;
        const map = {};
        // 如果有图片就显示图片，没有图片就显示文字
        try {
          map.img = require(`../assets/img/functionBtn/${item.name}_${statusName}.png`);
        } catch (err) {
          try {
            map.img = require(`../assets/img/functionBtn/${item.name}_默认.png`);
          } catch (err) {
            err;
          }
          map.text = `${item.name}<br/>${statusName}`;
        }
        result.push(map);
      });
      return result;
    },
    btnName() {
      const result = this.g_funcDefine_btn.map(item => {
        const key = `btn.${item.identifier}`;
        const statusName = this.g_statusMap[item.identifier].define.name;
        const stateKey = `${key}_${statusName}`;
        let language = key;
        key === this.$language(key) || (language = this.$language(key));
        stateKey === this.$language(stateKey) || (language = this.$language(stateKey));
        return language;
      });
      return result;
    },
    // 关机下隐藏的功能
    powHideFuncArr() {
      const result = [];
      const powState = 'Pow_default'; // 定义关机的state
      for (const id in this.g_hideByStateMap) {
        let hide = true; // 是否隐藏标记
        let hasPow = false; // 是否pow相关标记
        for (const state in this.g_hideByStateMap[id]) {
          this.g_hideByStateMap[id][state].includes(powState) ? (hasPow = true) : (hide = false); // state因为关机被隐藏
        }
        hide && hasPow && result.push(id); // 如果所有state都因为关机被隐藏，则记录
      }
      return result;
    }
  },
  methods: {
    changeStatus(identifier, isGray) {
      if (isGray) return;
      const customize = this.g_nextStatusMap[identifier].customize;
      const currentStatus = this.g_statusMap[identifier].status; // 当前状态
      const nextStatus = this.g_nextStatusMap[identifier].status; // 下一状态
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, nextStatus);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, nextStatus);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, nextStatus);
          }, 0);
          break;
        default:
          break;
      }
      // 八度制热需要特殊处理
      if (identifier === 'StHt') {
        this.setState(['isStHt', true]);
      } else {
        this.setState(['isStHt', false]);
      }
      const setData = this.g_nextStatusMap[identifier].setData;
      this.changeData(setData);
    },
    goPage(index, isGray, able) {
      if (isGray || !able) return;
      const { routerName, params } = this.g_funcDefine_btn[index].page;
      try {
        showLoading();
      } catch {
        console.log('showLoading');
      }
      this.$router
        .push({
          name: routerName,
          params
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
