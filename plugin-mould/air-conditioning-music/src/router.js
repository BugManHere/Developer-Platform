import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = r => require.ensure([], () => r(require('./views/Home')), 'home');
const Offline = r => require.ensure([], () => r(require('./views/Offline')), 'offline');
const ErrorWarning = r => require.ensure([], () => r(require('./views/ErrorWarning')), 'ErrorWarning');

// 高级功能倒三角进入
const Test = r => require.ensure([], () => r(require('./views/functionPage/Test')));
const SweepConst = r => require.ensure([], () => r(require('./views/functionPage/Sweep-const')));
const Electric = r => require.ensure([], () => r(require('./views/functionPage/Electric')));
const Noise = r => require.ensure([], () => r(require('./views/functionPage/Noise.vue')));
const AssHt = r => require.ensure([], () => r(require('./views/functionPage/AssHt')));
const UDFanPort = r => require.ensure([], () => r(require('./views/functionPage/UDFanPort')));
const MusicCollect = r => require.ensure([], () => r(require('@components/card/grown/music/page/Collect.vue')));
const MusicDetail = r => require.ensure([], () => r(require('@components/card/grown/music/page/Detail.vue')));
const MusicPlay = r => require.ensure([], () => r(require('@components/card/grown/music/page/Play.vue')));
const SkillDetail = r => require.ensure([], () => r(require('@components/card/grown/skills/Detail.vue')));
const SkillSearchIndex = r => require.ensure([], () => r(require('@components/card/grown/skills/search/index.vue')));
const SkillSearchResult = r => require.ensure([], () => r(require('@components/card/grown/skills/search/Result.vue')));
const VoiceMessageIndex = r => require.ensure([], () => r(require('@components/card/grown/skills/voiceMsg/index.vue')));
const VoiceMessageEdit = r => require.ensure([], () => r(require('@components/card/grown/skills/voiceMsg/Edit.vue')));

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Offline',
      name: 'Offline',
      component: Offline
    },
    {
      path: '/ErrorWarning',
      name: 'ErrorWarning',
      component: ErrorWarning
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/SweepConst',
      name: 'SweepConst',
      component: SweepConst
    },
    {
      path: '/Electric',
      name: 'Electric',
      component: Electric
    },
    {
      path: '/Noise',
      name: 'Noise',
      component: Noise
    },
    {
      path: '/AssHt',
      name: 'AssHt',
      component: AssHt
    },
    {
      path: '/UDFanPort',
      name: 'UDFanPort',
      component: UDFanPort
    },
    {
      path: '/MusicCollect',
      name: 'MusicCollect',
      component: MusicCollect
    },
    {
      path: '/MusicDetail',
      name: 'MusicDetail',
      component: MusicDetail
    },
    {
      path: '/MusicPlay',
      name: 'MusicPlay',
      component: MusicPlay,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/SkillDetail/:id',
      name: 'SkillDetail',
      props: true,
      component: SkillDetail
    },
    {
      path: '/SkillSearch',
      name: 'SkillSearch',
      component: {
        render(h) {
          return h('router-view');
        }
      },
      redirect: '/SkillSearch/Index',
      children: [
        {
          path: 'Index',
          name: 'SkillSearchIndex',
          component: SkillSearchIndex
        },
        {
          path: 'Result',
          component: SkillSearchResult
        }
      ]
    },
    {
      path: '/VoiceMessage',
      name: 'VoiceMessage',
      component: {
        render(h) {
          return h('router-view');
        }
      },
      redirect: '/VoiceMessage/Index',
      children: [
        {
          path: 'Index',
          component: VoiceMessageIndex
        },
        {
          path: 'Edit',
          component: VoiceMessageEdit
        }
      ]
    }
  ]
});
// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果点击了“预览效果”，就刷新页面
  if (from.name && to.path === '/Loading') {
    router.go(0);
  }
  if (to.name !== 'Home') {
    // 顶栏颜色操作
    const color = '#F4F4F4';
    changeBarColor(color);
  }
  next();
});

export default router;
