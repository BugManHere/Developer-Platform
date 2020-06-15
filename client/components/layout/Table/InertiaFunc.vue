<template>
  <div class="inertia-table">
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
        type: ['inertia'],
        titleList: ["功能名称", "标识符", "控制字段"],
        keyList: ['name', 'identifier', 'json'],
        operate: ['define', 'delete'],
        caption: '提示：惰性功能可参与到逻辑处理当中，一般有以下使用场景：1.已在模板中固定其布局；2.不作为布局显示。',
      };
    },
  },
}
</script>
