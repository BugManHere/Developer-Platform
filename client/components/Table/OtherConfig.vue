<template>
  <div class="other-config">
    <!-- 对勾动画 -->
    <div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: block;">
        <div class="swal2-success-circular-line-left" style="background: rgb(255, 255, 255);">
        </div>
        <span class="swal2-success-line-tip swal2-animate-success-line-tip"></span><span class="swal2-success-line-long swal2-animate-success-line-long"></span>
        <div class="swal2-success-ring">
        </div>
        <div class="swal2-success-fix" style="background: rgb(255, 255, 255);">
        </div>
        <div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);">
        </div>
    </div>
    <!-- 提示语 -->
    <div class="tip">
      <caption>已完成配置<br/>可在新窗口预览效果</caption>
    </div>
    <!-- 可选配置标题 -->
    <div class="header">
      <caption>可选配置</caption>
    </div>
    <!-- 可选配置设置 -->
    <div class="body optional">
      <div class="row">
        <div>
          <span v-text="'语音技能'"/>
          <label for="config-input">
            <input id="config-input" type="checkbox" v-model="voice">
            <span class="on" :class="{'on-hide': !voice}">ON</span>
            <span class="off" :class="{'off-hide': voice}">OFF</span>
            <div class="toggle-inner" :class="{right: voice}"></div>
          </label>
        </div>
        <div>
          <span v-text="'风速调节'"/>
          <label for="config-input">
            <input id="config-input" type="checkbox" v-model="voice">
            <select class="form-control"><option value="true">7档风</option><option value="false">否</option></select>
          </label>
        </div>
        <div>
          <span v-text="'温度间隔'" />
          <label for="config-input">
            <input id="config-input" type="checkbox" v-model="voice">
            <select class="form-control"><option value="true">0.1度</option><option value="false">否</option></select>
          </label>
        </div>
      </div>
    </div>
    <!-- 协议字段标题 -->
    <div class="header">
      <caption>协议字段</caption>
    </div>
    <!-- 协议字段设置 -->
    <div class="body json">
      <div class="row" style="margin-top: 10px">
        <div class="card-json-header">
          <span v-text="'小卡片状态同步字段'" />
        </div>
      </div>
      <div class="row">
        <div class="card-json" v-show="editJson !== 'card'">
          <div @click="editJson = 'card'">
            <span v-text="'Pow'" class="json-label"/>
            <span v-text="'Mod'" class="json-label"/>
            <span v-text="'TemUn'" class="json-label"/>
            <span v-text="'SetTem'" class="json-label"/>
            <span v-text="'Add0.5'" class="json-label"/>
            <span v-text="'Add0.1'" class="json-label"/>
            <span v-text="'PctCle'" class="json-label"/>
          </div>
        </div>
        <div class="text-box" contenteditable="true" v-show="editJson === 'card'" spellcheck="false">
          <div class="margin-view-overlays" contenteditable="false" >
            <div class="line-numbers" v-text="1"/>
          </div>
          <span>
            ["Pow","Mod","TemUn","SetTem","Add0.5","Add0.1","PctCle"]
          </span>
        </div>
      </div>
      <div class="row" style="margin-top: 30px">
        <div class="card-json-header">
          <span v-text="'插件状态同步字段'" />
        </div>
      </div>
      <div class="row" style="margin-bottom: 10px">
        <div class="plugin-json" v-show="editJson !== 'plugin'">
          <div  @click="editJson = 'plugin'">
            <span v-text="'Pow'" class="json-label"/>
            <span v-text="'Mod'" class="json-label"/>
            <span v-text="'SetTem'" class="json-label"/>
            <span v-text="'Add0.5'" class="json-label"/>
            <span v-text="'Add0.1'" class="json-label"/>
            <span v-text="'SwUpDn'" class="json-label"/>
            <span v-text="'SwingLfRig'" class="json-label"/>
            <span v-text="'Health'" class="json-label"/>
            <span v-text="'SwhSlp'" class="json-label"/>
            <span v-text="'SlpMod'" class="json-label"/>
            <span v-text="'AssHt'" class="json-label"/>
            <span v-text="'Lig'" class="json-label"/>
            <span v-text="'WdSpd'" class="json-label"/>
            <span v-text="'Tur'" class="json-label"/>
            <span v-text="'Quiet'" class="json-label"/>
            <span v-text="'AppTimer'" class="json-label"/>
            <span v-text="'PctCle'" class="json-label"/>
          </div>
        </div>
        <div class="text-box" contenteditable="true" v-show="editJson === 'plugin'" spellcheck="false" id="text" @keypress="logKey">
          <div class="margin-view-overlays" contenteditable="false" @click="getText">
            <div class="line-numbers" v-text="1"/>
            <div class="line-numbers" v-text="2"/>
          </div>
          <span v-text="'['"/>
          <span v-for="i in 20">
            "Pow"
          </span>
          <span v-text="']'"/>
          <!-- <span>
            ["Pow","Mod","SetTem","Add0.5","Add0.1","SwUpDn","SwingLfRig","Health","SwhSlp","SlpMod","AssHt","Lig","WdSpd","Tur","Quiet","AppTimer","PctCle"]
          </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      voice: false,
      editJson: false
    }
  },
  watch: {
    voice(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    getText() {
      const result = document.getElementById('text').innerText;
      console.log(result);
    },
    logKey(e) {
      console.log(e);
    }
  },
};
</script>
