<template>
  <div id="app">
    <Header />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header';

export default {
  name: 'app',
  components: {
    Header,
  }
}
</script>
