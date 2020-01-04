<template>
  <div
    ref="wrapper"
    class="carousel-wrapper"
    :style="{width: options.width, 'margin-left': options.marginLeft}"
    @touchstart="_touchstart"
  >
    <section
      v-if="options.isShow"
      class="container_mode"
      :style="{'height': options.height}"
    >
      <div
        ref="itemsWrapper"
        id="itemsWrapper"
        class="panels-backface-invisible"
        :style="{'width': options.spaceBetween, 'height': options.spaceBetween}"
      >
        <figure
          v-for="(item,index) in computedData"
          :key="index"
          @touchstart="changeMode"
          style="margin: 0 auto"
        >
          <div
            class="content-wrapper"
            :class="{hidden:selectId!=item.id && !isEdit
                       && options.controlMode == 1,
                     showThreeItems:index!=showThreeId[0]
                       &&index!=showThreeId[1]
                       &&index!=showThreeId[2]&&!isEdit
            &&options.threeOrAll==1}"
          >
            <div
              v-if="options.isShow && options.showNumOrImg"
              :style="{
                'height': options.height,
                'font-size': fontSizeChange[item.id],
                'margin-top': marginTopChange[item.id],
                'margin-left': marginLeftChange[item.id],
                'white-space': 'nowrap'
              }"
            >
              {{ item.content }}
              <span
                v-show="item.id % 2 && options.Has05"
                :style="{'font-size': '1.45rem', 'margin-left': '-40px', 'font-family': 'RobotoLight'}"
              >.5</span>
            </div>
            <img
              v-if="options.isShow && !options.showNumOrImg"
              :src="item.content"
              :style="{'height': options.height}"
            />
          </div>
        </figure>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
// setId 方法节流 的延时设置
const SETID_DELAY = 0;

// 横滚控件
function Carousel3D(el) {
  this.element = el;
  this.rotation = 0;
  //  选定的序号
  this.panelCount = 0;
  //  总共有多少序号（子元素个数）
  this.totalPanelCount = this.element.children.length;
  this.theta = 0;
  this.panelWith = 0;
  //  true为水平，false为竖直
  this.isHorizontal = false;
}

Carousel3D.prototype.modify = function modify() {
  let panel;
  let angle;

  this.panelSize = this.element[
    this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
  ];
  this.panelWith = this.panelSize;
  this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  this.theta = 360 / this.totalPanelCount;

  //  do some trig to figure out how big the carousel
  //  is in 3D space
  // 这里计算半径（决定滚轮整体的大小，子项间距）
  this.radius =
    Math.round(this.panelSize / 2 / Math.tan(Math.PI / this.totalPanelCount)) *
    this.radiusMutiply;

  for (let i = 0; i < this.totalPanelCount; i += 1) {
    panel = this.element.children[i];
    angle = this.theta * i;
    panel.style.opacity = 1;
    //  rotate panel, then push it out in 3D space
    //  在此处配置radius可改变布局密度 , 在此可修改angle来改变排布顺序
    panel.style.transform = `${this.rotateFn}(${angle}deg) translateZ(${this
      .radius * 1.5}px)`;
    panel.id = i;
  }

  //  adjust rotation so panels are always flat
  this.rotation = Math.round(this.rotation / this.theta) * this.theta;

  this.transform();
};

Carousel3D.prototype.transform = function transform() {
  this.element.style.transform = `translateZ(-${this.radius * 1.5}px) ${
    this.rotateFn
  }(${this.rotation}deg)`;
};

// 自带节流函数：使用 Data() 实现
// fn为需要包装的函数，cycle为时间间隔，单位毫秒
function throttle(fn, cycle) {
  let start = +Date.now();
  let now;
  let timer;
  return function() {
    now = +Date.now();
    clearTimeout(timer);
    if (now - start >= cycle) {
      fn.apply(this, arguments);
      start = now;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, cycle);
    }
  };
}

