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
        type: [],
        titleList: [
          {
            name: '功能名称',
            key: 'name',
            type: 'edit'
          },
          {
            name: '标识符',
            key: 'identifier',
            type: 'edit'
          },
          {
            name: '控制字段',
            key: 'json',
            type: 'edit'
          },
          {
            name: '类型',
            key: 'type',
            type: 'edit',
            model: 'type',
            options: {
              'active-button': '高级按钮',
              'active-homeButton': '主页按钮',
              inertia: '隐性功能'
            }
          },
          {
            name: '状态简要',
            key: 'brief',
            type: 'brief'
          },
          {
            name: '操作',
            key: 'btn',
            type: 'btn',
            icons: [
              {
                key: 'disable',
                descript: '删除'
              }
            ]
          }
        ]
      };
    }
  }
};
</script>
