import LogicDefine from '@logic/define';

const LogicPort = {
  mixins: [LogicDefine],
  data() {
    return {
      work_fanKey: 'fan',
      work_modKey: 'mod',
      work_popupsKey: 'homeButton', // 主页按钮type
      work_temKey: 'tem', // 温度type
      work_temMinKey: 'temMin', // 查找温度下限用
      work_temMaxKey: 'temMax' // 查找温度上限用
    };
  },
  computed: {
    // 模式的定义
    work_modDefine() {
      return this.g_funcDefine_inertia.find(module => module.type === `inertia-${this.work_modKey}`);
    },
    // 模式的id
    work_modIdentifier() {
      return this.work_modDefine && this.work_modDefine.identifier;
    },
    // 风速的定义
    work_fanDefine() {
      return this.g_funcDefine_inertia.find(module => module.type === `inertia-${this.work_fanKey}`);
    },
    // 风速的id
    work_fanIdentifier() {
      return this.work_fanDefine && this.work_fanDefine.identifier;
    },
    // 高级功能按钮的定义
    work_buttonDefine() {
      return this.g_funcDefine_active.filter(module => module.type === 'active-button');
    },
    // 主页按钮的定义
    work_popupDefine() {
      return this.g_funcDefine_active.filter(module => module.type === `active-${this.work_popupsKey}`);
    },
    // 显示插槽1, 存在被隐藏的状态就不显示
    work_imshowSlot1() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === 'inertia-imshowSlot1')
        .filter(module => !this.g_hideStateArr.some(state => state.includes(`${module.identifier}_`)));
      // 存在多个的情况时，只取第一个，其他不处理
      if (modules.length) {
        const json = modules[0].json;
        const value = this.g_inputMap[json];
        const id = modules[0].identifier;
        const text = this.$language(`slot1.${id}`).replace('%s', value);
        return text;
      }
      return undefined;
    },
    // 显示插槽2, 隐藏的状态被禁用就显示
    work_imshowSlot2() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === 'inertia-imshowSlot2')
        .filter(module => this.g_hideStateArr.some(state => state.includes(`${module.identifier}_`)));
      // 存在多个的情况时，只取第一个，其他不处理
      if (modules.length) {
        const json = modules[0].json;
        const value = this.g_inputMap[json];
        const id = modules[0].identifier;
        const text = this.$language(`slot2.${id}`).replace('%s', value);
        return text;
      }
      return undefined;
    },
    // 温度设定
    work_temSetJson() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.work_temKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(`${module.identifier}_`)));
      // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
      console.log(this.g_funcDefine_inertia.filter(module => module.type === `inertia-${this.work_temKey}`));
      console.log(this.g_hideStateArr);
      if (modules.length) return modules[0].json;
      return undefined; // 默认字段
    },
    // 温度显示值
    work_temSetVal() {
      if (this.work_temSetJson) return this.g_inputMap[this.work_temSetJson];
      return '';
    },
    // 温度最小值设定
    work_temMinVal() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.work_temMinKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(`${module.identifier}_`)));
      // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
      if (modules.length) return this.g_inputMap[modules[0].json];
      return 16; // 默认温度最小值
    },
    // 温度最大值设定
    work_temMaxVal() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.work_temMaxKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(`${module.identifier}_`)));
      if (modules.length) return this.g_inputMap[modules[0].json];
      return 30; // 默认温度最大值
    },
    // 温度间隔
    work_temStep() {
      return this.g_moreOption.temStep;
    }
  }
};

export default LogicPort;
