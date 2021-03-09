import { decrypt } from './encryption';

export const analysisTimer = list => {
  if (!list) return [];
  const newList = JSON.parse(JSON.stringify(list));
  newList.forEach(ele => {
    const { cmd, key } = ele.task;

    if (navigator.PluginInterface) {
      // 此处做生产环境和开发环境的判断
      // 此处做数据解析处理后，直接替换cmd。
      // eg: cmd: 'abcdefgh'  (decrypt)=>  cmd: {opt: ['Pow', 'Mod'], p: [1, 2]}
      const decryptvalue = decrypt(cmd, key);
      try {
        ele.task.cmd = JSON.parse(decryptvalue);
      } catch (error) {
        console.error(error);
        ele.task.cmd = { t: 'cmd', opt: ['Pow'], p: [1] };
      }
    }
  });
  return newList;
};
