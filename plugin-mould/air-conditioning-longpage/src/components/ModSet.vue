<template>
  <card-group class="mod-set-group">
    <template v-slot:content>
      <btn-group :btn-list="btnList" />
    </template>
  </card-group>
</template>

<script>
import { mapGetters } from 'vuex';
import BtnGroup from '@/components/BtnGroup/index';
import CardGroup from '@/components/CardGroup/index';

export default {
  name: 'mod-set-group',
  components: {
    [BtnGroup.name]: BtnGroup,
    [CardGroup.name]: CardGroup
  },
  computed: {
    ...mapGetters(['modModels']),
    ...mapGetters('machine', ['statusLoop', 'statusMap']),
    btnList() {
      const result = [];
      this.modModels.forEach(model => {
        const statusNameList = this.getLoop(model);
        statusNameList.forEach(statusName => {
          const { identifier } = model;
          const currentStatusName = this.getCurrentStatusName(identifier);
          const stateName = `${identifier}_${statusName}`;
          // status定义
          const status = model.statusDefine[statusName];
          // 名称
          const statusNameText = status.name;
          const stateNameText = this.$language(`mod.${identifier}_${statusNameText}`);
          // 图标
          const icon = {
            key: status.icon.key,
            type: currentStatusName === statusName ? 'on' : 'off'
          };
          // 是否置灰
          const gray = false;
          // 是否隐藏
          const hide = false;
          // 跳转页面
          const page = false;
          // 执行的函数
          const handler = (_, disable = false) => {
            disable || this.$stateMachine.toStatus(identifier, statusName);
          };
          result.push({ key: stateName, name: stateNameText, icon, gray, hide, page, handler });
        });
      });
      return result;
    }
  },
  methods: {
    getLoop(model) {
      if (!model) return [];
      const { identifier } = model;
      let result = JSON.parse(JSON.stringify(this.statusLoop[identifier]));
      const startStatusName = 'default';
      const defaultIndex = result.findIndex(statusName => statusName === startStatusName);
      result.unshift(...result.splice(defaultIndex));
      return result;
    },
    getCurrentStatusName(identifier) {
      return String(this.statusMap[identifier].statusName);
    }
  }
};
</script>

<style lang="scss">
.mod-set-group {
  .icon {
    background: linear-gradient(rgba(150, 197, 255, 0.2), rgba(116, 175, 248, 0.2));
    .iconfont {
      color: rgba(107, 164, 251, 0.5);
    }
  }

  #btn-group-Mod_status_1,
  [id^='btn-group-SpMod'] {
    .icon {
      background: linear-gradient(rgba(240, 182, 115, 0.2), rgba(250, 210, 157, 0.2)) !important;
      .iconfont {
        color: rgba(247, 164, 54, 0.6) !important;
      }
    }
    &.select {
      .icon {
        background: linear-gradient(180deg, #f0b673, #fad29d) !important;
        box-shadow: 0 9px 21px #f0b673 !important;
        .iconfont {
          color: #fff !important;
        }
      }
    }
  }
}
</style>
