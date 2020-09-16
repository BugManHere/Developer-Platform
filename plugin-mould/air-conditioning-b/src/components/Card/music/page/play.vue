<template>
  <gree-view class="page-view">
    <gree-page class="page-music-paly no-navbar" style="background: #bbb" @touchstart.native="listShow = false">
      <!-- 背景 -->
      <div class="page-bg">
        <img :src="albumImg" :class="{hide: bgTransition}"/>
      </div>
      <!-- 标题 -->
      <div class="page-header">
        <gree-header>
          <span slot="overwrite-left" class="gree-icon icon-font icon-back back md" style="color: #fff" @click="goBack"/>
          <span v-text="currentSongInfo.songName" style="color: #fff"/>
        </gree-header>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <!-- 中间的唱片部分 -->
        <div class="record">
          <div class="record-body">
            <img src="@/assets/img/music/record.png" class="record-bg">
            <img :src="albumImg" class="record-img" :class="{playing: musicPlaying}" v-if="!changeImg"/>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="bottom-btn">
          <div v-for="(btn, index) in btnList" :key="index" @touchend="btn.action">
            <img :src="btn.img" :class="btn.size"/>
          </div>
        </div>
        <!-- v-show="!cardHeaderShow" -->
        <!-- 内容列表 -->
        <transition-group 
          tag="div" 
          name="list">
          <div 
            class="list-title" 
            v-show="listShow"
            v-text="`播放列表（共${listLen}首）`" 
            key="title"
            @touchstart.stop
          />
          <div 
            class="song-list"
            v-show="listShow"
            key="list"
            @touchstart.stop>
            <!-- 列表内容 -->
            <div 
              v-for="(song, index) in currentPlaylist" 
              :key="index" 
              class="list-content" 
              :class="{select: song.songId === songId}"
              @click="changeSong(song.songId)">
              <div v-text="index + 1" id="index"/>
              <div id="name">
                <span v-text="song.songName"/>
                <span v-text="song.singerName" class="singer-name"/>
              </div>
              <img src="@/assets/img/music/drawable.png" v-show="song.songId === songId"/>
            </div>
          </div>
        </transition-group>
        <!-- 播放时间 -->
        <div class="play-time" v-text="playTime"/>
        <!-- 歌词 -->
        <div class="lyric">
          <!-- 歌词内容 -->
          <div 
            class="lyric-content" 
            @touchstart="setDragLyric(true)"
            @touchend="setDragLyric(false)" 
            @touchmove="dragLyric"
            @scroll="dragLyric">
            <!-- 内框 -->
            <div class="lyric-box">
              <p
                class="lyric-text"
                v-for="(item, index) in lyricArr" 
                :key="index" 
                v-text="item.text" 
                :class="{dragging: dragLyricIndex === index, playing: lyricIndex === index}"
              />
            </div>
          </div>
          <!-- 歌词定位 -->
          <div class="lyric-pos" v-show="isDragLyric">
            <div class="lyric-pos-left">
              <i class="gree-icon icon-font icon-arrow-right arrow-right lg"/>
            </div>
            <div class="lyric-pos-right">
              <span v-text="lyricArr[dragLyricIndex] ? parseTime(lyricArr[dragLyricIndex].time) : '00:00'"/>
            </div>
          </div>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { Header, Icon } from 'gree-ui';

