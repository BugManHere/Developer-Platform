<template>
  <div :style="getPosition" class="sticky">
    <div ref="sticky-warp" class="sticky-warp">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vue-sticky',
  data() {
    return {};
  },
  computed: {
    getPosition() {
      const position = this.cssSupport('position', 'sticky') ? 'sticky' : 'relative';
      return 'position:' + position;
    }
  },
  props: {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  deactivated() {
    if (this.cssSupport('position', 'sticky')) {
      return;
    }
    /*复位*/
    const elWarp = this.$refs['sticky-warp'];
    elWarp.style.position = 'relative';
  },
  methods: {
    init() {
      if (this.cssSupport('position', 'sticky')) {
        return;
      }
      const el = this.$el,
        target = document.getElementsByClassName('page-content')[0],
        elWarp = this.$refs['sticky-warp'],
        top = this.getNumberValue(document.defaultView.getComputedStyle(el).top);
      const height = elWarp.clientHeight - 2;
      this.addScrollListen(target, () => {
        if (el.getBoundingClientRect().top <= top + height) {
          elWarp.style.position = 'fixed';
        }
        if (el.getBoundingClientRect().top >= height && elWarp.style.position != 'relative') {
          elWarp.style.position = 'relative';
        }
      });
    },
    cssSupport: function(attr, value) {
      const element = document.createElement('div');
      if (attr in element.style) {
        element.style[attr] = value;
        return element.style[attr] === value;
      } else {
        return false;
      }
    },
    getNumberValue(pxValue) {
      const value = String(pxValue).match(/^-?\+?[0-9]+/g);
      return value ? Number(value) : undefined;
    },
    addScrollListen(target, cb) {
      target.addEventListener('scroll', event => {
        cb && cb(event);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.sticky {
  width: 100%;
  top: 0;
  .sticky-warp {
    width: 100%;
    background: inherit;
    will-change: change;
    height: inherit;
    top: inherit;
  }
}
</style>
