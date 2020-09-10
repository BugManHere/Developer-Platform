<template>
  <div class="func-popup-bottom">
    <div class="popup-title" v-text="title" />
    <div class="popup-buttons">
      <gree-row>
        <gree-col
          v-for="(btn, index) in btnList"
          :key="index"
          width="25"
          :class="{
            'set-gray': btn.gray,
            'set-hide': btn.hide
          }"
        >
          <!-- 图标 -->
          <div class="icon" @click="btn.func(btn.key)">
            <i class="iconfont" :class="{ [`iconfont-${btn.icon.key}`]: true, select: btn.icon.type === 'on' && !btn.gray }" />
          </div>
          <!-- 名称 -->
          <span :class="{ triangle: btn.page }" v-text="btn.name" @click="goPage(btn.page, btn.hide)" />
        </gree-col>
      </gree-row>
    </div>
  </div>
</template>

<script>
import { Row, Col, Popup } from 'gree-ui';
import { showLoading } from '@PluginInterface';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup
  },
  props: {
    title: {
      type: String,
      default: '高级'
    },
    btnList: {
      type: Array,
      default: () => {
        return [
          {
            key: 'Lig',
            name: '灯光',
            gray: false,
            hide: false,
            icon: {
              key: 'Lig',
              type: 'off'
            },
            page: {
              routerName: 'Lig'
            },
            func: () => {
              console.log('Lig');
            }
          }
        ];
      }
    }
  },
  methods: {
    goPage(page, isGray) {
      if (isGray || !page) return;
      const { routerName, params } = page;
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