export default {
  name: 'Carousel3D',
  props: {
    propData: {
      type: Array,
      default() {
        return [111, 2, 3, 4, 5, 6, 7, 8, 999];
      }
    },
    options: {
      type: Object,
      default: function defaultInit() {
        return {
          isShow: true,
          controlAble: true,
          showNumOrImg: true,
          controlMode: 1,
          horizontal: true,
          threeOrAll: true,
          clickAble: false,
          width: '50%',
          marginLeft: '30%',
          height: '378px',
          fontSize: '32px',
          spaceBetween: '108px',
          radiusMutiply: 1,
          Has05: false
        };
      }
    }
  },
  data() {
    return {
      // 用于给 setId 方法 设置节流的 包装后方法存储位置
      throttleSetId: undefined,
      //  以下为内部属性
      //  实例出的carousel对象
      carousel: '',
      //  是否处于拖拽状态
      isEdit: false,
      isEditTime: '',
      //  计算移动距离相关
      startPosition: 0,
      lastPosition: 0,
      lastMoveStart: 0,
      lastMoveTime: 0,
      //  与数据对应的id
      selectId: 0,
      //  与子项对应的id
      selectOrderId: 0,
      multiple: 1
    };
  },
  computed: {
    //  为解决传入值数量可能过少的问题，通过传入值的数据来重新渲染一份用于循环渲染的数据
    //  规则：2个3个时乘5,4个时乘3,5-9个时乘2,10个及以上不处理
    computedData() {
      const tmpPropData = [];
      this.propData.forEach((item, index) => {
        const tmpItem = { id: index, content: item };
        tmpPropData.push(tmpItem);
      });

      const len = tmpPropData.length;
      const result = [];
      switch (len) {
        case 2:
        case 3:
          for (let i = 0; i < 5; i += 1) {
            result.push(...tmpPropData);
          }
          this.multiple = 5;
          return result;
        case 4:
          for (let i = 0; i < 3; i += 1) {
            result.push(...tmpPropData);
          }
          this.multiple = 3;
          return result;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          for (let i = 0; i < 2; i += 1) {
            result.push(...tmpPropData);
          }
          this.multiple = 2;
          return result;
        default:
          result.push(...tmpPropData);
          return result;
      }
    },
    showThreeId() {
      const threeId = [];
      this.selectOrderId - 1 < 0
        ? threeId.push(this.computedData.length - 1)
        : threeId.push(this.selectOrderId - 1);
      threeId.push(this.selectOrderId);
      this.selectOrderId + 1 > this.computedData.length - 1
        ? threeId.push(0)
        : threeId.push(this.selectOrderId + 1);
      return threeId;
    },
    fontSize0_5() {
      return (
        parseFloat(
          this.options.fontSize.slice(0, this.options.fontSize.length - 3)
        ) /
          2 +
        'rem'
      );
    },
    fontSizeChange() {
      const spacing = 360 / this.computedData.length;
      const numBorder = 360 / this.multiple;
      const maxSize = parseFloat(
        this.options.fontSize.slice(0, this.options.fontSize.length - 3)
      );
      const arr = [];
      let angle = this.carousel.rotation;
      if (angle > 0) {
        while (angle > numBorder) {
          angle -= numBorder;
        }
        angle = numBorder - angle;
      } else {
        while (angle <= -numBorder) {
          angle += numBorder;
        }
        angle = Math.abs(angle);
      }
      angle /= spacing;
      for (let i = 0; i < this.computedData.length; i += 1) {
        arr[i] = maxSize * 0.5 + 'rem';
      }
      if (angle % 1 >= 0.005 && angle % 1 <= 0.995) {
        let upnum = Math.ceil(angle);
        const downnum = Math.floor(angle);
        arr[upnum] = maxSize * (1 - (upnum - angle) * 0.5) + 'rem';
        arr[downnum] = maxSize * (1 - (angle - downnum) * 0.5) + 'rem';
        if (upnum >= this.computedData.length / 2 || downnum < 0) {
          arr[0] = maxSize * (1 - (upnum - angle) * 0.5) + 'rem';
        }
      } else {
        const num = Math.round(angle);
        arr[num] = maxSize + 'rem';
      }
      if (angle > this.computedData.length - 1) {
        arr[0] =
          maxSize * (1 - (this.computedData.length - angle) * 0.5) + 'rem';
      }
      return arr;
    },
    marginTopChange() {
      const arr = [];
      const maxSize = parseFloat(
        this.options.fontSize.slice(0, this.options.fontSize.length - 3)
      );
      for (let i = 0; i < this.computedData.length; i += 1) {
        arr[i] = parseFloat(
          this.fontSizeChange[i].slice(0, this.fontSizeChange[i].length - 3)
        );
        arr[i] = (maxSize - arr[i]) / 2 + 'rem';
      }
      return arr;
    },
    marginLeftChange() {
      const arr = [];
      const maxSize = parseFloat(
        this.options.fontSize.slice(0, this.options.fontSize.length - 3)
      );
      for (let i = 0; i < this.computedData.length; i += 1) {
        arr[i] = parseFloat(
          this.fontSizeChange[i].slice(0, this.fontSizeChange[i].length - 3)
        );
        arr[i] = (maxSize - arr[i]) * 0.707 + 'rem';
      }
      return arr;
    }
  },
  watch: {
    computedData: function computedData() {
      this.$nextTick(() => {
        this.redraw();
      });
    }
  },
  created() {
    this.throttleSetId = throttle(this._setId, SETID_DELAY);
  },
  mounted() {
    this.init_Mode();
  },
  methods: {
    // 重绘函数，用于动态传入数据时使用，根据当前的 computedData 重新计算并绘制
    redraw() {
      const tempSelectId = this.selectId;

      // 先保留当前选中的id，若新传入的值比现在多，则仍使用当前值，若
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      this.carousel.totalPanelCount = this.computedData.length;
      this.carousel.modify();
      const figures = itemsWrapper.getElementsByTagName('figure');
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.width = `${this.carousel.panelWith}px`;
      }

      //  此处单独设置取消了此操作的动画，需要切换动画时屏蔽此段代码
      // const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      // const figures = itemsWrapper.getElementsByTagName('figure');

      // 这一段代码用来给结束动作添加动画，但在调用重绘函数时，是不必要的
      itemsWrapper.style.transition = 'transform 0s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0s';
      }

      const contentWrapper = this.$el.querySelectorAll('.content-wrapper');
      contentWrapper[this.selectId].style.transition = 'opacity 0s';

      const exceed = this.propData.length - 1 - tempSelectId < 0;
      // 滚动到对应角度，
      this.selectId = exceed ? this.propData.length - 1 : tempSelectId;
      this.selectOrderId = this.selectId;
      this.carousel.rotation =
        -1 * this.carousel.theta * parseInt(this.selectId, 10);
      this.carousel.transform();
    },
    // 初始化函数
    init_Mode() {
      this.carousel = new Carousel3D(this.$el.querySelector('#itemsWrapper'));
      // 把对组件的配置项传入滚轮实例
      this.carousel.totalPanelCount = this.computedData.length;
      this.carousel.isHorizontal = this.options.horizontal;
      this.carousel.radiusMutiply = this.options.radiusMutiply || 1;
      this.carousel.modify();
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      const figures = itemsWrapper.getElementsByTagName('figure');
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.width = `${this.carousel.panelWith}px`;
      }
    },

    _touchstart(event) {
      if (
        !this.options.controlAble ||
        event.touches.item(0).identifier !==
          event.targetTouches.item(0).identifier
      )
        return;
      //  状态监控：
      event.preventDefault(); //  阻止浏览器默认事件，重要
      this.isEdit = true;
      this.isEditTime = event.timeStamp || Date.now();
      const touch = event.targetTouches[0];
      this.lastPosition = this.options.horizontal ? touch.pageX : touch.pageY;
      this.startPosition = this.lastPosition;
      this.lastMoveStart = this.startPosition;
      this.lastMoveTime = event.timeStamp || Date.now();
      this.initR_mode = this.carousel.rotation;
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      const figures = itemsWrapper.getElementsByTagName('figure');
      itemsWrapper.style.transition = 'transform 0s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0s';
      }
      this.$refs.wrapper.addEventListener('touchmove', this._touchmove);
      this.$refs.wrapper.addEventListener('touchend', this._touchend);
      this.$refs.wrapper.addEventListener('touchcancel', this._touchend);
    },
    _touchmove(event) {
      if (!this.options.controlAble) return;
      this.isEditTime = event.timeStamp || Date.now();
      if (event.targetTouches.length !== 0) {
        const nowX = this.options.horizontal
          ? event.touches[0].pageX
          : event.touches[0].pageY;
        this.lastPosition = nowX;
        //  根据move移动距离移动数字
        const moveX = this.options.horizontal
          ? nowX - this.startPosition
          : this.startPosition - nowX;

        const valpresect =
          (moveX / this.carousel.panelWith) * this.carousel.theta * 0.5;
        let ChangeRotate = valpresect;
        ChangeRotate = parseInt(ChangeRotate, 10);
        if (this.carousel.rotation !== ChangeRotate) {
          this.carousel.rotation = this.initR_mode + ChangeRotate;
          this.carousel.transform();
        }
        /**
         * 缓动代码
         */
        const nowTime = event.timeStamp || Date.now();
        if (nowTime - this.lastMoveTime > 300) {
          this.lastMoveTime = nowTime;
          this.lastMoveStart = nowX;
        }
      }
    },
    _touchend(event) {
      if (!this.options.controlAble) return;
      this.isEdit = false;
      this.isEditTime = event.timeStamp || Date.now();
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      const figures = itemsWrapper.getElementsByTagName('figure');
      // 这一段代码用来给结束动作添加动画，但在调用重绘函数时，是不必要的
      itemsWrapper.style.transition = 'transform 0.2s';
      for (let i = 0; i < figures.length; i += 1) {
        figures[i].style.transition = 'transform 0.2s';
      }

      const moveX = this.lastPosition - this.lastMoveStart;

      /**
       * 缓动代码
       */
      const nowTime = event.timeStamp || Date.now();
      const v = moveX / (nowTime - this.lastMoveTime); //  最后一段时间手指划动速度
      const dir = v > 0 ? -1 : 1; //  加速度方向
      const deceleration = dir * 0.0006;
      const duration = v / deceleration; //  速度消减至0所需时间
      const dist = ((v * duration) / 2) * 0; // 最终移动多少
      let val = parseInt(dist / (moveX * 2), 10);
      if (val > 15 || val < -15) {
        val = -1 * 15 * dir;
      }
      if (isNaN(val)) val = 0;
      // 根据方向补剩余移动量
      let tmp =
        (this.carousel.theta + (this.carousel.rotation % this.carousel.theta)) %
        this.carousel.theta;
      if (dir === 1) {
        // 手左滑
        // 不够20%不移动
        if ((tmp * 100) / this.carousel.theta < 80) {
          this.carousel.rotation = this.carousel.rotation - tmp;
          this.carousel.rotation +=
            Math.abs(val) * dir * -1 * this.carousel.theta;
        } else {
          // 复原
          this.carousel.rotation =
            this.carousel.rotation + (this.carousel.theta - Math.abs(tmp));
        }
      } else {
        // 手右滑
        tmp = this.carousel.theta - Math.abs(tmp);
        if ((tmp * 100) / this.carousel.theta < 80) {
          this.carousel.rotation = this.carousel.rotation + tmp;
          this.carousel.rotation +=
            Math.abs(val) * dir * -1 * this.carousel.theta;
        } else {
          this.carousel.rotation =
            this.carousel.rotation - (this.carousel.theta - Math.abs(tmp));
        }
      }
      this.carousel.transform();

      //  状态监控：
      this.isEdit = false;
      const selectIdTmp =
        Math.round(this.carousel.rotation / this.carousel.theta) %
        this.carousel.totalPanelCount;
      this.selectOrderId =
        this.carousel.rotation <= 0
          ? -selectIdTmp
          : this.carousel.totalPanelCount - selectIdTmp;
      this.selectId = this.selectOrderId % this.propData.length;
      //  向父组件传出事件：
      this.$emit('currentChange', this.selectId);
      this.clear();
    },
    clear() {
      this.$refs.wrapper.removeEventListener('touchstart', this.touchstart);
      this.$refs.wrapper.removeEventListener('touchmove', this._touchmove);
      this.$refs.wrapper.removeEventListener('touchend', this._touchend);
      this.$refs.wrapper.removeEventListener('touchcancel', this._touchend);
    },
    changeMode(e) {
      if (!this.options.controlAble) return;
      if (this.options.controlMode === 2 && this.options.clickAble) {
        const changeTo = e.currentTarget.id;
        const index = changeTo;
        //  这里切换时是不过分界线的，如果添加动画效果要注意添加越过边界处理逻辑
        this.carousel.rotation = -index * this.carousel.theta;
        this.carousel.transform();
      }
    },
    setId(id) {
      this.throttleSetId(id);
    },
    _setId(id) {
      // 性能优化
      let isInt = Number.isInteger(id); // 整数
      if (id === this.selectId || this.isEdit || !isInt || id < 0) return;
      //  此处单独设置取消了此操作的动画，需要切换动画时屏蔽此段代码
      const itemsWrapper = this.$el.querySelector('#itemsWrapper');
      itemsWrapper.style.transition = 'transform 0s';

      const contentWrapper = this.$el.querySelectorAll('.content-wrapper');
      contentWrapper[this.selectId].style.transition = 'opacity 0s';

      // 滚动到对应角度
      this.selectId = id;
      this.selectOrderId = this.selectId;
      this.carousel.rotation = -1 * this.carousel.theta * parseInt(id, 10);
      setTimeout(() => {
        this.carousel.transform();
      }, 20);
    }
  }
};
</script>

