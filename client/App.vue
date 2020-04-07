<template>
  <div id="app">
    <Header />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <Confirm /> -->
  </div>
</template>

<script>
// import Confirm from '@/components/Confirm/index.vue';
import Header from '@/components/Header';

export default {
  name: 'app',
  components: {
    Header,
    // Confirm,
  }
}
</script>
