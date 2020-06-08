<template>
  <div class="eidtor">
      <!-- 标题 -->
      <div class="row" style="margin-top: 10px">
        <div class="json-header">
          <span v-text="titleContent" />
        </div>
      </div>
      <!-- 内容-小卡片字段 -->
      <div class="row">
        <!-- 预览字段 -->
        <div 
          class="preview-json"
          :style="{height: editorHeight ? `${editorHeight}px` : '72px'}"
          v-show="onlyView || (isBlur && isInit)">
          <div @mouseup="changeShow">
            <!-- 内容 -->
            <span 
              v-for="(text, index) in jsonArr"
              :key="index"
              class="json-label"
              v-text="text"/>
          </div>
        </div>
        <!-- 编辑字段 -->
        <span
          :id="editKey"
          class="text-box" 
          spellcheck="false"
          v-show="!onlyView && (!isBlur || !isInit)"
          @mousedown="setEdit(true)"
          @mouseup="setEdit(false)"
          @mouseleave="setEdit(false);getFocus()"
          >
          <!-- 提示栏 -->
          <div class="box-tip" contenteditable="false">
            <transition name="fade">
              <div class="box-message" v-text="'JSON格式不正确'" v-show="imshowTip"/>
            </transition>
            <div class="box-btn btn-copy" title="复制" @click="copyEvent" @blur.prevent/>
            <div class="box-btn btn-restore" title="还原" @click="restoreEvent"/>
            <div class="box-btn btn-close" title="关闭" @click="closeEvent"/>
          </div>
          <!-- 序号 -->
          <div class="margin-view-overlays" contenteditable="false">
            <div v-for="num in indexNum" class="line-numbers" v-text="num" :key="num"/>
          </div>
          <!-- 内容 -->
            <span
              id="editor"
              class="json-content"
              contenteditable="true"
              v-text="statueJson" 
              v-focus="!isBlur"
              @blur="onBlur"
              @keydown.enter.prevent
              @paste.prevent
              @keyup="updateEditor()"
              />
        </span>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    // 组件的key
    editKey: {
      type: String,
      default: 'defultKey'
    },
    titleContent: {
      type: String,
      default: '无标题'
    },
    // 是否只读,不能编辑
    onlyView: {
      type: Boolean,
      default: false
    },
    // 输入的json
    jsonArr: {
      type: Array,
      default: () => {
        return ['test'];
      }
    }
  },
  data() {
    return {
      editorHeight: false, // 预览框高度
      isInit: false, // 是否初始化完毕
      indexNum: 1, // 编辑框左边的序号
      statueJson: ['a','b'], // 编辑框里面的文字
      imshowTip: false, // 是否显示提示
      isBlur: true,  // 是否失去焦点
      isEditing: false, // 是否在复制中
      initText: "", // 初始文本
    }
  },
  computed: {
    // 当前编辑框
    editDom() {
      return document.getElementById(this.editKey);
    }
  },
  watch: {
    isBlur(newVal) {
      if (newVal) return;
      // 获取初始显示的文本
      this.$nextTick(() => {
        this.initText = this.editDom.getElementsByClassName('json-content')[0].innerText;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
    // 获取初始数据
      this.statueJson = this.jsonArr;
      // 重定义粘贴事件
      this.addPasteEvent();
      // 改变编辑器的序号、预览框高度
      this.updateEditor();
      this.$nextTick(() => {
        // 初始化完毕，显示预览框
        this.isInit = true;
      });
    });
  },
  methods: {
    // 将粘贴内容去格式
    // 注：该方法粘贴后不能撤回，有更好的办法可以更换
    addPasteEvent() {
      const ele = this.editDom.getElementsByClassName('json-content')[0];
      // 绑定粘贴事件
      ele.addEventListener('paste', e => {
        if (e.clipboardData) {
           // 阻止默认行为
          e.preventDefault();
          const clipboardData = e.clipboardData, 
            // 获取剪贴板的文本
            text = clipboardData.getData('text');
          if (window.getSelection && text !== '' && text !== null) {
            // 创建文本节点
            const textNode = document.createTextNode(text),
            // 在当前的光标处插入文本节点
              range = window.getSelection().getRangeAt(0);
            // 删除选中文本
            range.deleteContents();
            // 插入文本
            range.insertNode(textNode);
            // 移动光标
            // range.collapse(false);
          }
        }
      });
    },
    // 编辑时动态改变编辑器状态：序号、预览框高度
    updateEditor() {
      this.$nextTick(() => {
        const h = this.editDom.offsetHeight;
        // 动态改变预览框高度
        this.editorHeight = h;
        // 根据编辑框的高度获取排序
        this.indexNum = h ? Math.floor((h - 72) / 40) + 1 : 0;
        const el = this.editDom;
        let text = el.getElementsByClassName('json-content')[0].innerText.replace(/\s+/g, '');
        if (text === '') {
          el.getElementsByClassName('json-content')[0].innerText = '[]';
        }
      });
    },
    // 点击切换显示
    changeShow() {
      // 如果开启只显示模式，则不能切换到编辑框
      if (this.onlyView) return;
      // 判断焦点
      if (!this.isBlur) {
        // 失去焦点
        this.onBlur();
      } else {
        // 获取焦点
        this.isBlur = false;
        this.$emit('isBlur', {
          isBlur: false,
          key: this.editKey
        });
      }
    },
    // 切换回预览框的时候进行处理
    onBlur() {
      const el = this.editDom;
      if (!el || this.isEditing) return;
      //  获取复制文本,去空格
      let text = el.getElementsByClassName('json-content')[0].innerText.replace(/\s+/g, '');
      try {
        // 解析Json
        this.statueJson = JSON.parse(text);
        // 解析Json成功，不显示提示
        this.imshowTip = false;
        // 提交事件，传递json
        this.$emit('jsonArr', {
          jsonArr: this.statueJson,
          key: this.editKey
        });
        // 失去焦点
        this.isBlur = true;
        this.$emit('isBlur', {
          isBlur: true,
          key: this.editKey
        });
      } catch(e) {
        // 解析josn失败，弹出提示
        this.imshowTip = true;
      }
    },
    // 复制事件
    copyEvent() {
      this.setEdit(true); // 设置编辑中标志位
      const el = this.editDom;
      //  获取复制文本,去空格
      let text = el.getElementsByClassName('json-content')[0].innerText.replace(/\s+/g, '')
      // 等待复制完成
      this.$copyText(text)
        .then(() => {
          this.$toast.info('复制成功');
          this.setEdit(false); // 取消编辑中标志位
        }, () => {
          this.$toast.error('复制失败，请手动复制');
          this.setEdit(false); // 取消编辑中标志位
        });
    },
    // 还原文本
    restoreEvent() {
      this.setEdit(true); // 设置编辑中标志位
      const el = this.editDom.getElementsByClassName('json-content')[0];
      // 将文本还原成初始文本
      el.innerText = this.initText;
      // 更新高度
      this.updateEditor();
      this.setEdit(false); // 取消编辑中标志位
    },
    // 关闭编辑
    closeEvent() {
      // 还原文本，不保存更改
      this.restoreEvent();
      // 失去焦点
      this.isBlur = true;
      this.$emit('isBlur', {
        isBlur: true,
        key: this.editKey
      });
    },
    // 设置编辑中标志位
    setEdit(val) {
      this.isEditing = val;
    },
    // 手动获取焦点
    getFocus() {
      const el = this.editDom.getElementsByClassName('json-content')[0],
        range = window.getSelection(),
        activeId = document.activeElement.id;
      // 如果已经存在焦点，不获取
      if (activeId === 'editor') return;
      // 将光标移动到文本末尾
      range.selectAllChildren(el);
      range.collapseToEnd();
    }
  },
};
</script>