export default {
  components: {
    [Header.name]: Header,
    [Icon.name]: Icon,
  },
  data() {
    return {
      lastSongId: '', // 上一次打开时的songId
      pageShow: false,
      listShow: false,
      bgTransition: false,
      lyricArr: [], // 解析后的歌词
      lyricHeader: [], // 暂时无用
      lyricIndex: -1, // 当前歌词index
      changeImg: false, // 更新唱片背景图，重新开始旋转
      SpchPlayPg: 0, // 播放进度，单位秒，整数
      SpchPlayPgMs: 0, // 播放进度，单位秒，两位小数
      scrollTimer: null, // 滚动事件用（平滑滚动）
      dragTimer: null, // 触摸事件用
      playTimer: null, // 计时用
      isDragLyric: false, // 正在拖拽歌词
      dragLyricIndex: -1, // 拖拽的歌词序号
      duration: 0, // 歌曲时长,单位毫秒
    };
  },
  computed: {
    ...mapState({
      musicPlaying: state => state.musicData.musicPlaying,
      songId: state => state.musicData.songId,
      songUrl: state => state.musicData.songUrl,
      albumImg: state => state.musicData.albumImg,
      currentPlaylist: (state, getters) => getters.currentPlaylist,
      currentSongInfo: (state, getters) => getters.currentSongInfo,
      lyric: (state, getters) => getters.lyric,
    }),
    listLen() {
      if (!this.currentPlaylist) return 0;
      return this.currentPlaylist.length;
    },
    btnList() {
      const result = [
        {
          img: require('@/assets/img/music/list.png'),
          action: this.showList
        },
        {
          img: require('@/assets/img/music/back.png'),
          action: this.preSong
        },
        {
          img: this.musicPlaying ? require('@/assets/img/music/stop.png') : require('@/assets/img/music/start.png'),
          size: 'big',
          action: () => { this.setMusicData({ musicPlaying: !this.musicPlaying }); }
        },
        {
          img: require('@/assets/img/music/forward.png'),
          action: this.nextSong
        },
      ];
      return result;
    },
    playTime() {
      return this.parseTime(this.SpchPlayPgMs);
    },
    // 歌词对应的高度/对应的滚动条位置
    lyricHeight() {
      const len = this.lyricArr.length;
      const result = Array.from({length: len}, (v, index) => {
        const lyricDom = document.getElementsByClassName('lyric-text')[index]; // 歌词dom
        const clientHeight = lyricDom.clientHeight; // 歌词高度
        const offsetTop = lyricDom.offsetTop; // 歌词高度
        return {
          clientHeight, // 歌词高度
          offsetTop // 歌词对应的滚动条位置
        };
      });
      return result;
    },
    // 歌词对应的滚动条高度
    lyricTop() {
      const dom = document.getElementsByClassName('lyric-content')[0]; // 拖动层dom
      const contentHeight = dom.clientHeight; // 拖动层高度
      const len = this.lyricArr.length; // 歌词长度
      const result = Array.from({length: len}, (v, index) => {
        const textHeight = this.lyricHeight[index].clientHeight; // 歌词高度
        const offsetTop = this.lyricHeight[index].offsetTop; // 歌词对应的滚动条位置
        // 歌词在box的位置（顶点） = (歌词srcoll位置) - (一半的拖动层高度) + (一半的歌词高度)
        const scrollTop = offsetTop - Math.floor(contentHeight / 2);
        // 歌词在box的位置（中心点） = (歌词srcoll位置) - (一半的拖动层高度) + (一半的歌词高度)
        const scrollCenter = offsetTop - Math.floor(contentHeight / 2) + Math.floor(textHeight / 2);
        return {
          scrollTop,
          scrollCenter
        };
      });
      return result;
    },
  },
  watch: {
    musicPlaying: {
      handler(newVal) {
        this.switchPlayTimer(newVal);
      },
      immediate: true
    },
    songId: {
      handler(newVal) {
        if (newVal) {
          // 初始化操作
          this.setMusicData({
            musicPlaying: false
          }); // 清空歌词/播放状态
          this.SpchPlayPgMs = 0; // 清空读秒
          this.lyricIndex = 0; // 清空歌词序号
          // 请求歌曲信息
          window.websock.onsend(JSON.stringify({
            data: {
              header: {},
              payload: {
                clientIp: '116.6.120.23',
                songsId: [this.songId]
              }
            }, 
            url: '/tme/song/infos'
          }));
          // 歌曲信息
          const data = {
            header: {},
            payload: {
              clientIp: '116.6.120.23',
              songId: this.songId
            }
          };
          // 请求歌词
          window.websock.onsend(JSON.stringify({
            data,
            url: '/tme/song/lyric'
          }));
          // 请求播放资源
          window.websock.onsend(JSON.stringify({
            data, 
            url: '/tme/song/url'
          }));
        }
      },
      immediate: true
    },
    // 切换歌曲
    currentSongInfo: {
      handler(newVal, oldVal) {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          if (this.albumImg) {
            this.changeImg = true;
            clearTimeout(this.bgTransition);
            this.bgTransition = setTimeout(() => {
              this.setMusicData({ albumImg: newVal.albumImg });
              this.changeImg = false;
              this.bgTransition = null;
            }, 500);
          } else {
            this.setMusicData({ albumImg: newVal.albumImg });
          }
        }
      },
      immediate: true,
      deep: true
    },
    // 歌词更新
    lyric: {
      handler(newVal, oldVal) {
        if (!newVal.length) {
          this.lyricIndex = 0;
          this.dragLyricIndex = 0;
          this.lyricArr = [{ time: '1.58', text: '暂无歌词\r' }];
          return;
        }
        this.parseLyric();
        // 更新歌词位置
        if (oldVal && oldVal.length) {
          this.lyricIndex = 0;
          this.dragLyricIndex = 0;
        }
        this.pageShow && document.getElementsByClassName('lyric-content')[0].scrollTo(0, 0);
        // 更新歌词
        this.updateLyric();
      },
      immediate: true
    },
    lyricIndex(newVal) {
      if (this.isDragLyric || newVal < 0) return;
      // 设定到该位置
      this.$nextTick(() => {
        this.scrollToPos(newVal);
      });
      // 同步更新拖拽index
      if (!this.isDragLyric) {
        this.dragLyricIndex = newVal;
      }
    },
    songUrl: {
      handler(newVal, oldVal) {
        console.log(newVal);
        // 获取需要的歌曲数据
        if (newVal && newVal.songId && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          // 是否可以播放
          // 0:可以
          // 1:海外地区不能播放
          // 2:歌曲无版权不能播放
          // 3:会员歌曲，非会员不能播放
          // 4:数字专辑，须购买才可播放
          // 5:方案策略，非会员不能播放
          // 6:因定向版权下架不能播放（针对APP有权但设备端无权的情况）
          // 9:未知原因,无权播放
          if (newVal.playableCode) {
            this.SpchPlayPgMs = Number((newVal.tryBegin / 1000).toFixed(2));
            this.duration = Number((newVal.tryEnd / 1000).toFixed(2));
          } else {
            this.SpchPlayPgMs = 0;
            this.duration = Number((newVal.duration / 1000).toFixed(2));
          }
          this.setMusicData({ musicPlaying: true });
          // this.switchPlayTimer(true);
        }
      },
      immediate: true,
      deep: true
    },
  },
  mounted() {
    const dom = document.getElementsByClassName('page-content')[0];
    dom.style.overflow = 'hidden';
    // this.switchPlayTimer(true);
  },
  activated() {
    this.setMusicData({showBall: false}); // 隐藏悬浮框
    this.pageShow = true;
    if (this.lyricIndex > 0 && this.songId === this.lastSongId) {
      this.$nextTick(() => {
        this.scrollToPos(this.lyricIndex, 1);
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setMusicData({showBall: true}); // 隐藏悬浮框
    this.pageShow = false; // 页面显示状态改为false
    this.lastSongId = this.songId;
    // 清空定时器
    this.$nextTick(() => {
      clearInterval(this.scrollTimer);
    });
    next();
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
    }),
    ...mapActions({
      musicControl: 'MUSIC_CONTROL',
    }),
    changeData() {

    },
    /**
     * @description 返回键
     */
    goBack() {
      // closePage();
      this.$router.go(-1);
    },
    showList() {
      this.listShow = true;
    },
    // 播放计时器
    switchPlayTimer(type) {
      clearInterval(this.playTimer);
      if (type) {
        // 计时
        this.playTimer = setInterval(() => {
          if (this.musicPlaying) {
            this.SpchPlayPgMs += 1.5;
            if (this.SpchPlayPgMs >= this.duration && this.musicPlaying) {
              // 清空歌词/播放状态
              this.setMusicData({
                musicPlaying: false
              }); 
              // 下一首
              this.nextSong();
            }
            this.updateLyric();
          }
        }, 100);
      }
    },
    // 换歌
    changeSong(songId) {
      if (songId !== this.songId) {
        // this.switchPlayTimer(false); // 关闭计时
        this.setMusicData({songId}); // 更新到vuex
      }
    },
    // 下一首歌
    preSong() {
      let nextIndex = this.currentPlaylist.findIndex(item => item.songId === this.songId);
      nextIndex ? nextIndex -= 1 : 0;
      const song = this.currentPlaylist[nextIndex];
      if (song) {
        this.setMusicData({ songId: song.songId });
      } else {
        this.setMusicData({ songId: '' });
      }
    },
    // 下一首歌
    nextSong() {
      const nextIndex = this.currentPlaylist.findIndex(item => item.songId === this.songId) + 1;
      const song = this.currentPlaylist[nextIndex];
      if (song) {
        this.setMusicData({ songId: song.songId });
      } else {
        this.setMusicData({ songId: '' });
      }
    },
    // 将时间转换成显示的格式
    parseTime(time) {
      const second = String(Math.round(time % 60)).padStart(2, 0);
      const minute = String(Math.floor(time / 60)).padStart(2, 0);
      return `${minute}:${second}`;
    },
    // 解析歌词文件
    parseLyric() {
      let lines = this.lyric.split('\n'); // 将文本分隔成一行一行，存入数组
      const pattern = /\[\d{2}:\d{2}.\d{2}\]/g; // 用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      const result = [];
      // 去掉不含时间的行
      while (!pattern.test(lines[0]) && lines.length) {
        this.lyricHeader.push(lines.shift(1));
      }
      // 如果空，退出
      if (!lines.length) {
        this.lyricArr = [{ time: '1.58', text: '暂无歌词\r' }];
        return;
      } 
      lines[lines.length - 1].length === 0 && lines.pop(); // 上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
      lines.forEach(val => {
        const time = val.match(pattern); // 提取出时间[xx:xx.xx]
        const text = val.replace(pattern, ''); // 提取歌词
        // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(tiemVal => {
          const t = tiemVal.slice(1, -1).split(':');
          result.push({
            time: (parseInt(t[0], 10) * 60 + parseFloat(t[1])).toFixed(2), 
            text
          });
        });
      });
      result.sort((a, b) => {
        return a.time - b.time;
      });
      this.lyricArr = result;
    },
    // 更新歌词位置
    updateLyric() {
      const currentTime = this.SpchPlayPgMs;
      // 定位歌词
      this.lyricIndex = this.getLyricPos(currentTime, this.lyricArr.map(item => item.time));
    },
    // 滑动到某个位置,index: 歌词index, type: 0缓慢 1快速
    scrollToPos(index, type = 0) {
      if (!this.pageShow) return;
      clearInterval(this.scrollTimer); // 清空缓慢滑动事件
      const dom = document.getElementsByClassName('lyric-content')[0]; // 拖动层dom
      const scrollVal = this.lyricTop[index].scrollCenter; // 要跳转到的高度
      if (type) {
        dom.scrollTo(0, scrollVal);
      } else {
        // 缓慢滑动效果
        this.scrollTimer = setInterval(() => {
          const currentVal = dom.scrollTop; // 当前的位置
          const leftVal = scrollVal - currentVal; // 剩余的滑动距离
          // 如果小于5，直接到此位置
          if (Math.abs(leftVal) <= 5) {
            dom.scrollTo(0, scrollVal);
            clearInterval(this.scrollTimer);
            return;
          }
          // 每次滑动剩余距离的6分之1（由快到慢的效果）
          const speed = (currentVal + leftVal / 6);
          dom.scrollTo(0, speed);
        }, 30);
      }
    },
    // 拖动歌词标志位
    setDragLyric(type) {
      if (type) {
        clearTimeout(this.dragTimer);
        clearInterval(this.scrollTimer);
        this.isDragLyric = true;
      } else {
        // 3秒后取消拖动标志位
        this.dragTimer = setTimeout(() => {
          this.isDragLyric = false;
        }, 3000);
      }
    },
    // 拖拽歌词实时显示
    dragLyric() {
      if (!this.pageShow) return;
      const scrollTop = document.getElementsByClassName('lyric-content')[0].scrollTop; // 获取滚动条高度
      this.dragLyricIndex = this.getLyricPos(scrollTop, this.lyricTop.map(item => item.scrollTop)); // 根据滚动条高度选择拖拽中心的歌词
    },
    // 返回歌词的位置,支持时间/拖动距离检索
    getLyricPos(val, arr) {
      const endIndex = arr.length - 1;
      const endVal = arr[endIndex];
      if (val >= endVal) return endIndex;
      // 定位歌词
      const result = arr.findIndex((targetVal, index) => {
        if (index) {
          return (val <= targetVal) && (val > arr[index - 1]);
        }
        return val < targetVal;
      }) - 1;
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
$headerHeight: 127px;
$contentHeight: calc(100vh - 127px - 790px - 234px - 350px);
$boxHeight: calc((100vh - 127px - 790px - 234px - 350px) / 2);
.page-view {
  position: relative;
}
.page-music-paly {
  .page-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    img {
      opacity: .5;
      filter: blur(105px) brightness(100%);
      height: 100%;
      width: 100%;
      transition: all 0.5s;
      &.hide {
        opacity: 0;
      }
    }
  }
  .page-header {
    position: absolute;
    top: 0;
    height: $headerHeight;
    z-index: 3;
    .gree-header {
      background-color: transparent !important;
      background-image: none;
    }
  }
  .page-main {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: calc(100vh - 126px);
    padding-top: $headerHeight;
    .record {
      position: relative;
      padding-top: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      .record-body {
        position: relative;
        height: 660px;
        width: 660px;
        .record-img {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: 50%;
          width: 400px;
          transform: translate(-50%, -50%) rotate(0deg);
          border-radius: 50%;
          animation: img-rotate linear 18s infinite;
          animation-play-state: paused;
          &.playing {
            animation-play-state: running;
          }
        }
        .record-bg {
          position: absolute;
          width: 100%;
          z-index: 3;
        }
      }
    }
    .bottom-btn {
      position: absolute;
      // padding: 78px;
      // width: calc(100vw - 156px);
      padding-bottom: 66px;
      width: 100%;
      height: 168px;
      bottom: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      div {
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 64px;
          &.big {
            height: 168px;
          }
        }
      }
    }
    .list-title {
      bottom: calc(50% - 1px);
      position: absolute;
      width: calc(100vw - 60px);
      height: 120px;
      // border-bottom: 0.5px solid #aaa;
      display: flex;
      align-items: center;
      font-size: 48px;
      border-radius: 100px 100px 0 0;
      background-color: #f5f5f5;
      padding-left: 60px;
      z-index: 7;
      background-image: linear-gradient(0deg, #000, #000 50%, transparent 0);
      background-position: 0% 100%;
      background-size: 100% 1px;
      background-repeat: no-repeat;
    }
    .song-list {
      position: absolute;
      bottom: 0;
      background-color: #f5f5f5;
      width: calc(100% - 100px);
      height: 50%;
      z-index: 6;
      padding: 0 50px;
      .list-content {
        position: relative;
        width: 100%;
        height: 150px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        border-bottom: 1px solid #dedede;
        #index {
          position: relative;
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 50px;
        }
        #name {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .singer-name {
            color: #666;
          }
        }
        img {
          width: 48px;
          height: 56px;
          padding-right: 16px;
        }
        &.select {
          color: rgba(0,174,255,1);
          .singer-name {
            color: rgba(0,174,255,1) !important;
          }
        }
      }
    }
    .play-time {
      color: rgba(255, 255, 255, 0.5);
      height: 150px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .lyric {
      $textHeight: 60px;
      $textPadding: 15px;
      $fontSize: 44px;
      position: relative;
      overflow: hidden;
      .lyric-content {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        height: $contentHeight;
        overflow: scroll;
        font-weight: 300;
        z-index: 2;
        .lyric-box {
          padding: $boxHeight 200px;
          height: fit-content;
          width: 100%;
          .lyric-text {
            position: relative;
            text-align: center;
            width: 100%;
            color: #fff;
            font-size: $fontSize;
            padding: $textPadding;
            opacity: 0.65;
            &.dragging {
              opacity: 0.85;
              font-weight: 500
            }
            &.playing{
              opacity: 1;
              font-weight: 500
            }
          }
        }
      }
      .lyric-pos {
        position: absolute;
        height: $textHeight + $textPadding * 2;
        width: 100%;
        font-size: $fontSize;
        color: rgba(255,255,255, 0.7);
        top: $boxHeight;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-image: linear-gradient(0deg, rgba(255,255,255, 0.8), rgba(255,255,255, 0.1) 50%, transparent 0);
        background-position: 50% 50%;
        background-size: 80% 1px;
        background-repeat: no-repeat;
        z-index: 1;
        .lyric-pos-left, .lyric-pos-right {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100px;
        }
        span {
          font-size: 12px;
        }
        i {
          font-size: 60px;
        }
      }
    }
  }
}
.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to {
  transform: translateY(50vh);
}
@keyframes img-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg);}
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
