<template>
  <div class="account">
    <Register v-if="loginType === 'Register'"/>
    <Login v-else/>
  </div>
</template>

<script>
import Login from '@components/Login';
import Register from '@components/Register';

export default {
  props: ['loginType'],
  components: {
    Login,
    Register
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
