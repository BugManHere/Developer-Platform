<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-skill-search-layout">
      <gree-header style="background-color: #fff;">技能搜索</gree-header>
      <div class="page-main">
        <div class="search-bar">
          <div class="search-input-wrapper">
            <input type="text" placeholder="请输入要搜索的内容" @input="onInput" @keydown.enter="onSearch" :value="value" />
            <gree-icon name="fail" size="md" @click="onClear" v-show="value"></gree-icon>
          </div>
          <gree-button round type="primary" @click="onSearch">搜索</gree-button>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
      <!-- 调用api失败时的遮罩页,点击重载页面 -->
      <error-overlay @reload="$emit('reload')" :show="showError" />
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header, Button, Icon } from 'gree-ui';
import ErrorOverlay from '../ErrorOverlay';
import { changeBarColor } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header,
    [Button.name]: Button,
    [Icon.name]: Icon,
    'error-overlay': ErrorOverlay
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    showError: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    })
  },
  created() {
    changeBarColor('#fffffe');
  },
  methods: {
    onSearch() {
      this.$emit('search', this.value);
    },
    onClear() {
      if (this.value) {
        this.$emit('input', '');
      }
    },
    onInput(e) {
      this.$emit('input', e.target.value);
    }
  }
};
</script>

<style lang="scss">
.page-skill-search-layout {
  background-color: #fff;
  .page-content {
    position: relative;
    padding-bottom: calc(0px + env(safe-area-inset-bottom));
    .page-main {
      height: 100%;
      display: flex;
      flex-direction: column;
      .search-bar {
        padding-top: 22px;
        padding-left: 42px;
        padding-bottom: 26px;
        display: flex;
        justify-content: space-between;
        .search-input-wrapper {
          flex: 1;
          padding: 0 32px 0 55px;
          border-radius: 110px;
          background-color: rgba($color: #000000, $alpha: 0.05);
          height: 110px;
          display: flex;
          align-items: center;
          input {
            font-size: 40px;
            background-color: transparent;
            outline: none;
            appearance: none;
            border: none;
            flex: 1;
            &::placeholder {
              color: rgba($color: #404657, $alpha: 0.3);
            }
            + .gree-icon {
              opacity: 0;
              color: #c5cad5;
              background: #f9fafb;
            }
            &:focus {
              + .gree-icon {
                opacity: 1;
              }
            }
          }
        }
        .gree-button {
          &.gree-button--normal {
            margin: 0px 24px;
          }
          &.gree-button--primary {
            font-size: 45px;
            background-color: #00aeff;
            height: 110px;
            line-height: 110px;
          }
        }
      }
      .content {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
}
</style>
