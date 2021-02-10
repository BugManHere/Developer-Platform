<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <router-view name="hidden" v-show="false" ref="hiddenComponent" />
  </div>
</template>
