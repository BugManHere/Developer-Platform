import LogicDefine from '@/logic/define';

const homeConfig = {
  mixins: [LogicDefine],
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
  }
};

export default homeConfig;
