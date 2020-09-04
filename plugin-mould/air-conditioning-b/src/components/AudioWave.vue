<template>
  <canvas ref="waveCanvas"></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: null
    }
  },
  mounted() {
    const rem = parseFloat(document.documentElement.style.fontSize, 10);
    const width = 862 / 108 * rem;
    const height = 166 / 108 * rem;
    this.$refs.waveCanvas.width = width;
    this.$refs.waveCanvas.height = height;
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
      const particles = [];
      const particleHeight = 36 / 108 * rem;
      const particeWidth = 5 / 108 * rem;
      let startX = 0;
      let startY = (166 - 36) / 2 / 108 * rem;
      const distance = 14 / 108 * rem;
      for (let i = 0; i < 46; i++) {
        particles.push({x: startX, y: startY, width: particeWidth, height: particleHeight});
        this.ctx.fillRect(startX, startY, particeWidth, particleHeight);
        startX = i * (distance + particeWidth);
      }
    }
  }
}
</script>

<style>

</style>