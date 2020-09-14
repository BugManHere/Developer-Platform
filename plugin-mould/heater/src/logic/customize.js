const Customize = {
  computed: {
    customize() {
      return {
        TimerBtn: () => {
          this.$router.push({
            name: 'Timer'
          }).catch(err => {
            console.log(err);
          });
        }
      };
    }
  },
  methods: {
    changeData(map) {
      this.setState(['watchLock', false]);
      this.setState(['ableSend', true]);
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    /**
     * @description 执行自定义函数
     */
    customizeFunc(key, status) {
      try {
        this.customize[key](status);
      } catch (e) {
        console.log(`%c 找不到${key}的自定义函数`, 'color: blue');
      }
    }
  }
};
export default Customize;
