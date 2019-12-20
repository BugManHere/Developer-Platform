<template>
  <div class="enumerate-table">
    <table class="table">
      <caption/>
    </table>
  </div>
</template>

<script>
import { deepCopy } from "@/utils";
import { mapMutations, mapState, mapActions } from "vuex";
import Panel from "@components/Panel/index";

export default {
  components: {
    Panel
  },
  data() {
    return {
      
    }
  },
  computed: {
    funcOptions() {
      return {
        title: ['功能名称']
      }
    }
  },
}
</script>

<style>

</style>