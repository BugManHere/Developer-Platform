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
          name: '开关'
        },
        {
          url: require('../../assets/img/function.png'),
          name: '功能'
        },
      ];
      this.g_moreOption && this.g_moreOption.voiceSkill && result.push({
        url: require('../../assets/img/voiceSkill.png'),
        name: '语音技能'
      });
      return result;
    }
  },
};

export default homeConfig;
