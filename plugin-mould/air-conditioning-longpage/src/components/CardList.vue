<template>
  <div class="card-list" v-change-height:card-list-box>
    <div class="card-list-box">
      <card-group v-for="(card, cardIndex) in cardList" :key="cardIndex">
        <!-- 按钮组 -->
        <template v-slot:content>
          <div class="card-item" v-show="!card.hide">
            <!-- 左边 -->
            <div class="card-item-left" @click="showPopup(card.key)">
              <!-- 功能标识 -->
              <div class="card-item-left-main">
                <!-- 图标 -->
                <div class="card-item-left-main-icon iconfont" :class="`iconfont-${card.icon.key}`" />
                <div class="card-item-left-main-text">
                  <!-- 功能名字 -->
                  <p class="card-item-left-main-text-name" v-text="card.name" />
                  <!-- 底部文字 -->
                  <p class="card-item-left-main-text-footer" v-text="card.footer" />
                </div>
              </div>
              <!-- 描述文字 -->
              <p class="card-item-left-describe" :class="{ on: card.icon.type === 'on' }" v-text="card.describe" />
            </div>
            <!-- 右边 -->
            <div class="card-item-right">
              <!-- 按钮 -->
              <gree-switch class="card-item-right-switch" size="26px" :value="card.icon.type === 'on'" @click="card.handler(card.key)" />
            </div>
          </div>
        </template>
      </card-group>
    </div>
    <popup-group />
  </div>
</template>

<script>
import { Switch } from 'gree-ui';
import { glyphs } from '@assets/iconfont/iconfont.json';
import BtnGroup from '@/components/BtnGroup/index';
import CardGroup from '@/components/CardGroup/index';
import { mapMutations, mapState, mapGetters } from 'vuex';
import PopupGroup from '@/components/Popup/index';

export default {
  name: 'card-list',
  components: {
    [Switch.name]: Switch,
    [BtnGroup.name]: BtnGroup,
    [CardGroup.name]: CardGroup,
    [PopupGroup.name]: PopupGroup
  },
  computed: {
    ...mapState('control', {
      Mod: state => state.dataObject.Mod,
      CoolSvStTemMin: state => state.dataObject.CoolSvStTemMin || 18,
      HumiSvStTemMin: state => state.dataObject.HumiSvStTemMin || 18,
      HeatSvStTemMax: state => state.dataObject.HeatSvStTemMax || 18
    }),
    ...mapGetters(['cardFuncDefine', 'modTextKey', 'modCurrentStatusName']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    cardList() {
      if (!Object.keys(this.statusMap).length) return [];
      const result = this.cardFuncDefine.map(model => {
        const identifier = model.identifier;
        if (!this.statusMap[identifier])
          return {
            icon: {},
            handler: () => {
              console.log('Undefined function');
            }
          };
        // 当前status定义
        const status = this.statusMap[identifier].status;
        // 取名称
        const defaultNameKey = `btn.${identifier}`;
        const footerKey = `footer.${identifier}`;
        const describeKey = `describe.${identifier}`;

        const statusNameText = status.name;
        const stateNameText = `${defaultNameKey}_${statusNameText}`;

        const name = stateNameText === this.$language(stateNameText) ? this.$language(defaultNameKey) : this.$language(stateNameText);
        const footer = this.parseStr(footerKey);
        const describe = this.parseStr(describeKey);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        // 是否隐藏
        const hide = this.blindModelArr.includes(identifier);
        // 执行的方法
        const handler = (identifier, disable = false) => {
          disable || this.$stateMachine.nextStatus(identifier);
        };
        return { key: identifier, name, icon, hide, handler, footer, describe };
      });
      return result;
    },
    svstTextList() {
      if (this.modCurrentStatusName === 'status_1') return '上限';
      return '下限';
    },
    modText() {
      return this.$language(this.modTextKey);
    }
  },
  methods: {
    ...mapMutations('control', {
      SetPopup: 'SET_POPUP'
    }),
    parseStr(str) {
      //  没想好怎么处理，记得改
      if (str === 'describe.SvSt') {
        const { modText } = this;
        const jsonMap = {
          1: 'CoolSvStTemMin',
          2: 'HumiSvStTemMin',
          4: 'HeatSvStTemMax',
          6: 'HeatSvStTemMax',
          7: 'HeatSvStTemMax'
        };
        return this.$language(modText) + this.svstTextList + this[jsonMap[this.Mod]] + '℃';
      }
      return this.$language(str);
    },
    showPopup(key) {
      this.SetPopup({ [key]: true });
    }
  }
};
</script>

<style lang="scss">
.card-list {
  .card-item {
    // $cardPadding: 30px;
    // height: calc(160px - #{$cardPadding} * 2);
    height: 160px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: $cardPadding 0;
    &-left {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-main {
        height: 100%;
        width: 100%;
        margin-left: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &-icon {
          $iconHeight: 68px;
          background-image: linear-gradient(0deg, rgb(106, 194, 166), rgb(141, 214, 191));
          height: $iconHeight;
          width: $iconHeight;
          line-height: $iconHeight;
          margin-left: 56px;
          border-radius: 50%;
          font-size: 40px;
          color: #fff;
          text-align: center;
        }
        &-text {
          padding-left: 20px;
          &-name {
            font-size: 45px;
            color: #404657;
          }
          &-footer {
            font-size: 36px;
            color: #989898;
          }
        }
      }
      &-describe {
        text-align: right;
        width: 420px;
        font-size: 36px;
        margin-right: 24px;
        white-space: nowrap;
        color: #989898;
        &.on {
          color: #619ce5;
        }
      }
    }
    &-right {
      padding: 0 52px 0 24px;
      min-width: 138px;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &-switch {
        width: 100%;
      }
    }
  }
}
</style>
