<template>
  <div class="active-table">
    <GrTable :table-options="tableOptions"/>
  </div>
</template>

<script>
import GrTable from "@components/Table/index";

export default {
  components: {
    GrTable
  },
  computed: {
    tableOptions() {
      return {
        type: [],
        titleList: ["功能名称", "标识符", "控制字段"],
        keyList: ['name', 'identifier', 'json'],
        operate: ['delete'],
      };
    },
  },
}
</script>
