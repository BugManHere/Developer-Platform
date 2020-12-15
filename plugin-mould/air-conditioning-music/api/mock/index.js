/* eslint-disable */

!(function() {
  const MockSkillList = require('./skills.json');
  const MockVoiceMsgList = [
    {
      label: '妈妈',
      status: 1,
      createdAt: '2020-09-01 14:00:30',
      duration: 20 * 1000,
      guid: '1'
    },
    {
      label: '哥哥',
      status: 1,
      createdAt: '2020-09-02 10:30:05',
      duration: 51 * 1000,
      guid: '2'
    },
    {
      label: '奶奶',
      status: 2,
      createdAt: '2020-08-30 16:30:05',
      duration: 12 * 1000,
      guid: '3'
    }
  ];
  let gIsRecording = false;
  let gIsPlaying = false;
  let gTimer = null;

  function setMockApiCallbackResult(callback, success, fail) {
    setTimeout(() => {
      console.log('---------in');
      Math.random() >= 0.3 ? callback(success) : callback(fail);
    }, Math.random() * 1000);
  }

  navigator.PluginInterface = {
    ...navigator.PluginInterface,
    showToast(msg, type) {
      let toast = document.createElement('span');
      toast.innerText = msg;
      const toastStyle = {
        position: 'fixed',
        'background-color': 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        'font-size': '16px',
        'text-align': 'center',
        padding: '8px 16px',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        'border-radius': '5px',
        'z-index': 999
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
      const allSkillList = [];
      MockSkillList.forEach(x => {
        allSkillList.push(...x.data);
      });
      if (keyword) {
        const result = allSkillList.filter(x => x.name.indexOf(keyword) !== -1);
        setMockApiCallbackResult(callback, { data: result });
      } else {
        setMockApiCallbackResult(callback, { data: allSkillList });
      }
    },
    voiceACgetSkillSearchJudge(mac, callback) {
      setMockApiCallbackResult(
        callback,
        {
          hot: ['天气', '空调', '贝瓦儿歌', '诗词', '百科', '儿歌'],
          history: ['格力', '诗词', '天气', '贝瓦儿歌', '百科', '儿歌']
        },
        ''
      );
    },
    voiceACgetSkillSearchTruncate(mac, callback) {
      setMockApiCallbackResult(callback, { code: 200, msg: '删除成功' }, { code: 400, msg: '删除失败' });
    },
    voiceACgetSkillInfo(id, callback) {
      let skillInfo = '';
      const skill = MockSkillList.find(x => x.data.find(y => y.id === id));
      if (skill) {
        const result = skill.data.find(x => x.id === id);
        skillInfo = result.detail;
      }
      setMockApiCallbackResult(callback, skillInfo);
    },
    voiceSkillMsgAudioControl(mac, cmd, callback) {
      let result = { status: gIsRecording ? 'recording' : 'stop' };
      switch (cmd) {
        case 'start':
          {
            gIsRecording = true;
            result = { status: 'recording' };
          }
          break;
        case 'getStatus':
          {
            if (gIsRecording) {
              result = { status: 'recording', wave: Math.random() };
            } else if (gIsPlaying) {
              result = { status: 'playing' };
            }
          }
          break;
        case 'stop':
        case 'cancel':
          {
            gIsRecording = false;
            result = { status: 'stop' };
          }
          break;
        default:
          break;
      }
      callback(JSON.stringify(result));
    },
    voiceSkillMsgList(mac, callback) {
      setMockApiCallbackResult(callback, { data: MockVoiceMsgList });
    },
    voiceSkillMsgAdd(mac, data, callback) {
      if (!data) {
        callback({ code: 400 });
      } else {
        setTimeout(() => {
          const random = parseInt(Math.random() * 10, 10);
          if (random >= 5) {
            data = JSON.parse(data);
            data.guid = Date.now().toString();
            data.createdAt = '2020-09-03 17:30:00';
            data.status = 1;
            MockVoiceMsgList.unshift(data);
            callback({ code: 200 });
          } else {
            callback({ code: 400 });
          }
        }, Math.random() * 2000);
      }
    },
    voiceSkillMsgDel(data, callback) {
      if (!data) {
        callback({ code: 400 });
      } else {
        setTimeout(() => {
          const random = parseInt(Math.random() * 10, 10);
          if (random >= 5) {
            data = JSON.parse(data);
            const notDeleteMsgList = MockVoiceMsgList.filter(x => data.guidList.indexOf(x.guid) === -1);
            console.log(data.guidList, notDeleteMsgList);
            MockVoiceMsgList.splice(0, MockVoiceMsgList.length, ...notDeleteMsgList);
            callback({ code: 200 });
          } else {
            callback({ code: 400 });
          }
        }, Math.random() * 2000);
      }
    },
    voiceACgetSkillList(mac, data, callback) {
      const query = JSON.parse(data);
      const domainData = MockSkillList.find(x => x.domain === query.domain);
      const startIndex = (query.pageNum - 1) * query.pageSize;
      const result = domainData.data.slice(startIndex, startIndex + query.pageSize);
      setMockApiCallbackResult(callback, { data: result, total: domainData.total });
    },
    voiceSkillMsgPlay(data, callback) {
      gIsPlaying = true;
      if (gTimer) {
        clearTimeout(gTimer);
        gTimer = null;
      }
      setTimeout(() => {
        gIsPlaying = false;
        gTimer = null;
      }, Math.random() * 6000);
      callback(JSON.stringify({ code: 200, url: './mock_vioce_msg.mp3' }));
    }
  };
})();
