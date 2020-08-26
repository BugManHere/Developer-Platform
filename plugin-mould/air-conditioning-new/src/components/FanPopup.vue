<template>
  <div class="fan-picker">
    <!-- <gree-overlay :value="showPopup" z-index="5"/> -->
    <!-- <div class="popup-title" v-text="title"/> -->
    <gree-picker
      v-model="showPopup"
      :title="title"
      ref="fanPicker"
      :data="fanData"
      :cols="1"
      :line-height="45"
      :default-index="pickerDefalutData"
      :default-value="pickerDefalutData"
      :multi-line="false"
      ok-text=""
      cancel-text=""
      @change="setFan"
    ></gree-picker>
  </div>
</template>

<script>
import { Row, Col, Popup, Picker, Overlay } from 'gree-ui';
import { mapState, mapMutations } from 'vuex';
// import {
//   showLoading,
// } from '../../../../../PluginInterface';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Overlay.name]: Overlay
  },
  data() {
    return {
      showPopup: false,
      title: '风速',
      fanData: [
        [
          { text: '自动风', value: 0 },
          { text: '低风', value: 1 },
          { text: '中低风', value: 2 },
          { text: '中风', value: 3 },
          { text: '中高风', value: 4 },
          { text: '高风', value: 5 },
          { text: '强风', value: 6 },
          { text: '静音', value: 7 }
        ]
      ],
      pickerDefalutData: [0]
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fanData = [
          [
            { text: '自动风', value: 0 },
            { text: '低风', value: 1 },
            { text: '中低风', value: 2 },
            { text: '中风', value: 3 },
            { text: '中高风', value: 4 },
            { text: '高风', value: 5 },
            { text: '强风', value: 6 },
            { text: '静音', value: 7 }
          ]
        ];
        this.pickerDefalutData = [this.WdSpd];
        this.$refs.fanPicker.refresh();
      }, 10);
    });
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      WdSpd: state => state.dataObject.WdSpd
    })
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT'
    }),
    setFan() {
      const WdSpd = this.$refs.fanPicker.getColumnValues()[0].value;
      this.setDataObject({ WdSpd });
    }
  }
};
</script>
