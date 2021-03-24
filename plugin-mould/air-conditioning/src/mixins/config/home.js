import LogicDefine from '@/logic/define';

const homeConfig = {
  mixins: [LogicDefine],
  data() {
    return {
      // functionList: [
      //   {
      //     url: require('../../assets/img/pow.png'),
      //     name: '开关'
      //   },
      //   {
      //     url: require('../../assets/img/function.png'),
      //     name: '功能'
      //   },
      //   // {
      //   //   url: require('../../assets/img/voiceSkill.png'),
      //   //   name: '语音技能'
      //   // },
      // ]
    };
  },
  computed: {
    functionList() {
      const result = [
        {
          url: require('../../assets/img/pow.png'),
          name: this.$language('home.power'),
          key: 'Pow'
        }
      ];
      // 如果有高级功能，显示出来
      this.g_funcDefine_btn.length &&
        result.push({
          url: require('../../assets/img/function.png'),
          name: this.$language('home.function'),
          key: 'Func'
        });
      // 如果1.不在场景模式 2.勾选了语音技能 就增加语音技能按钮
      !this.$store.state.dataObject.functype &&
        this.g_moreOption &&
        this.g_moreOption.voiceSkill &&
        result.push({
          url: require('../../assets/img/voiceSkill.png'),
          name: this.$language('home.voice'),
          key: 'Voice'
        });
      // 如果1.
      !this.$store.state.dataObject.functype &&
        this.$store.state.devOptions.identifierArr.includes('ElcEn') &&
        this.$store.state.dataObject.ElcEn &&
        result.push({
          url: require('../../assets/img/Electric.png'),
          name: this.$language('home.Electric'),
          key: 'ElcEn'
        });
      return result;
    }
  }
};

export default homeConfig;
