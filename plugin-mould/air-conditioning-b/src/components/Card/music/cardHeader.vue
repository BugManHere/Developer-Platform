<template>
  <div 
    class="music-header"
  >
    <!-- 左边文字 -->
    <div class="left">
      <div v-text="'点播'" @click="imshowType = 0" :class="{select: imshowType === 0}"/>
      <div v-text="'技能'" @click="imshowType = 1" :class="{select: imshowType === 1}"/>
    </div>
    <!-- 右边按钮 -->
    <div class="right">
      <img src="@assets/img/music/statistical.png" >
      <img src="@assets/img/music/history.png" >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imshowType: 0
    }
  },
};
</script>

<style lang="scss">
$headerHeight: 142px; 
$fontSize: 44px;
.music-header {
  position: relative;
  top: 0;
  border-bottom: 1px solid #F2F2F2;
  height: $headerHeight;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 100px 100px 0 0;
  width: 100%;
  .left {
    position: relative;
    padding: 62px 0 0 12px;
    font-size: $fontSize;
    width: 380px;
    display: flex;
    justify-content: space-around;
    div {
      width: 200px;
      display: flex;
      justify-content: center;
    }
    .select {
      color: rgb(0, 153, 255);
      border-bottom: 6px solid rgb(0, 153, 255);
    }
  }
  .right {
    position: relative;
    padding-top: 62px;
    width: 380px;
    display: flex;
    justify-content: flex-end;
    img {
      width: 60px;
      height: 54px;
      padding-right: 70px;
    }
  }
}
</style>
