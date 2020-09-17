<template>
  <div class="inertia-table">
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
        type: ['inertia'],
        // titleList: ['功能名称', '标识符', '控制字段', '类型'],
        // keyList: ['name', 'identifier', 'json', 'type'],
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
            type: 'option',
            model: 'type',
            options: {
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
                key: 'more',
                descript: '状态定义'
              },
              {
                key: 'disable',
                descript: '删除'
              }
            ]
          }
        ],
        caption: '提示：惰性功能可参与到逻辑处理当中，一般有以下使用场景：1.已在模板中固定其布局；2.不作为布局显示。'
      };
    }
  }
};
</script>
