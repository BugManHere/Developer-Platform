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
          name: '开关',
          key: 'Pow'
        }
      ];
      // 如果有高级功能，显示出来
      this.g_funcDefine_btn.length && result.push({
        url: require('../../assets/img/function.png'),
        name: '功能',
        key: 'Func'
      });
      // 如果有定时，显示出来
      !this.g_hideFuncArr.includes('Timer') && this.g_identifierArr.includes('Timer') && result.push({
        url: this.$store.state.dataObject.Tmron ? require('../../assets/img/time_on.png') : require('../../assets/img/time_off.png'),
        name: '定时',
        key: 'Timer'
      });
      return result;
    }
  },
};

export default homeConfig;
