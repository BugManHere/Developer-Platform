<template>
  <!-- <div class="card-header" :style="cardHeaderShow ? { height: 0 } : {}"> -->
  <div ref="header-box">
    <div class="card-header" :ref="headerId" :id="headerId">
      <!-- 左边插槽 -->
      <div class="left">
        <slot name="left"></slot>
      </div>
      <!-- 右边插槽 -->
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    headerId: String
  },
  data() {
    return {
      cardHeaderShow: false,
      scrollPos: 0,
      scrollTimer: null,
      scrollTimer2: null,
      fadeHeader: null
    };
  },
  computed: {
    ...mapState({
      imshowType: state => state.musicData.imshowType
    })
  },
  mounted() {
    const dom = document.getElementsByClassName('page-content')[0];
    dom.addEventListener('scroll', this.getScroll);
    dom.addEventListener('touchmove', () => {
      clearTimeout(this.scrollTimer2);
      this.scrollTimer2 = setTimeout(() => {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }, 1500);
      if (this.scrollTimer) return;
      this.scrollTimer = setInterval(() => {
        this.getScroll();
      }, 20);
    });
  },
  // 跳转回来时恢复滚动条
  activated() {
    if (this.scrollPos) {
      this.$nextTick(() => {
        const dom = document.getElementsByClassName('page-content')[0];
        dom.scrollTo(0, this.scrollPos);
      });
    }
  },
  // 离开路由时清除定时器
  beforeRouteLeave(to, from, next) {
    clearInterval(this.scrollTimer);
    clearTimeout(this.scrollTimer2);
    this.scrollTimer = null;
    next();
  },
  watch: {
    // 吸顶效果
    cardHeaderShow(newVal) {
      if (newVal) {
        document.getElementById('blank-box').appendChild(this.$refs[this.headerId]);
      } else {
        this.$refs['header-box'].appendChild(this.$refs[this.headerId]);
      }
    }
  },
  methods: {
    getScroll() {
      const dom = document.getElementsByClassName('page-content')[0];
      const currentScrollTop = dom.scrollTop;
      currentScrollTop && (this.scrollPos = currentScrollTop);
      const imshowTop = document.getElementsByClassName('tem-edit')[0].offsetHeight;
      if (currentScrollTop >= imshowTop + 1) {
        this.cardHeaderShow = true;
      } else if (currentScrollTop < imshowTop) {
        this.cardHeaderShow = false;
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
$cardHeaderHeight: 142px;
$fontSize: 44px;
.card-header {
  position: relative;
  top: 0;
  height: $cardHeaderHeight;
  display: flex;
  background: #fff;
  border-radius: 100px 100px 0 0;
  width: 100%;
  justify-content: space-between;
  font-size: $fontSize;
}
</style>
