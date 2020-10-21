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
import music from '@/components/card/grown/music/Ball';

export default {
  name: 'App',
  components: {
    'music-ball': music
  }
};
</script>
