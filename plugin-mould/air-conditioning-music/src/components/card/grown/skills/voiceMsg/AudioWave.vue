<template>
  <canvas ref="waveCanvas"></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: null,
      lines: [], // 需要绘制的线条集合
      width: 0, // canvas的宽度
      height: 0, // canvas的高度
      lineHeightDiff: 0, // 线的高度差（线的最大高度 - 线的初始高度）
      lineCount: 46, // 线的总条数
      lineInitHeight: 0, // 线条的初始高度,
      rem: 0, // 1rem的值
      ratio: 1 // 绘制比例
    };
  },
  mounted() {
    const rem = parseFloat(document.documentElement.style.fontSize, 10);
    this.rem = rem;
    this.ctx = this.$refs.waveCanvas.getContext('2d');
    this.ratio = this.$_getPixelRatio(this.ctx);
    console.log(`ratio: ${this.ratio}`);
    const width = (862 / 108) * rem;
    const height = (166 / 108) * rem;
    this.$refs.waveCanvas.style.width = `${width}px`;
    this.$refs.waveCanvas.style.height = `${height}px`;
    this.$refs.waveCanvas.width = width * this.ratio;
    this.$refs.waveCanvas.height = height * this.ratio;
    this.width = width * this.ratio;
    this.height = height * this.ratio;
    const minLineHeight = (36 / 108) * rem * this.ratio;
    this.lineInitHeight = minLineHeight;
    const maxLineHeight = this.height;
    // console.log('min:', minLineHeight, 'max:', maxLineHeight);
    this.lineHeightDiff = maxLineHeight - minLineHeight;
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, 'rgba(156, 78, 186, 0.2)');
    gradient.addColorStop(0.18, '#9c4eba');
    gradient.addColorStop(0.3, '#af82fc');
    gradient.addColorStop(0.65, '#77b1ff');
    gradient.addColorStop(0.85, '#64c0ff');
    gradient.addColorStop(1, 'rgba(100, 192, 255, 0.2)');
    this.ctx.fillStyle = gradient;
    this.init();
  },
  methods: {
    init() {
      const lineWidth = (5 / 108) * this.rem;
      let startX = 0;
      let startY = (this.height - this.lineInitHeight) / 2;
      const distance = (14 / 108) * this.rem; // 线条之间的间距
      for (let i = 0; i < this.lineCount; i += 1) {
        this.lines.push({ x: startX, y: startY, width: lineWidth, height: this.lineInitHeight });
        this.ctx.fillRect(startX, startY, lineWidth, this.lineInitHeight);
        startX = i * (distance + lineWidth);
      }
    },
    $_getPixelRatio(context) {
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    $_draw() {
      for (let i = 0; i < this.lines.length; i += 1) {
        const line = this.lines[i];
        this.ctx.fillRect(line.x * this.ratio, line.y, line.width * this.ratio, line.height);
      }
    },
    $_loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.$_draw();
      requestAnimationFrame(this.$_loop.bind(this));
    },
    updateWave(waveHeight) {
      let wave = waveHeight * 20;
      // console.log(this.lineHeightDiff);
      let delta = this.lineHeightDiff * (wave > 1 ? 1 : wave);
      let parts = this.lineCount / 3;
      let index = 0;
      const updatedLines = [];
      for (let i = 0; i < 3; i += 1) {
        let lines = this.lines.slice(index, index + parts);
        lines.forEach(line => {
          line.height = this.lineInitHeight + delta * Math.random() * (i === 1 ? 1 : 0.5); // eslint-disable-line
          line.y = (this.height - line.height) / 2; // eslint-disable-line
        });
        updatedLines.push(...lines);
        index += parts;
      }
      this.lines = updatedLines;
    },
    startWave() {
      this.$_loop();
    }
  }
};
</script>