<style scoped>
/* 在此处设置渐显动画 */
.content-wrapper {
  color: #404657;
  opacity: 1;
  transition: opacity 0.5s;
  font-family: 'RobotoThin';
  /* font-family: appleUltralight, appleLight; */
}
/* 在此处设置渐隐动画 */
.hidden {
  opacity: 0;
  transition: opacity 0s;
}
.showThreeItems {
  opacity: 0;
  transition: opacity 0.5s;
}

.carousel-wrapper {
  display: block;
  text-align: center;
  width: 30%;
  display: flex;
  justify-content: center;
}
.carousel-wrapper:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
}

.container_mode {
  /* 在此可配置子项密度 */
  width: 30%;
  height: 378px;
  position: relative;
  display: flex;
  justify-content: center;
  perspective: 1100px;
}

#itemsWrapper {
  position: relative;
  text-align: center;
  margin: 0 auto;
  transform-style: preserve-3d;
}

.ready #itemsWrapper {
  transition: transform 1s;
}

#itemsWrapper.panels-backface-invisible figure {
  backface-visibility: hidden;
}

#itemsWrapper figure {
  display: block;
  position: absolute;
  height: auto;
  top: 10px;
  text-align: center;
}

.ready #itemsWrapper figure {
  transition: opacity 1s, transform 1s;
}

@keyframes modeAnimate {
  0% {
    opacity: 0;
    transform: translateY(-324px);
  }
  25% {
    transform: translateY(-432px);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-540px);
    opacity: 1;
  }
}
</style>
