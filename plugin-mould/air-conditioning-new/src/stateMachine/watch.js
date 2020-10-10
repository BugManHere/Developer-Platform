export const g_mid = {
  handler(newVal) {
    console.info(`Current Running mid: ${newVal}`);
  }
};

export const g_hideStateArr = {
  handler(newVal) {
    this.$nextTick(() => {
      this.g_hideState = JSON.stringify(newVal);
    });
  },
  deep: true
};

export const g_outputMap = {
  handler(newVal) {
    if (newVal) {
      this.setDataObject(newVal);
    }
  },
  deep: true,
  immediate: true
};

// 当前状态的信息
export const g_statusMap = {
  handler(newVal, oldVal) {
    this.$nextTick(() => {
      if (this.watchLock || !(oldVal && Object.keys(oldVal).length)) return;
      // 存储改变的状态
      const stateArr = [];
      for (const item in newVal) {
        if (item) {
          // push state
          newVal[item].status !== oldVal[item].status && stateArr.push(`${item}_${newVal[item].status}`);
        }
      }
      // 输入: state
      stateArr.forEach(item => {
        this.g_checkLogic(item);
      });
    });
  },
  deep: true
};

// 显示设备名
export const g_deviceName = {
  handler(newVal) {
    if (newVal && process.env.NODE_ENV === 'development') {
      const deviceInfo = JSON.parse(JSON.stringify(this.deviceInfo));
      deviceInfo.name = newVal;
      this.setDeviceInfo(deviceInfo);
    }
  }
};

export const g_identifierArr = {
  handler(newVal) {
    this.setState({
      devOptions: {
        ...this.devOptions,
        identifierArr: newVal
      }
    });
  }
};
