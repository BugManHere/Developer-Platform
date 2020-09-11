<template>
  <div class="card-view">
    <div class="card-body">
      <!-- 内容 -->
      <div class="card-main" style="{height: 100%}">
        <keep-alive>
          <component :is="selectKey" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GrownCard from './grown/index';
import ControlCard from './control/index';

export default {
  components: {
    [GrownCard.name]: GrownCard,
    [ControlCard.name]: ControlCard
  },
  computed: {
    ...mapState({
      selectKey: state => state.selectKey
    })
  }
};
</script>
