<template>
  <div class="active-table">
    <GrTable :table-options="tableOptions"/>
  </div>
</template>

<script>
import GrTable from "@components/layout/Table/index";

export default {
  components: {
    GrTable
  },
  computed: {
    tableOptions() {
      return {
        type: [],
        titleList: ["功能名称", "标识符", "控制字段", "功能类型"],
        keyList: ['name', 'identifier', 'json', 'type'],
        operate: ['delete'],
      };
    },
  },
}
</script>
