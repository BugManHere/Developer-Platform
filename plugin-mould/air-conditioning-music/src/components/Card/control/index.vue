<template>
  <div class="grown-card">
    <!-- 头部 -->
    <GrownHeader />
    <!-- 内容 -->
    <FanContent />
    <FuncContent />
  </div>
</template>

<script>
import GrownHeader from '@/components/card/control/Header';
import FanContent from './content/fan';
import FuncContent from './content/func';

export default {
  components: {
    GrownHeader,
    FanContent,
    FuncContent
  }
};
</script>
