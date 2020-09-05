<template>
  <canvas ref="waveCanvas"></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: null,
      particles: [],
      width: 0,
      height: 0,
      lineRange: 0,
    }
  },
  mounted() {
    const rem = parseFloat(document.documentElement.style.fontSize, 10);
    const width = 862 / 108 * rem;
    const height = 166 / 108 * rem;
    this.$refs.waveCanvas.width = width;
    this.$refs.waveCanvas.height = height;
    this.width = width;
    this.height = height;
    const minLineHeight = 36 / 108 * rem;
    const maxLineHeight = 166 / 108 * rem;
    console.log('min:', minLineHeight, 'max:', maxLineHeight);
    this.lineRange = maxLineHeight - minLineHeight;
    this.ctx = this.$refs.waveCanvas.getContext('2d');
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#9c4eba');
    gradient.addColorStop(0.3, '#af82fc');
    gradient.addColorStop(0.6, '#77b1ff');
    gradient.addColorStop(1, '#64c0ff');
    this.ctx.fillStyle = gradient;
    this.init(rem);
  },
  methods: {
    init(rem) {
      const particleHeight = 36 / 108 * rem;
      const particeWidth = 5 / 108 * rem;
      let startX = 0;
      let startY = (166 - 36) / 2 / 108 * rem;
      const distance = 14 / 108 * rem;
      for (let i = 0; i < 46; i++) {
        this.particles.push({x: startX, y: startY, width: particeWidth, height: particleHeight});
        this.ctx.fillRect(startX, startY, particeWidth, particleHeight);
        startX = i * (distance + particeWidth);
      }
    },
    $_draw() {
      for (let i = 0; i < this.particles.length; i++) {
        const line = this.particles[i];
        this.ctx.fillRect(line.x, line.y, line.width, line.height);
      }
    },
    $_loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.$_draw();
      requestAnimationFrame(this.$_loop.bind(this));
    },
    updateWave(waveHeight) {
      const particleHeight = 36 / 108 * rem;
      let startY = (166 - 36) / 2 / 108 * rem;
      let wave = waveHeight * 100;
      console.log(this.lineRange);
      let delta = this.lineRange * (wave > 1 ? 1 : wave);
      this.particles[23].height = particleHeight + delta;
      this.particles[23].y = (this.height - this.particles[23].height) / 2;
    },
    startWave() {
      this.$_loop();
    }
  }
}
</script>

<style>

</style>