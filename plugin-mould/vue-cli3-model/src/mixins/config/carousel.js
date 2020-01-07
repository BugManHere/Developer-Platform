/**
 * @description 滑轮配置列表
 */
import { mapState } from 'vuex';

const CarouselConfig = {
  data() {
    return {
      modeNameList: [
        this.$language('mode.mode_auto'),
        this.$language('mode.mode_cool'),
        this.$language('mode.mode_dry'),
        this.$language('mode.mode_fan'),
        this.$language('mode.mode_heat')
      ],
      modImgList: [
        require('@/assets/img/mode/index_mode_auto.png'), // 自动
        require('@/assets/img/mode/index_mode_cool.png'), // 制冷
        require('@/assets/img/mode/index_mode_dry.png'), // 除湿
        require('@/assets/img/mode/index_mode_fan.png'), // 送风
        require('@/assets/img/mode/index_mode_heat.png'), // 制热
      ],
      modOptions: {
        isShow: true, // 是否显示
        controlAble: true, // 滑轮能不能滑动
        showNumOrImg: false, // 显示数字还是图片
        horizontal: true, // 水平显示or竖直显示
        controlMode: 1,
        threeOrAll: true, // 显示3个or全部显示
        width: '60%', // 组件宽度
        spaceBetween: '3rem', // 间距
        marginLeft: '0', // 组件左边距
        height: '.967rem', // 图片大小
        fontSize: '32px',
        radiusMutiply: 1, // 半径系数
      },
      fanNameList: [
        this.$language('fan.fan_auto'),
        this.$language('fan.fan_low'),
        this.$language('fan.fan_medium_low'),
        this.$language('fan.fan_medium'),
        this.$language('fan.fan_medium_high'),
        this.$language('fan.fan_high'),
        this.$language('fan.fan_turbo'),
        this.$language('fan.fan_quiet'),
      ],
      fanImgList: [
        require('@/assets/img/fan/n_auto.png'), // 自动风
        require('@/assets/img/fan/n_low.png'), // 低风档
        require('@/assets/img/fan/n_medium_low.png'), // 中低风档
        require('@/assets/img/fan/n_medium.png'), // 中风档
        require('@/assets/img/fan/n_medium_high.png'), // 中高风档
        require('@/assets/img/fan/n_high.png'), // 高风档
        require('@/assets/img/fan/n_turbo.png'), // 强劲档
        require('@/assets/img/fan/n_quiet.png'), // 静音档
      ],
      fanData: {
        0: [['WdSpd', 'Tur', 'Quiet'], [0, 0, 0]],
        1: [['WdSpd', 'Tur', 'Quiet'], [1, 0, 0]],
        2: [['WdSpd', 'Tur', 'Quiet'], [2, 0, 0]],
        3: [['WdSpd', 'Tur', 'Quiet'], [3, 0, 0]],
        4: [['WdSpd', 'Tur', 'Quiet'], [4, 0, 0]],
        5: [['WdSpd', 'Tur', 'Quiet'], [5, 0, 0]],
        6: [['WdSpd', 'Tur', 'Quiet'], [6, 1, 0]],
        7: [['WdSpd', 'Tur', 'Quiet'], [7, 0, 2]],
      },
      fanOptions: {
        isShow: true, // 是否显示
        controlAble: true, // 滑轮能不能滑动
        showNumOrImg: false, // 显示数字还是图片
        horizontal: true, // 水平显示or竖直显示
        controlMode: 1,
        threeOrAll: false, // 显示3个or全部显示
        width: '100%', // 组件宽度
        spaceBetween: '1rem', // 间距
        marginLeft: '0rem', // 组件左边距
        height: '1rem', // 图片大小
        fontSize: '2.9rem',
        radiusMutiply: 1.5, // 半径系数
      },
    };
  },
  computed: {
    ...mapState({
      has05: state => state.has05,
      has01: state => state.has01,
      Add05: state => state.dataObject['Add0.5'],
      Add01: state => state.dataObject['Add0.1'],
      StHt: state => state.dataObject.StHt,
    }),
    temData() {
      if (this.StHt) {
        return Array(50).fill(8);
      } 
      const startNum = 16;
      const endNum = 30;
      const arr = [];
      for (let i = startNum; i <= endNum; i += 1) {
        // if (this.has01 && i !== endNum) {
        //   for (let o = 0; o < 9; o += 1) {
        //     arr.push(i);
        //   }
        // } else if (this.has05 && i !== endNum) {
        //   arr.push(i);
        // }
        arr.push(i);
      }
      return arr;
    },
    temOptions() {
      const pos = (this.Add05 || this.Add01) ? '-1.4rem' : '-.9rem';
      let Left;
      if (this.StHt) {
        Left = '-.5rem';
      } else {
        Left = (this.has05 || this.has01) ? pos : '-1rem';
      }
      return {
        isShow: true, // 是否显示
        controlAble: !this.StHt, // 滑轮能不能滑动
        showNumOrImg: true, // 显示数字还是图片
        horizontal: true, // 水平显示or竖直显示
        controlMode: 1,
        threeOrAll: false, // 显示3个or全部显示
        width: '100%', // 组件宽度
        spaceBetween: '6.8rem', // 间距
        marginLeft: Left, // 组件左边距
        height: '3.9rem', // 图片大小
        fontSize: '3.6rem',
        radiusMutiply: 1.5, // 半径系数
        has05: this.has05
      };
    },
  }
};

export default CarouselConfig;
