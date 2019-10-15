<template>
  <div class="home">
    <!-- <div class="row">
      <button type="button" class="btn btn-default" aria-label="Left Align">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
      </button>
    </div>
    <div class="row">
      <button type="button" class="btn btn-default" aria-label="Left Align">
        <div>
          <img src="@assets/img/aircondition.png">
          <div class="bottom-table">

          </div>
        </div>
      </button>
    </div> -->
    <div class="card-table">
      <div
        @click="setDialogType(true)">
        <div class="main">
          <div class="body">
            <svg t="1570514807789" class="icon plus" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7108" width="200" height="200"><path d="M 927.878 467.618 h -377.118 v -365.861 c 0 -16.8859 -16.8859 -39.4004 -39.4004 -39.4004 c -22.5145 0 -39.4004 22.5145 -39.4004 45.029 v 365.861 H 106.097 c -22.5145 -5.62863 -45.029 16.8859 -45.029 39.4004 s 22.5145 39.4004 39.4004 39.4004 h 365.861 v 365.861 c 5.62863 22.5145 22.5145 45.029 45.029 45.029 s 39.4004 -22.5145 39.4004 -39.4004 v -371.49 h 371.49 c 22.5145 0 39.4004 -22.5145 39.4004 -39.4004 s -11.2573 -45.029 -33.7718 -45.029 Z" fill="" p-id="7109"></path></svg>
            <span>添加新产品</span>
          </div>
        </div>
      </div>
      <div>
        <div class="main">
          <div class="body">
          </div>
        </div>
      </div>
    </div>
    <div
      class="overlay-backdrop"
      v-show="isShowDialog"/>
    <transition name="fade">
      <Dialog
        @hideDialog="setDialogType"
        v-show="isShowDialog"/>
    </transition>
  </div>
</template>

<script>
import Dialog from '@components/dialog';
import https from '../https';
import { mapState, mapMutations } from "vuex";

export default {
  name: 'home',
  components: {
    Dialog
  },
  data () {
    return {
      isShowDialog: false,
    }
  },
  computed: {
    ...mapState({
      admin: state => state.admin,
      productList: state => state.productList,
    }),
  },
  mounted () {
    https.fetchGet('/product')
      .then((data) => {
        const productList = data.data.productList;
        this.setState(['productList', productList]);
      })
      .catch((err) => {
        console.log(err);
      })
    https.fetchPost('/admin', {admin: this.admin})
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  },
  methods: {
    ...mapMutations({
      setState: "SET_STATE"
    }),
    setDialogType(val) {
      console.log(this.productList);
      this.isShowDialog = val;
    }
  }
}
</script>
