<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-nobodysave">
      <gree-header>{{ $language('humidify.title') }}</gree-header>
      <gree-list>
        <gree-list-item title="加湿设置">
          <gree-switch
            slot="after"
            v-model="isActive"
            @change="switchDazzling(isActive)"
          ></gree-switch>
        </gree-list-item>
      </gree-list>

      <div
        class="humi-wheel"
        :style="{ backgroundImage: 'url(' + humi_bg + ')' }"
        v-if="Humi"
      >
        <span class="humi-value">{{ Humi }}</span>
        <span class="humi-unit">%</span>
      </div>

      <gree-row class="humi-btn" v-show="Humi">
        <gree-col class="humi-col">
          <gree-button round type="default" style="width: 50%" :disabled="Humi===30" @click="changeHumiValue('subtract')">-</gree-button>
        </gree-col>
        <gree-col class="humi-col">
          <gree-button round type="default" style="width: 50%" :disabled="Humi===70" @click="changeHumiValue('add')">+</gree-button>
        </gree-col>
      </gree-row>
    </gree-page>
  </gree-view>
</template>

<script>
import {
  Header,
  Toast,
  Radio,
  RadioList,
  Switch,
  List,
  Item,
  Dialog,
  Row,
  Col,
  Button
} from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';

export default {
  name: 'Dazzling',
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
  },
  data() {
    return {
      isActive: true
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Humi: state => state.dataObject.Humi
    }),
    humi_bg() {
      console.log('this.Humi', this.Humi);
      return require(`@/assets/img/functionBtn/humi/humi_${this.Humi}.png`);
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        try {
          showToast('设备已被关闭，自动退出加湿设置。', 1);
        } catch (e) {
          Toast({
            content: '设备已被关闭，自动退出加湿设置。',
            position: 'bottom'
          });
        }
        this.$router.push({ name: 'Home' }).catch(err => {
          err;
        });
      }
    }
  },
  mounted() {
    hideLoading();
    this.isActive = Boolean(this.Dazzling);
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),

    switchDazzling(active) {
      if (active) {
        Dialog.confirm({
          title: '提示',
          content: '请确认机组是否具有加湿功能/模块,否则设置无效？',
          confirmText: '确定',
          onConfirm: () => this.setHumi(50),
          cancelText: '取消',
          onCancel: () => {
            this.isActive = false;
          }
        });
      } else {
        this.setHumi(0);
      }
    },

    setHumi(value) {
      const setData = { Humi: value };
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    },

    changeHumiValue(type) {
      const setData = {};
      if (type === 'add') {
        setData.Humi = this.Humi + 5;
      }
      if (type === 'subtract') {
        setData.Humi = this.Humi - 5;
      }
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    }
  }
};
</script>

<style lang="scss">
.page-nobodysave {
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  .gree-switch {
    font-size: 60px;
  }
  .humi-wheel {
    margin: 148px auto 0;
    height: 557px;
    width: 755px;
    text-align: center;
    background-size: 100% 100%;
    font-family: 'RoBoto';
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    .humi-value {
      font-size: 295px;
      color: #404657;
    }
    .humi-unit {
      position: absolute;
      bottom: 70px;
      left: 70%;
      font-size: 100px;
      color: #404657;
      }
  }
  .humi-btn{
    margin-top: 90px;
    .humi-col{
      text-align: center;
    }
  }
}
</style>
