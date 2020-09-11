<template>
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
    headerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cardHeaderShow: false,
      headerTop: 0,
      temEditHeight: 0,
      scrollPos: 0,
      scrollTimer: null,
      scrollTimer2: null
    };
  },
  computed: {
    ...mapState({
      selectKey: state => state.selectKey
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
      }, 50);
    });
  },
  // 跳转回来时恢复滚动条
  activated() {
    this.ceiling();
    if (this.scrollPos) {
      this.$nextTick(() => {
        const dom = document.getElementsByClassName('page-content')[0];
        dom && dom.scrollTo(0, this.scrollPos);
      });
    }
  },
  deactivated() {
    this.ceiling(false, false);
    this.clearAllTimer();
    this.scrollTimer = null;
  },
  // 离开路由时清除定时器
  beforeRouteLeave(to, from, next) {
    this.clearAllTimer();
    this.scrollTimer = null;
    next();
  },
  watch: {
    // 吸顶效果
    cardHeaderShow(newVal) {
      this.ceiling(newVal);
    }
  },
  methods: {
    getScroll() {
      const dom = document.getElementsByClassName('page-content')[0];
      const currentScrollTop = dom.scrollTop;
      currentScrollTop && (this.scrollPos = currentScrollTop);
      const imshowTop = document.getElementsByClassName('tem-edit')[0].offsetHeight;
      if (currentScrollTop >= imshowTop) {
        this.cardHeaderShow = true;
      } else if (currentScrollTop < imshowTop) {
        this.cardHeaderShow = false;
      }
      this.$forceUpdate();
    },
    // 吸顶效果
    ceiling(isCeiling = this.cardHeaderShow, isCheck = true) {
      // isCheck: 是否检查当前headerId
      if (!this.headerId.includes(this.selectKey) && isCheck) return;
      this.$emit('isCeiling', isCeiling);
      if (isCeiling) {
        document.getElementById('blank-box').appendChild(this.$refs[this.headerId]);
      } else {
        this.$refs['header-box'].appendChild(this.$refs[this.headerId]);
      }
    },
    // 清除所有定时器
    clearAllTimer() {
      clearInterval(this.scrollTimer);
      clearTimeout(this.scrollTimer2);
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
