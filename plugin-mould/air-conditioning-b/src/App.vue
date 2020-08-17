<template>
  <div id="app">
    <music-ball />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import music from '@/components/Card/music/ball';

export default {
  name: 'App',
  components: {
    'music-ball': music
  },
  mounted() {
    // setTimeout(() => {
    //   document.body.addEventListener('touchmove', function(e) {
    //       e.preventDefault();
    //   }, {passive: false});
    // }, 1000);
  },
};
</script>
