<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-test">
      <gree-header>接口测试</gree-header>
      <div class="json-list">
        <div class="json-item" v-for="(item, index) in imshowJson" :key="index">
          <span v-text="item" class="json-name"/>
          <span v-text="jsonValue[index]" class="json-value"/>
        </div>
      </div>
      <div class="btn">
        <div>
          <span v-text="'添加'" @click="showDialog('addJson')"/>
        </div>
        <div>
          <span v-text="'发送'" />
        </div>
      </div>
      <!-- 添加字段 -->
      <gree-dialog v-model="addJson" title="添加字段" :btns="multiDialog" class="dialog-add-json">
        <div class="dialog-input" v-for="(item, index) in addJsonList" :key="index">
          <gree-input-item
            spellcheck="false"
            placeholder="字段名"
            v-model="addJsonList[index]"
            is-amount
            is-highlight
            clearable
            align="center"
            :maxlength="10"
          ></gree-input-item>
        </div>
      </gree-dialog>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Dialog, InputItem } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  showToast,
  sendDataToDevice
} from '@PluginInterface';
import LogicWatch from '@/logic/watch';

export default {
  name: 'Air',
  components: {
    [Header.name]: Header,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [InputItem.name]: InputItem,
  },
  mixins: [LogicWatch],
  data() {
    return {
      imshowJson: new Set(['SwhSlp', 'SlpMod', 'Slp1L1', 'Slp1H1', 'Slp1L2', 'Slp1H2', 'Slp1L3', 'Slp1H3', 'Slp1L4']),
      jsonValue: [0, 1, 2, 3421412, 4, 5, 6, 7, 8321],
      addJson: false,
      addJsonList: ['SwhSlp', '', '', '', ''],
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
    }),
    multiDialog() {
      return [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: this.confirmJson
        },
      ]
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(obj) {
      this.setState(['watchLock', false]);
      this.setState(['ableSend', true]);
      this.setDataObject(obj);
      this.sendCtrl(obj);
    },
    showDialog(key) {
      switch (key) {
        case 'addJson':
          this.addJson = true;
          break;
      
        default:
          break;
      }
    },
    confirmJson() {
      this.addJson = false;
      this.addJsonList.forEach(json => {
        if (json !== '') {
          this.imshowJson.add(json);
          this.jsonValue.push('无数据');
        }
      });
      this.addJsonList.fill('');
    }
  }
};
</script>

<style lang="scss">
.page-test {
  .gree-header {
    border-bottom: 1px solid #ddd;
  }
  .json-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 10px;
    .json-item {
      display: flex;
      align-items: center;
      position: relative;
      height: 70px;
      width: auto;
      padding: 20px 15px;
      margin: 10px 10px;
      background-image: linear-gradient(to left, PowDerBlue, #89d9e4);
      border: 1px #00D0D0 solid;
      border-radius: 13px;
      font-size: 40px;
      color: #404657;
      .json-name {
        margin-right: 20px;
      }
      .json-value {
        &.change {
          animation: json-value-hide 4s;
        }
      }
    }
  }
  .btn {
    position: absolute;
    height: 200px;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    div {
      width: 151px;
      height: 151px;
      background-image: url('../../assets/img/functionBtn/blank.png');
      background-repeat:no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .dialog-add-json {
    
  }
  @keyframes json-value-hide {
    0% {color: red;}
    100% {color: #404657;}
  }
}
</style>
