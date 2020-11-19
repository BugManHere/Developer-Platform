/**
 * @description 故障配置
 */
import { mapState, mapMutations } from 'vuex';
import errorList from '@/utils/error';

const errorConfig = {
  data() {
    return {
      errorList,
      errMsg: '', // 故障文字
      warnMsg: '' // 提醒文字
    };
  },

  computed: {
    ...mapState({
      ErrCode1: state => state.dataObject.ErrCode1,
      ErrCode2: state => state.dataObject.ErrCode2,
      JFerr: state => state.dataObject.JFerr,
      ErrCodeType: state => state.dataObject.ErrCodeType
    }),

    /**
     * @description 检测是否有故障
     */
    errStatus() {
      const isError = this.ErrCode1 || this.ErrCode2 || this.JFerr;
      return isError;
    }
  },
  watch: {
    errStatus: {
      immediate: true,
      handler(newV) {
        let errState;
        if (newV) {
          errState = true;
          if (this.$route.name === 'Error') {
            this.updateError(); // 如果当前页是故障页，则显示长List 该函数在error 页
          } else {
            this.updataErrMsg();
          }
        } else {
          errState = false;
        }
        this.changeRoute(errState);
      }
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT'
    }),

    changeRoute(value) {
      // 有故障 非故障页 需要跳故障页
      const err2ToErr = this.getErr2toErrorStatus();
      const toErrorPage = (this.ErrCode1 || this.JFerr || err2ToErr) && this.$route.name !== 'Error';

      // 无故障 且在 故障页。 跳回首页
      if (!value && this.$route.name === 'Error') {
        this.$router.push({
          name: 'Home'
        });
        return;
      }

      if (toErrorPage) {
        this.$router.push({
          name: 'Error'
        });
      }
    },

    /**
     * @description 判断err2 是否需要跳故障页
     */
    getErr2toErrorStatus() {
      let toError = false;
      if (this.ErrCode2) {
        const err2IndexList = this.HandleErrorCode(this.ErrCode2);
        console.log('err2IndexList', err2IndexList);

        // 如果是第0位或第四位需要跳故障页
        toError = Boolean(err2IndexList.includes(0) || err2IndexList.includes(4));
        this.setDataObject({
          ErrCodeType: !toError >> 0
        });
        return toError;
      }
      this.setDataObject({
        ErrCodeType: 0
      });
      return false;
    },

    /**
     * @description 获取需要显示的errMsg
     */
    updataErrMsg() {
      if (this.ErrCode1 || this.JFerr) return;
      let msg = [];
      msg = this.HandleErrorCode(this.ErrCode2);
      if (msg.length > 0) {
        this.errMsg = `故障:  ${this.errorList.ErrCode2[msg[0]].code}, ${this.$language(`error.${this.errorList.ErrCode2[msg[0]].title}`)}。 `;
      }
    },

    /**
     * @description 十进制转2进制下标
     * @function HandleErrorCode
     * @param { number} value 传入的十进制数
     * @return eg 13 => [0, 1, 3]
     */
    HandleErrorCode(value) {
      let errorCode = value;
      errorCode = String(errorCode.toString(2));
      const errorCodeList = errorCode.split('').reverse();
      const indexList = [];
      for (let index = 0; index < errorCodeList.length; index++) {
        if (errorCodeList[index] === '1') {
          indexList.push(index);
        }
      }
      return indexList;
    }
  }
};

export default errorConfig;
