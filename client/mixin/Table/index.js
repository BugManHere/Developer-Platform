// import { deepCopy } from '@utils';
import { mapState, mapGetters } from 'vuex';
import gdpTable from '@/gdp-ui/table';
import { deepCopy } from '@utils';

export default {
  components: {
    [gdpTable.name]: gdpTable
  },
  computed: {
    ...mapState({
      iconArr: state => state.userModule.iconArr,
      productType: (state, getters) => getters.productType
    }),
    ...mapGetters(['funcDefine', 'typeDefine']),
    // 标题
    titleList() {
      return [
        {
          text: '功能名称',
          key: 'name',
          editAble: this.editAble,
          type: 'text',
          flex: 12
        },
        {
          text: '标识符',
          key: 'identifier',
          editAble: this.editAble,
          type: 'text',
          flex: 12
        },
        {
          text: '控制字段',
          key: 'json',
          editAble: this.editAble,
          type: 'text',
          flex: 12
        },
        {
          text: '类型',
          key: 'type',
          editAble: this.editAble,
          default: '默认',
          options: this.selectOptions,
          method: this.editAble ? this._select : () => {},
          type: 'select',
          flex: 14
        },
        {
          text: '状态简要',
          key: 'statusDefine',
          editAble: this.editAble,
          type: 'brief',
          method: this.editAble ? this._more : () => {},
          flex: 36
        },
        {
          text: '操作',
          options: this.iconOptions,
          type: 'icon',
          flex: 14
        }
      ];
    },
    // 内容
    contentArray() {
      // 行数 = this.imshowModels.length
      return this.imshowModels
        .map(model => {
          if (!model) return false;
          // 列数 = this.titleList.length
          return this.titleList.map(title => {
            const content = {
              type: title.type
            };
            let target = model[title.key];
            // 根据type填充内容
            switch (title.type) {
              case 'text':
                content.text = target;
                break;
              case 'select':
                content.options = title.options;
                content.default = title.default;
                content.method = title.method;
                content.select = model;
                content.key = title.key;
                content.value = target;
                break;
              case 'brief':
                content.method = title.method;
                content.options = Object.keys(target)
                  .filter(statusName => statusName !== 'undefined')
                  .map(statusName => {
                    const status = target[statusName];
                    let text = `${status.name}：${status.value}`;
                    text += status.moreCommand ? '+' : '';
                    return text;
                  });
                break;
              case 'icon':
                content.options = title.options;
                break;
              default:
                break;
            }
            return content;
          });
        })
        .filter(v => v);
    }
  },
  methods: {
    getRealIndex(index) {
      return this.imshowModels[index].realIndex;
    },
    deepCopy(val) {
      return deepCopy(val);
    }
  }
};
