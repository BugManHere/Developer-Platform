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
        // 标题列表
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
              'active-button': '高级按钮',
              'active-homeButton': '主页按钮'
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
                value: 'page',
                key: 'page',
                descript: '插入页面',
                onDescript: '更换页面'
              },
              {
                key: 'disable',
                descript: '删除'
              }
            ]
          }
        ],
        caption: '提示：活跃功能具有额外的标识，可参与到布局当中，作为动态生成布局使用'
      };
    }
  }
};
</script>
