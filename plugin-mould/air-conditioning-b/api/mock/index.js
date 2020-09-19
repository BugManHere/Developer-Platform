/* eslint-disable */ 
!(function(){
  const MockSkillData = [
    {
      id: 1,
      name: '天气',
      illustrate: '今天天气怎么样',
      illustrates: [
        '今天天气怎么样',
        '今天适合穿什么衣服'
      ],
      icon: require('../../src/assets/img/skill/icon_weather.png'),
      iosIcon: require('../../src/assets/img/skill/icon_weather.png'),
      introduce: '可以查询当天和未来七天内的天气预报',
      direction_use: '可以查询天气、冷热、气象、湿度、空气质量、紫外线等\r\n可以查询活动、查询服装等'
    },
    {
      id: 2,
      name: '语音留言',
      illustrate: '收听留言',
      illustrates: [
        '收听留言',
        '我要听妈妈的留言'
      ],
      icon: require('../../src/assets/img/skill/icon_voicemsg.png'),
      iosIcon: require('../../src/assets/img/skill/icon_voicemsg.png'),
      introduce: '通过APP发送留言，空调随时收听，快和家人一起体验吧！',
      direction_use: '通过格力+APP给家里的空调留言，空调可随时获取并播报留言'
    }
  ];

  const MockSkillInfos = JSON.parse(JSON.stringify(MockSkillData)).map(x => {
    x.illustrate = x.illustrates;
    return x;
  });

  const MockVoiceMsgList = [
    {
      label: '妈妈',
      status: 1,
      createdAt: '2020-09-01 14:00:30',
      duration: 20*1000,
      guid: '1',
    },
    {
      label: '哥哥',
      status: 1,
      createdAt: '2020-09-02 10:30:05',
      duration: 51*1000,
      guid: '2',
    },
    {
      label: '奶奶',
      status: 2,
      createdAt: '2020-08-30 16:30:05',
      duration: 12*1000,
      guid: '3',
    }
  ];
  let gIsRecording = false;

  function setMockApiCallbackResult(callback, success, fail) {
    setTimeout(() => {
      const random = parseInt(Math.random()*10, 10);
      random >= 3 ? callback(success) : callback(fail);
    }, Math.random() * 1000);
  }

  navigator.PluginInterface = {
    showToast(msg, type) {
      let toast = document.createElement('span');
      toast.innerText = msg;
      const toastStyle = {
        'position': 'fixed',
        'background-color': 'rgba(0, 0, 0, 0.6)',
        'color': '#fff',
        'font-size': '16px',
        'text-align': 'center',
        'padding': '8px 16px',
        'bottom': '120px',
        'left': '50%',
        'transform': 'translateX(-50%)',
        'border-radius': '5px',
        'z-index': 999,
      };
      toast.style.cssText = Object.keys(toastStyle).reduce((acc, cur) => {
        acc = acc + `${cur}: ${toastStyle[cur]};`;
        return acc;
      }, '');
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 1000);
    },
    showLoading() {
      console.log('showLoading......');
    },
    hideLoading() {
      console.log('hideLoading......');
    },
    voiceACgetSkillSearch(mac, keyword, callback) {
      if (keyword) {
        const result = MockSkillData.filter(x => x.name.indexOf(keyword) !== -1);
        setMockApiCallbackResult(callback, {data: result}, '');
      } else {
        setMockApiCallbackResult(callback, {data: MockSkillData}, '');
      }
    },
    voiceACgetSkillSearchJudge(mac, callback) {
      setMockApiCallbackResult(callback, {
        hot: ['天气', '空调', '贝瓦儿歌', '诗词', '百科', '儿歌'],
        history: ['格力', '诗词', '天气', '贝瓦儿歌', '百科', '儿歌']
      }, '');
    },
    voiceACgetSkillSearchTruncate(mac, callback) {
      setMockApiCallbackResult(callback, {code: 200, msg: '删除成功'}, {code: 400, msg: '删除失败'});
    },
    voiceACgetSkillInfo(id, callback) {
      const skillInfo = MockSkillInfos.find(x => x.id === id);
      setMockApiCallbackResult(callback, skillInfo, '');
    },
    voiceSkillMsgAudioControl(mac, cmd, callback) {
      let result = {status: gIsRecording ? 'recording' : 'stop'};
      switch (cmd) {
        case 'start':
          {
            gIsRecording = true;
            result = {status: 'recording'};
          }
          break;
        case 'getStatus':
          {
            if (gIsRecording) {
              result = {status: 'recording', wave: Math.random()};
            }
          }
          break;
        case 'stop':
        case 'cancel':
          {
            gIsRecording = false;
            result = {status: 'stop'};
          }
          break;
        default:
          break;
      }
      callback(JSON.stringify(result));
    },
    voiceSkillMsgList(mac, callback) {
      setMockApiCallbackResult(callback, {data: MockVoiceMsgList});
    },
    voiceSkillMsgAdd(mac, data, callback) {
      if (!data) {
        callback({code: 400});
      } else {
        setTimeout(() => {
          const random = parseInt(Math.random()*10, 10);
          if (random >= 5) {
            data = JSON.parse(data);
            data.guid = Date.now().toString();
            data.createdAt = '2020-09-03 17:30:00';
            data.status = 1;
            MockVoiceMsgList.unshift(data);
            callback({code: 200});
          } else {
            callback({code: 400});
          }
        }, Math.random() * 2000);
      }
    },
    voiceSkillMsgDel(data, callback) {
      if (!data) {
        callback({code: 400});
      } else {
        setTimeout(() => {
          const random = parseInt(Math.random()*10, 10);
          if (random >= 5) {
            data = JSON.parse(data);
            const notDeleteMsgList = MockVoiceMsgList.filter(x => data.guidList.indexOf(x.guid) === -1);
            console.log(data.guidList, notDeleteMsgList);
            MockVoiceMsgList.splice(0, MockVoiceMsgList.length, ...notDeleteMsgList);
            callback({code: 200});
          } else {
            callback({code: 400});
          }
        }, Math.random() * 2000);
      }
    },
    voiceACgetSkillList(mac, data, callback) {
      // 由于测试数据不足，这里仅简单的返回技能列表
      let result = MockSkillData.slice(0);
      setMockApiCallbackResult(callback, {data:  result, total: result.length});
    }
  };
})();

