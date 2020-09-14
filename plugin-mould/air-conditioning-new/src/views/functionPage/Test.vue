<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-test">
      <gree-header>
        接口测试
        <a class="header-clear" v-text="'清空字段'" slot="right" @click="clearAll" />
      </gree-header>
      <div class="json-list">
        <div
          class="json-item"
          v-for="(json, index) in imshowJson"
          :key="index"
          @click="delJsonItem(json, delJson)"
          v-clipboard:copy="json"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          <span v-text="json" class="json-name" />
          <span
            v-text="[undefined, ''].includes(jsonValue[json]) ? '无数据' : jsonValue[json]"
            class="json-value"
            :class="{ change: changeItem.includes(index) }"
          />
          <gree-icon name="close" size="md" v-show="delJson"></gree-icon>
        </div>
      </div>
      <div class="btn">
        <div>
          <span v-text="'添加'" @click="showDialog('addJson')" />
        </div>
        <div>
          <span v-text="'发送'" @click="showDialog('sendJson')" />
        </div>
        <div>
          <span v-text="delJson ? '取消' : '删除'" @click="delJson = !delJson" />
        </div>
        <div>
          <span v-text="'引入'" @click="showDialog('Introduce')" />
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
          ></gree-input-item>
        </div>
      </gree-dialog>
      <!-- 发送字段 -->
      <gree-dialog v-model="sendJson" title="发送字段" :btns="multiDialog" class="dialog-add-json">
        <div class="dialog-input" v-for="(item, index) in sendJsonList" :key="index">
          <gree-row>
            <gree-col>
              <gree-input-item
                spellcheck="false"
                placeholder="字段名"
                v-model="sendJsonList[index]"
                is-amount
                is-highlight
                clearable
                align="center"
              ></gree-input-item>
            </gree-col>
            <gree-col>
              <gree-input-item
                spellcheck="false"
                placeholder="字段值"
                v-model="sendValueList[index]"
                is-amount
                is-highlight
                clearable
                align="center"
              ></gree-input-item>
            </gree-col>
          </gree-row>
        </div>
        <gree-row v-for="(btnList, listIndex) in testBtns" :key="`${btnList[0]}${listIndex}`">
          <gree-button v-for="(btn, index) in btnList" type="primary" size="normal" @click="sendCmd(listIndex, index)" :key="index" v-text="btn" />
        </gree-row>
      </gree-dialog>
      <!-- 引入字段 -->
      <gree-dialog v-model="Introduce" title="引入模块" :btns="multiDialog" class="dialog-add-json">
        <gree-list>
          <gree-radio-list :options="jsonModel" v-model="selectModel" icon="check" icon-inverse></gree-radio-list>
        </gree-list>
      </gree-dialog>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Dialog, InputItem, Row, Col, Icon, List, Item, RadioList, Button } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { sendDataToDevice } from '@PluginInterface';
import LogicWatch from '@/logic/watch';

