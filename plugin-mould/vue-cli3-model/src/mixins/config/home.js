/*
 * @Author: Jerry-Rain
 * @Date: 2019-09-11 16:43:42
 * @LastEditors: Jerry-Rain
 * @LastEditTime: 2019-09-30 15:36:30
 * @Description: 首页底部功能的配置表
 */
/**
 * @description Home配置列表
 */

const homeConfig = {
  data() {
    return {
      functionList: [
        {
          url: require('../../assets/img/pow.png'),
          name: '开关'
        },
        {
          url: require('../../assets/img/function.png'),
          name: '功能'
        },
        {
          url: require('../../assets/img/voiceSkill.png'),
          name: '语音技能'
        },
      ]
    };
  },
};

export default homeConfig;
