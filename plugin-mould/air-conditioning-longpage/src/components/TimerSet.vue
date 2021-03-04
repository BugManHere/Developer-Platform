<template>
  <div class="timer-set">
    <!-- 定时管理 -->
    <card-group>
      <template v-slot:content>
        <div class="timer-manage">
          <!-- 定时列表 -->
          <div v-if="timerTasks.length" class="timer-manage-list">
            <!-- 标题 -->
            <div class="timer-manage-list-header">
              <gree-check v-if="delType" v-model="timerSelectAllFlag" label="全选" />
              <span v-else v-text="'管理'" @click="delType = true" />
            </div>
            <!-- 列表内容 -->
            <div class="timer-manage-list-content" v-for="(timerTask, timerTaskIndex) in timerTasks" :key="timerTaskIndex" @click="selectOne(timerTaskIndex)">
              <!-- 左边内容 -->
              <div class="timer-manage-list-content-left">
                <p>
                  <!-- 时间 -->
                  <span v-text="parseTime(timerTask.timer.Etime, timerTask.timer.timeZone)" />
                  <!-- 动作 -->
                  <span v-html="`&nbsp; ${getPowType(timerTask.task.cmd) ? '关机' : '开机'}`" />
                </p>
                <p class="timer-manage-list-content-left-footer" v-text="parseDate(timerTask.timer.weeks) || ''" />
              </div>
              <!-- 右边内容 -->
              <div class="timer-manage-list-content-right" @click.stop="">
                <gree-check v-if="delType" v-model="timerSelcetList[timerTaskIndex]" />
                <gree-switch v-else class="card-item-right-switch" size="26px" v-model="listSwitchType[timerTaskIndex]" @change="changeTask(timerTaskIndex)" />
              </div>
            </div>
            <!-- 删除按钮 -->
            <div v-if="delType" class="timer-manage-list-del">
              <!-- 取消 -->
              <div
                class="timer-manage-list-del-cancel"
                v-text="'取消'"
                @click="
                  delType = false;
                  timerSelectAllFlag = false;
                "
              />
              <!-- 确定 -->
              <div v-text="'删除'" @click="delTimers" />
            </div>
            <!-- 添加按钮 -->
            <div v-else class="timer-manage-list-add">
              <!-- 点击热区 -->
              <div
                class="timer-manage-list-add-box"
                @click="
                  setPickerPropData();
                  showTimerSetPopup();
                "
              >
                <!-- icon -->
                <span class="timer-manage-list-add-box-icon" />
                <!-- 文本 -->
                <span class="timer-manage-list-add-box-text" v-text="'添加'" />
              </div>
            </div>
          </div>
          <!-- 大大的添加按钮 -->
          <div v-else class="timer-manage-blank">
            <div
              class="timer-manage-blank-add"
              @click="
                setPickerPropData();
                showTimerSetPopup();
              "
            >
              <div class="timer-manage-blank-add-icon" />
              <span class="timer-manage-blank-add-text" v-text="'添加'" />
            </div>
          </div>
        </div>
      </template>
    </card-group>
    <!-- 弹框设置 -->
    <timer-picker-popup @timer-picker-data="getPickerData" :timer-task-time="timerTaskTime" :timer-task-weeks="timerTaskWeeks" :timer-i-d="timerID" />
  </div>
</template>

<script>
import { Switch, Check } from 'gree-ui';
import { setCloudTimer, modifyCloudTimer, deleteCloudTimer, showToast, getCloudTimerByMac } from '@PluginInterface';
import { mapState } from 'vuex';
import { analysisTimer } from '@/utils/encryptionFun';
import CardGroup from '@/components/CardGroup/index';
import TimerPicker from '@/components/Popup/TimerPicker';
import { mapMutations } from 'vuex';

