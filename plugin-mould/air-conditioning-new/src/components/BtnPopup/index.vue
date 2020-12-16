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
          <div class="icon" @click="btn.func(btn.key, btn.gray)">
            <i class="iconfont" :class="{ [`iconfont-${btn.icon.key}`]: true, select: btn.icon.type === 'on' && !btn.gray }" />
          </div>
          <!-- 名称 -->
          <span :class="{ triangle: btn.page }" v-text="btn.name" @click="goPage(btn.page, btn.gray)" />
        </gree-col>
      </gree-row>
    </div>
  </div>
</template>

<script>
import { Row, Col } from 'gree-ui';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col
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
