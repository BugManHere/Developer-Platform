const popupConfig = {
  data() {
    return {
      optionsPopupBottom: [
        {
          icon: 'home',
          size: 'xl',
          class: '',
          text: '精煮饭',
          width: 25
        },
        {
          icon: 'warning',
          size: 'xl',
          class: '',
          text: '快煮饭',
          width: 25
        },
        {
          icon: 'share',
          size: 'xl',
          class: '',
          text: '发芽饭',
          width: 25
        },
        {
          icon: 'search',
          size: 'xl',
          class: 'triangle-down-right',
          text: '煮粥',
          width: 25
        },
        {
          icon: 'question',
          size: 'xl',
          class: 'triangle-down-right',
          text: '糙米饭',
          width: 25
        }
      ]
    };
  }
};

export default popupConfig;