export default {
  name: 'timer-set-group',
  components: {
    [CardGroup.name]: CardGroup,
    [TimerPicker.name]: TimerPicker,
    [Switch.name]: Switch,
    [Check.name]: Check
  },
  data() {
    return {
      timerSelcetList: [],
      timerSelectAllFlag: false,
      getTimerInterval: null,
      timerTasks: [],
      listSwitchType: [],
      delType: false, // 删除状态
      timerTaskTime: {},
      timerTaskWeeks: [],
      timerID: 0
    };
  },
  activated() {
    // 先查一包
    this.localGetCloudTimer();
    // 再开轮询
    this.createInterval();
  },
  deactivated() {
    clearInterval(this.getTimerInterval);
  },
  computed: {
    ...mapState('control', {
      mac: state => state.mac
    }),
    isAllSelect() {
      return this.timerTasks.every((v, i) => {
        return this.timerSelcetList[i];
      });
    },
    isAllBlur() {
      return !this.timerTasks.some((v, i) => {
        return this.timerSelcetList[i];
      });
    }
  },
  watch: {
    'timerTasks.length': {
      handler() {
        // 更新高度
        this.updateBoxHeight();
        this.selectAll();
      },
      immediate: true
    },
    timerSelectAllFlag(newVal) {
      newVal !== 0 && this.selectAll(newVal);
    },
    isAllSelect(newVal) {
      if (newVal) {
        this.timerSelectAllFlag = true;
      } else {
        this.timerSelectAllFlag = 0;
      }
    },
    isAllBlur(newVal) {
      newVal && (this.timerSelectAllFlag = false);
    }
  },
  methods: {
    ...mapMutations('control', {
      SetPopup: 'SET_POPUP'
    }),
    // 新增查询定时
    createInterval() {
      this.getTimerInterval = setInterval(() => {
        this.localGetCloudTimer();
      }, 5000);
    },
    localGetCloudTimer() {
      return getCloudTimerByMac(this.mac).then(res => {
        const result = JSON.parse(res);
        if (result.r === 200) {
          this.timerTasks = analysisTimer(result.timerTasks);
          // 更新开关状态
          this.updateSwitchType();
        }
      });
    },
    // 更新开关状态
    updateSwitchType() {
      this.listSwitchType = this.timerTasks
        ? this.timerTasks.map(timerTask => {
            return Boolean(timerTask.timer.status);
          })
        : [];
    },
    // 更新高度
    updateBoxHeight() {
      this.$emit('updateHeight');
    },
    // 获取开关状态 1关 0开
    getPowType(cmd) {
      const { opt, p } = cmd;
      const powIndex = opt.findIndex(v => v === 'Pow');
      const powType = powIndex === -1 ? 1 : Number(!p[powIndex]);
      return powType;
    },
    // 时间解析
    parseTime(stringTime, timeZone) {
      if (!stringTime) return;
      const timeList = stringTime.split(':');
      let hour = Number(timeList[0]) + timeZone;
      if (hour >= 24) hour -= 24;
      if (hour < 10) hour = `0${hour}`;
      return `${hour}:${timeList[1]}  `;
    },
    // 解析日期
    parseDate(list) {
      if (!list) return;
      if (list.length === 7) return '每天';
      const valueObj = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      let returnValue = '';
      list.forEach(element => {
        if (element === '') return;
        returnValue += `${valueObj[Number(element) - 1]} `;
      });
      return returnValue.substring(0, returnValue.length - 1);
    },
    async showTimerSetPopup() {
      await this.localGetCloudTimer();
      if (this.timerTasks.length >= 3) {
        showToast('定时已满，请先删除其他定时', 0);
      } else {
        this.SetPopup({ timerPicker: true });
      }
    },
    changeTask(index) {
      const { task, timer } = this.timerTasks[index];
      const timerDic = {
        timeType: timer.timeType,
        weeks: timer.weeks,
        Etime: timer.Etime,
        timeZone: timer.timeZone,
        status: Number(!timer.status)
      };
      const taskDic = {
        mac: this.mac,
        cmd: JSON.stringify(task.cmd),
        remark: task.remark,
        dat: task.dat
      };
      modifyCloudTimer(timerDic, taskDic, timer.timerID).then(() => {
        // 保存成功主动查一次
        this.localGetCloudTimer();
      });
    },
    delTimers() {
      this.delType = false;
      this.timerSelectAllFlag = false;
      const timerIDs = [];
      this.timerSelcetList.forEach((value, index) => {
        try {
          value && timerIDs.push(this.timerTasks[index].timer.timerID);
        } catch (e) {
          e;
        }
      });
      deleteCloudTimer(timerIDs).then(() => {
        // 删除成功主动查一次
        this.localGetCloudTimer();
      });
    },
    setPickerPropData(index = -1) {
      if (index === -1) {
        this.timerTaskTime = {};
        this.timerTaskWeeks = [];
        this.timerID = 0;
      } else {
        const { timer, task } = this.timerTasks[index];
        const { Etime, weeks, timeZone, timerID } = timer;
        const targetTime = this.parseTime(Etime, timeZone);

        const powType = this.getPowType(task.cmd);

        const [hour, minus] = targetTime.split(':').map(Number);
        this.timerTaskTime = {
          hour,
          minus,
          type: powType
        };
        this.timerTaskWeeks = weeks;
        this.timerID = timerID;
      }
    },
    selectOne(index) {
      if (this.delType) {
        this.$set(this.timerSelcetList, index, !this.timerSelcetList[index]);
      } else {
        // 设置picker数据
        this.setPickerPropData(index);
        // 显示picker弹窗
        this.showTimerSetPopup();
      }
    },
    selectAll(type) {
      const setTimerAll = type => {
        this.timerSelcetList = this.timerTasks.map(() => type);
      };
      if (type === undefined) {
        this.isAllSelect && setTimerAll(true);
        this.isAllBlur && setTimerAll(false);
      } else {
        setTimerAll(type);
      }
    },
    async getPickerData(val) {
      await this.localGetCloudTimer();
      const [pickerData, weekList, timerID] = val;

      const hour = (((pickerData[0].value + (24 - 8)) % 24) + '').padStart(2, '0');
      const minus = (pickerData[1].value + '').padStart(2, '0');
      const Etime = `${hour}:${minus}:00`;
      const Pow = Number(!pickerData[2].value);
      const p = [Pow, 0, 0, 0, 0];
      const opt = ['Pow', 'Health', 'SlpMod', 'SwhSlp', 'StHt'];

      const weeks = [];
      weekList.forEach(week => {
        week.select && weeks.push(week.index);
      });
      const timerDic = {
        timeType: weeks.length ? 2 : 1,
        weeks,
        Etime,
        timeZone: 8,
        status: 1
      };
      const taskDic = {
        mac: this.mac,
        cmd: JSON.stringify({ t: 'cmd', opt, p }),
        remark: 'i am lazy, no remark',
        dat: p.map(String)
      };

      if (timerID && this.timerTasks.find(timerTask => timerTask.timer.timerID === timerID)) {
        modifyCloudTimer(timerDic, taskDic, timerID).then(() => {
          showToast('保存成功');
          // 保存成功主动查一次
          this.localGetCloudTimer();
        });
      } else {
        if (this.timerTasks.length >= 3) {
          showToast('定时已满，请先删除其他定时', 0);
        } else {
          setCloudTimer(timerDic, taskDic).then(() => {
            showToast('保存成功');
            // 保存成功主动查一次
            this.localGetCloudTimer();
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.timer-manage {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  &-list {
    height: 100%;
    width: 100%;
    &-header {
      $headerHeight: 116px;
      height: $headerHeight;
      width: 100%;
      font-size: 44px;
      line-height: $headerHeight;
      display: flex;
      justify-content: flex-end;
      > label {
        width: auto;
        margin-right: 60px;
      }
      > span {
        margin-right: 60px;
        color: #404657;
      }
    }
    &-content {
      height: 260px;
      background-image: linear-gradient(0deg, rgba(152, 152, 152, 0.2), rgba(152, 152, 152, 0.15), transparent);
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: top;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 44px;
      &-left {
        padding-left: 52px;
        color: #404657;
        &-footer {
          padding-top: 8px;
          font-size: 36px;
          color: #989898;
        }
      }
      &-right {
        padding-right: 60px;
      }
    }
    &-del {
      $delHeight: 168px;
      width: 100%;
      height: $delHeight;
      background-image: linear-gradient(0deg, rgba(152, 152, 152, 0.2), rgba(152, 152, 152, 0.15), transparent);
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: top;
      font-size: 44px;
      color: #ff0202;
      display: flex;
      justify-content: space-between;
      &-cancel {
        color: #404657;
        // border-right: 1px solid #f0f0f0;
        background-image: linear-gradient(0deg, rgba(152, 152, 152, 0.2), rgba(152, 152, 152, 0.15), transparent);
        background-size: 1px 100%;
        background-repeat: no-repeat;
        background-position: right;
      }
      div {
        width: 50%;
        height: 100%;
        text-align: center;
        line-height: $delHeight;
      }
    }
    &-add {
      width: 100%;
      height: 168px;
      background-image: linear-gradient(0deg, rgba(152, 152, 152, 0.2), rgba(152, 152, 152, 0.15), transparent);
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: top;
      display: flex;
      align-items: center;
      justify-content: center;
      &-box {
        width: auto;
        height: 80%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        &-icon {
          $iconHeight: 56px;
          height: $iconHeight;
          width: $iconHeight;
          line-height: $iconHeight;
          border-radius: 50%;
          border: 1px solid rgba(152, 152, 152, 0.15);
          font-family: 'Roboto-Light';
          text-align: center;
          margin-right: 24px;
          &::after {
            color: rgba(132, 138, 148, 1);
            font-size: $iconHeight;
            content: '+';
          }
        }
        &-text {
          font-size: 44px;
          color: #989898;
        }
      }
    }
  }
  &-blank {
    height: 440px;
    display: flex;
    justify-content: center;
    align-items: center;
    &-add {
      text-align: center;
      &-icon {
        $iconHeight: 136px;
        height: $iconHeight;
        width: $iconHeight;
        line-height: $iconHeight;
        border-radius: 50%;
        border: 1px solid rgba(152, 152, 152, 0.15);
        font-family: 'Roboto-Light';
        text-align: center;
        margin-bottom: 32px;
        &::after {
          color: rgba(132, 138, 148, 1);
          font-size: 120px;
          content: '+';
        }
      }
      &-text {
        font-size: 40px;
        color: #404657;
      }
    }
  }
}
</style>