export default {
  name: 'Air',
  components: {
    [Header.name]: Header,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [InputItem.name]: InputItem,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [List.name]: List,
    [Item.name]: Item,
    [RadioList.name]: RadioList,
    [Button.name]: Button
  },
  mixins: [LogicWatch],
  data() {
    return {
      imshowJson: [],
      jsonValue: {},
      addJson: false,
      sendJson: false,
      Introduce: false,
      delJson: false,
      addJsonList: ['', '', '', '', ''],
      sendJsonList: ['', '', '', '', ''],
      sendValueList: ['', '', '', '', ''],
      changeItem: [],
      selectModel: 1,
      testBtns: [
        ['儿童偏冷', '儿童平和', '儿童偏热'],
        ['成人偏冷', '成人平和', '成人偏热'],
        ['老人偏冷', '老人平和', '老人偏热']
      ]
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devOptions: state => state.devOptions,
      mac: state => state.mac
    }),
    multiDialog() {
      return [
        {
          text: '取消'
        },
        {
          text: '确定',
          handler: this.confirmJson
        }
      ];
    },
    jsonModel() {
      return [
        {
          value: 0,
          text: '睡眠模块',
          json: [
            'AntiDirectBlow',
            'SmartSlpMod',
            'SmartSlpModEx',
            'StSlp1C',
            'StSlp1CInc',
            'StSlp1CSp',
            'StSlp1H',
            'StSlp1HInc',
            'StSlp1HSp',
            'StSlp2C',
            'StSlp2CInc',
            'StSlp2CSp',
            'StSlp2H',
            'StSlp2HInc',
            'StSlp2HSp',
            'StSlp3C',
            'StSlp3CInc',
            'StSlp3CSp',
            'StSlp3H',
            'StSlp3HInc',
            'StSlp3HSp',
            'StSlp4C',
            'StSlp4CInc',
            'StSlp4CSp',
            'StSlp4H',
            'StSlp4HInc',
            'StSlp4HSp',
            'SwhSlp',
            'SlpMod',
            'Slp1L1',
            'Slp1H1',
            'Slp1L2',
            'Slp1H2',
            'Slp1L3',
            'Slp1H3',
            'Slp1L4',
            'Slp1H4',
            'Slp1L5',
            'Slp1H5',
            'Slp1L6',
            'Slp1H6',
            'Slp1L7',
            'Slp1H7',
            'Slp1L8',
            'Slp1H8'
          ]
        },
        {
          value: 1,
          text: '控制字段',
          json: JSON.parse(this.devOptions.statueJson2)
        }
      ];
    }
  },
  mounted() {
    setInterval(async () => {
      try {
        const cols = this.imshowJson;
        const statueJson = JSON.stringify({
          mac: this.mac,
          t: 'status',
          cols
        });
        const _res = await sendDataToDevice(this.mac, statueJson, false);
        const res = JSON.parse(_res);
        this.changeItem = [];
        for (let i = 0; i < res.length; i += 1) {
          const json = cols[i];
          this.jsonValue[json] !== res[i] && res[i] !== '' && this.changeItem.push(i);
          this.jsonValue[json] = res[i];
        }
        this.$forceUpdate();
      } catch (e) {
        e;
      }
    }, 5000);
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      updateDataObject: 'UPDATE_DATAOBJECT',
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(obj) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(obj);
      this.sendCtrl(obj);
    },
    showDialog(key) {
      this[key] = true;
    },
    clearAll() {
      Dialog.confirm({
        title: '清空查询字段',
        content: '确定清空所有查询字段？',
        cancelText: '取消',
        confirmText: '确定',
        onConfirm: () => {
          this.imshowJson = [];
          this.jsonValue = {};
        },
        onCancel: () => console.log('[Dialog.confirm] cancel clicked')
      });
    },
    delJsonItem(json, isDel) {
      if (isDel) {
        const index = this.imshowJson.findIndex(item => item === json);
        this.imshowJson.splice(index, 1);
        this.$forceUpdate();
      }
    },
    onCopy() {
      Toast.info('复制成功', 1500, false);
    },
    onError() {
      Toast.info('复制失败，浏览器不支持', 1500, false);
    },
    async sendCmd(type, val) {
      this.sendJson = false;
      let res;
      const opt = [
        'SwhSlp',
        'SlpMod',
        'SmartSlpMod',
        'SmartSlpModEx',
        'StSlp1C',
        'StSlp1CInc',
        'StSlp1CSp',
        'StSlp1H',
        'StSlp1HInc',
        'StSlp1HSp',
        'StSlp2C',
        'StSlp2CInc',
        'StSlp2CSp',
        'StSlp2H',
        'StSlp2HInc',
        'StSlp2HSp',
        'StSlp3C',
        'StSlp3CInc',
        'StSlp3CSp',
        'StSlp3H',
        'StSlp3HInc',
        'StSlp3HSp',
        'StSlp4C',
        'StSlp4CInc',
        'StSlp4CSp',
        'StSlp4H',
        'StSlp4HInc',
        'StSlp4HSp'
      ];
      let p;
      let json;
      let _res;
      try {
        switch (type) {
          case 0:
            switch (val) {
              case 0:
                p = [1, 2, 4, 1, 1, 133, 1, 1, 133, 1, 300, 10, 6, 300, 10, 6, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
              case 1:
                p = [1, 2, 4, 2, 1, 138, 1, 1, 138, 1, 300, 10, 6, 300, 10, 6, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
              case 2:
                p = [1, 2, 4, 3, 1, 143, 1, 1, 143, 1, 300, 5, 6, 300, 5, 6, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
              default:
                break;
            }
            break;
          case 1:
            switch (val) {
              case 0:
                p = [1, 2, 4, 4, 1, 133, 1, 1, 133, 1, 240, 10, 6, 240, 10, 6, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
              case 1:
                p = [1, 2, 4, 5, 1, 138, 1, 1, 138, 1, 240, 10, 6, 240, 10, 6, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
              case 2:
                p = [1, 2, 4, 6, 1, 143, 1, 1, 143, 1, 240, 10, 6, 240, 10, 6, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1];
                break;
              default:
                break;
            }
            break;
          case 2:
            switch (val) {
              case 0:
                p = [1, 2, 4, 7, 60, 130, 1, 60, 130, 1, 180, 0, 6, 180, 0, 6, 240, 5, 6, 240, 5, 6, 300, 10, 6, 300, 10, 5];
                break;
              case 1:
                p = [1, 2, 4, 8, 60, 133, 1, 60, 133, 1, 180, 0, 6, 180, 0, 6, 240, 5, 6, 240, 5, 6, 300, 10, 6, 300, 10, 5];
                break;
              case 2:
                p = [1, 2, 4, 9, 60, 133, 1, 60, 133, 1, 180, 0, 6, 180, 0, 6, 240, 5, 6, 240, 5, 6, 0, 0, 1, 0, 0, 1];
                break;
              default:
                break;
            }
            break;

          default:
            break;
        }
        json = JSON.stringify({
          mac: this.mac,
          t: 'cmd',
          opt,
          p
        });
        res = await sendDataToDevice(this.mac, json, false);
        _res = JSON.parse(res);
        if (_res.r === 200) {
          Toast.info('发送成功', 1500, false);
        }
      } catch (e) {
        e;
      }
    },
    async confirmJson() {
      if (this.addJson) {
        this.addJson = false;
        this.addJsonList.forEach(json => {
          if (json !== '') {
            this.imshowJson.push(json);
            this.imshowJson = [...new Set(this.imshowJson)];
          }
        });
        this.addJsonList.fill('');
        this.$forceUpdate();
      } else if (this.sendJson) {
        this.sendJson = false;
        try {
          const sendData = {};
          this.sendJsonList.forEach((json, index) => {
            const value = Number(this.sendValueList[index]);
            if (value >= 0 && json !== '') {
              sendData[json] = value;
            }
          });
          const opt = Object.keys(sendData);
          if (!opt.length) return;
          const p = Object.values(sendData);
          const json = JSON.stringify({
            mac: this.mac,
            t: 'cmd',
            opt,
            p
          });
          console.table([opt, p]);
          this.updateDataObject(sendData);
          const res = await sendDataToDevice(this.mac, json, false);
          const { r } = JSON.parse(res);
          if (r === 200) {
            Toast.info('发送成功', 1500, false);
          }
        } catch (e) {
          e;
        }
      } else if (this.Introduce) {
        this.Introduce = false;
        const json = this.jsonModel[this.selectModel].json;
        json.forEach(json => {
          this.imshowJson.push(json);
          this.imshowJson = [...new Set(this.imshowJson)];
        });
      }
    }
  }
};
</script>

<style lang="scss">
.page-test {
  .gree-header {
    border-bottom: 1px solid #ddd;
    .header-clear {
      color: red;
    }
  }
  .json-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 10px;
    height: 1500px;
    overflow-y: auto;
    .json-item {
      display: flex;
      align-items: center;
      position: relative;
      height: 70px;
      width: auto;
      padding: 20px 15px;
      margin: 10px 10px;
      background-image: linear-gradient(to left, PowDerBlue, #89d9e4);
      border: 1px #00d0d0 solid;
      border-radius: 13px;
      font-size: 30px;
      color: #404657;
      .json-name {
        margin-right: 20px;
      }
      .json-value {
        color: blue;
        &.change {
          animation: json-value-hide 5s;
        }
      }
      i {
        position: relative;
        left: 10px;
        color: red;
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
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  @keyframes json-value-hide {
    0% {
      color: red;
    }
    100% {
      color: blue;
    }
  }
}
.dialog-add-json {
  .gree-dialog-content {
    width: 970px !important;
  }
}
</style>
