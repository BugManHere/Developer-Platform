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
          url: require('../../assets/img/functionBtn/blank.png'),
          name: '智慧成长',
          key: 'music'
        },
        {
          url: require('../../assets/img/functionBtn/blank.png'),
          name: '空调控制',
          key: 'control'
        },
        {
          url: require('../../assets/img/functionBtn/blank.png'),
          name: '健康睡眠',
          key: 'sleep'
        }
      ];
      return result;
    }
  },
};

export default homeConfig;
