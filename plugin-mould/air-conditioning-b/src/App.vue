<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // setTimeout(() => {
    //   document.body.addEventListener('touchmove', function(e) {
    //       e.preventDefault();
    //   }, {passive: false});
    // }, 1000);
  },
};
</script>
