<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <!-- <router-view name="hidden" v-show="false" ref="hiddenComponent"></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
