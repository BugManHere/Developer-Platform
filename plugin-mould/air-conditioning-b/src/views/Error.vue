<template>
  <gree-view>
    <gree-page class="page-error">
      <gree-header
        :left-options="{preventGoBack: true}"
        @on-click-back="goBack"
      >{{ $language('error.notify_fault_title') }}</gree-header>
      <div class="error-box">
        <img
          v-if="hasReportedForRepair"
          src="@/assets/img/progress-logo.png"
        />
        <img
          v-else
          src="@/assets/img/snag-logo.png"
        />
        <h3
          class="reported-repair"
          v-if="hasReportedForRepair"
        >{{ $language('error.notify_Repaired') }}</h3>
        <h3 v-else>{{ $language('error.notify_Not_Repaired') }}</h3>
        <fieldset></fieldset>
        <div class="error-main">
          <p>{{ `${$language('error.notify_fault_code')}：${errorCode}` }}</p>
          <p>{{ `${$language('error.notify_fault_name')}：${errorName}` }}</p>
        </div>
      </div>
      <img
        v-if="hasReportedForRepair"
        src="@/assets/img/reservation.png"
        class="error-snag"
        @click="goPage(true)"
      />
      <img
        v-else
        src="@/assets/img/snagBook.png"
        class="error-snag"
        @click="goPage(false)"
      />
      <h1
        @click="goPage(true)"
        v-if="hasReportedForRepair"
      >{{ $language('error.notify_repair_book') }}</h1>
      <h1
        class="no-repaired"
        @click="goPage(false)"
        v-else
      >{{ $language('error.notify_repair_book') }}</h1>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header } from 'gree-ui';
import { mapState } from 'vuex';
import errorConfig from '@/mixins/utils/error';
import {
  closePage,
  toWebPage
} from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header
  },
  mixins: [errorConfig],
  computed: {
    ...mapState({
      Mod: state => state.dataObject.Mod,
      ModHeat: state => state.ModHeat,
      errorCode: state => state.errorCode,
      hasReportedForRepair: state => state.hasReportedForRepair
    }),
    errorName() {
      return this.errorList[this.errorCode];
    }
  },
  methods: {
    /**
     * @description 返回键
     */
    goBack() {
      closePage();
    },
    goPage(val) {
      let url;
      let txt;
      val
        ? (url = 'http://pgxt.gree.com:7909/hjzx/bx/chabx.jsp')
        : 'http://pgxt.gree.com:7909/hjzx/bx/addbx.jsp';
      if (val) {
        url = 'http://pgxt.gree.com:7909/hjzx/bx/chabx.jsp';
        txt = this.$language('error.notify_repair_inquiries');
      } else {
        url = 'http://pgxt.gree.com:7909/hjzx/bx/addbx.jsp';
        txt = this.$language('error.notify_repair_book');
      }
      toWebPage(url, txt);
    }
  }
};
</script>
