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
    }
  },
  mounted() {
    const rem = parseFloat(document.documentElement.style.fontSize, 10);
    this.rem = rem;
    const width = 862 / 108 * rem;
    const height = 166 / 108 * rem;
    this.$refs.waveCanvas.width = width;
    this.$refs.waveCanvas.height = height;
    this.width = width;
    this.height = height;
    const minLineHeight = 36 / 108 * rem;
    this.lineInitHeight = minLineHeight;
    const maxLineHeight = height;
    // console.log('min:', minLineHeight, 'max:', maxLineHeight);
    this.lineHeightDiff = maxLineHeight - minLineHeight;
    this.ctx = this.$refs.waveCanvas.getContext('2d');
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(156, 78, 186, 0.2)');
    gradient.addColorStop(0.18, '#9c4eba');
    gradient.addColorStop(0.3, '#af82fc');
    gradient.addColorStop(0.65, '#77b1ff');
    gradient.addColorStop(0.85, '#64c0ff');
    gradient.addColorStop(1, 'rgba(100, 192, 255, 0.2)');
    this.ctx.fillStyle = gradient;
    this.init(rem);
  },
  methods: {
    init(rem) {
      const lineWidth = 5 / 108 * this.rem;
      let startX = 0;
      let startY = (this.height - this.lineInitHeight) / 2;
      const distance = 14 / 108 * this.rem; // 线条之间的间距
      for (let i = 0; i < this.lineCount; i++) {
        this.lines.push({x: startX, y: startY, width: lineWidth, height: this.lineInitHeight});
        this.ctx.fillRect(startX, startY, lineWidth, this.lineInitHeight);
        startX = i * (distance + lineWidth);
      }
    },
    $_draw() {
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        this.ctx.fillRect(line.x, line.y, line.width, line.height);
      }
    },
    $_loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.$_draw();
      requestAnimationFrame(this.$_loop.bind(this));
    },
    updateWave(waveHeight) {
      let wave = waveHeight * 60;
      console.log(this.lineHeightDiff);
      let delta = this.lineHeightDiff * (wave > 1 ? 1 : wave);
      let parts = this.lineCount / 3;
      let index = 0;
      const updatedLines = [];
      for (let i = 0; i < 3; i++) {
        let lines = this.lines.slice(index, index + parts);
        lines.forEach(line => {
          line.height = this.lineInitHeight + (delta * Math.random() * (i === 1 ?  1 : 0.5));
          line.y = (this.height - line.height) / 2;
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
}
</script>
