<template>
  <div class="other-config">
    <!-- 对勾动画 -->
    <div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: block;">
      <div class="swal2-success-circular-line-left" style="background: rgb(255, 255, 255);" />
      <span class="swal2-success-line-tip swal2-animate-success-line-tip" />
      <span class="swal2-success-line-long swal2-animate-success-line-long" />
      <div class="swal2-success-ring" />
      <div class="swal2-success-fix" style="background: rgb(255, 255, 255);" />
      <div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);" />
    </div>
    <!-- 提示语 -->
    <div class="tip">
      <caption>
        已完成配置<br />可在新窗口预览效果
      </caption>
    </div>
    <!-- 标题：可选配置 -->
    <div
      @click="setFold(isFold.optional === 'optional' ? 'optional' : false)"
      class="header"
      :class="
        isFold.optional
          ? {
              'header-fold': true
            }
          : {
              'header-unfold': true
            }
      "
    >
      <div @click.stop="setFold('optional')" class="header-btn">
        <caption>
          可选配置
        </caption>
      </div>
    </div>
    <!-- 可选配置设置 -->
    <div
      class="body"
      :class="
        isFold.optional
          ? {
              'body-fold': true
            }
          : {
              'body-unfold': true
            }
      "
    >
      <div class="row" v-show="!isFold.optional">
        <!-- 语音技能 -->
        <div class="optional">
          <span v-text="'插件版本'" />
          <input type="text" class="form-control" id="inputText" v-model="pluginVer" style="text-align: center;" />
        </div>
        <!-- 语音技能 -->
        <div class="optional">
          <span v-text="'语音技能'" />
          <label for="config-input-voice">
            <input id="config-input-voice" type="checkbox" v-model="voiceSkill" />
            <span class="on" :class="{ 'on-hide': !voiceSkill }">ON</span>
            <span class="off" :class="{ 'off-hide': voiceSkill }">OFF</span>
            <div class="toggle-inner" :class="{ right: voiceSkill }"></div>
          </label>
        </div>
        <!-- 自动模式温度可控 -->
        <div class="optional">
          <span v-text="'自动模式温度可控'" />
          <label for="config-input-auto">
            <input id="config-input-auto" type="checkbox" v-model="autoAbleTem" />
            <span class="on" :class="{ 'on-hide': !autoAbleTem }">ON</span>
            <span class="off" :class="{ 'off-hide': autoAbleTem }">OFF</span>
            <div class="toggle-inner" :class="{ right: autoAbleTem }"></div>
          </label>
        </div>
        <!-- 温度间隔 -->
        <div class="optional">
          <span v-text="'温度间隔'" />
          <select class="form-control" v-model="temStep">
            <option value="0.1">0.1度</option>
            <option value="0.5">0.5度</option>
            <option value="1">1度</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 标题：协议字段 -->
    <div
      @click="setFold(isFold.optional === 'json' ? 'json' : false)"
      class="header"
      :class="
        isFold.json
          ? {
              'header-fold': true
            }
          : {
              'header-unfold': true
            }
      "
    >
      <div @click="setFold('json')" class="header-btn">
        <caption>
          协议字段
        </caption>
      </div>
    </div>
    <!-- 协议字段设置 -->
    <div
      class="json-eidtor"
      :class="
        isFold.json
          ? {
              'body-fold': true
            }
          : {
              'body-unfold': true
            }
      "
    >
      <jsonEditor
        :only-view="!pluginBlur"
        :json-arr="statueJson"
        title-content="小卡片字段"
        editKey="card"
        @isBlur="onBlur"
        @jsonArr="setJson"
        v-if="!isFold.json"
      />
      <jsonEditor
        :only-view="!cardBlur"
        :json-arr="statueJson2"
        title-content="插件字段"
        editKey="plugin"
        @isBlur="onBlur"
        @jsonArr="setJson"
        v-if="!isFold.json"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import jsonEditor from '@components/miniComponents/jsonEditor';

export default {
  components: {
    jsonEditor
  },
  data() {
    return {
      pluginVer: '1.0',
      voiceSkill: false, // 是否有'语音技能'
      autoAbleTem: false, // 自动模式下是否可设置温度
      temStep: '0.5', // 温度间隔
      fanRange: '7', // 多少档风
      statueJson: [], // 小卡片字段
      statueJson2: [], // 插件字段
      cardBlur: true,
      pluginBlur: true,
      isFold: {
        optional: false,
        json: true
      }
    };
  },
  mounted() {
    // 初始化数据，从服务器获取
    this.pluginVer = this.moreOption.pluginVer;
    this.voiceSkill = this.moreOption.voiceSkill;
    this.autoAbleTem = this.moreOption.autoAbleTem;
    this.temStep = this.moreOption.temStep;
    this.fanRange = this.moreOption.fanRange;
    this.statueJson = this.moreOption.statueJson;
    this.statueJson2 = this.moreOption.statueJson2;
    // 如果之前没有定义字段，自动生成
    if (this.statueJson.length === 0) {
      const jsonArr = [];
      this.funcImport.forEach(id => {
        const func = this.funcDefine.find(item => item._id === id);
        jsonArr.includes(func.json) || jsonArr.push(func.json);
        Object.keys(func.statusDefine).forEach(statusItem => {
          // 判断更多命令是否需要记录字段
          const moreCommand = func.statusDefine[statusItem].moreCommand;
          moreCommand &&
            Object.keys(moreCommand).forEach(moreJson => {
              jsonArr.includes(moreJson) || jsonArr.push(moreJson);
            });
        });
      });
      this.statueJson = jsonArr;
      this.statueJson2 = jsonArr;
    }
  },
  computed: {
    ...mapState({
      moreOption: (state, getters) => getters.currentDevice.moreOption,
      funcDefine: (state, getters) => getters.funcDefine,
      funcImport: (state, getters) => getters.funcImport
    }),
    input() {
      return {
        pluginVer: this.pluginVer,
        voiceSkill: this.voiceSkill,
        autoAbleTem: this.autoAbleTem,
        temStep: this.temStep,
        fanRange: this.fanRange,
        statueJson: this.statueJson,
        statueJson2: this.statueJson2
      };
    }
  },
  watch: {
    input: {
      handler(newVal) {
        this.setDevModule({ moreOption: newVal });
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setDevModule: 'SET_DEV_MODULE'
    }),
    onBlur(val) {
      const targetBlur = { card: 'cardBlur', plugin: 'pluginBlur' }[val.key];
      this[targetBlur] = val.isBlur;
    },
    setJson(val) {
      const targetArr = { card: 'statueJson', plugin: 'statueJson2' }[val.key]; // 先获取目标字段数组
      this[targetArr] = val.jsonArr;
    },
    setFold(key) {
      if (!key) return;
      const val = !this.isFold[key];
      this.$set(this.isFold, key, val);
    }
  }
};
</script>
