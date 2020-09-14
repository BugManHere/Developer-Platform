<template>
  <div class="active-table">
    <GrTable :table-options="tableOptions" />
  </div>
</template>

<script>
import GrTable from '@components/layout/Table/index';

export default {
  components: {
    GrTable
  },
  computed: {
    tableOptions() {
      return {
        type: ['active'],
        titleList: ['功能名称', '标识符', '控制字段'],
        keyList: ['name', 'identifier', 'json'],
        operate: ['insert', 'define', 'delete'],
        caption: '提示：活跃功能具有额外的标识，可参与到布局当中，作为动态生成布局使用'
        // operate: ['define', 'delete']
      };
    }
  }
};
</script>
