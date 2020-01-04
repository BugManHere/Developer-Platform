<template>
  <div class="enumerate-table">
    <GrTable :table-options="tableOptions"/>
  </div>
</template>

<script>
import GrTable from "@components/Table/index";

export default {
  components: {
    GrTable
  },
  data() {
    return {
      
    }
  },
  computed: {
    tableOptions() {
      return {
        type: ['self', 'enumerate'],
        titleList: ["功能名称", "标识符", "控制字段"],
        keyList: ['name', 'identifier', 'json'],
        operate: ['define', 'delete']
      };
    },
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