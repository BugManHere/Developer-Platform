<template>
  <div id="app">
    <music-ball />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
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
