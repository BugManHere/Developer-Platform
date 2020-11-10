import store from '../store';

// 定义一个类，每个mac在localStorage分配一个空间
class Storage {
  constructor(props) {
    this.props = props || {};
    this.source = this.props.source || window.localStorage;
    this.initRun();
  }
  // 初始化
  initRun() {
    this.source[store.state.control.mac] || window.localStorage.setItem(store.state.control.mac, '{}');
  }
  // 设置数据
  set(key, value, mac = store.state.control.mac) {
    const data = JSON.parse(this.source[mac]);
    data[key] = value;
    window.localStorage.setItem(mac, JSON.stringify(data));
    return value;
  }
  // 获取数据
  get(key, mac = store.state.control.mac) {
    const data = JSON.parse(this.source[mac] || '{}');
    return data[key];
  }
  // 删除操作
  remove(key, mac = store.state.control.mac) {
    const data = JSON.parse(this.source[mac]);
    const value = data[key];
    delete data[key];
    window.localStorage.setItem(mac, JSON.stringify(data));
    return value;
  }
  // 清除操作
  clear(mac = store.state.control.mac) {
    window.localStorage.setItem(mac, '{}');
    return {};
  }
}

export default Storage;
