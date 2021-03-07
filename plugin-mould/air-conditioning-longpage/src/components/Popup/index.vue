<template>
  <div class="popup-group">
    <svst-picker-popup />
  </div>
</template>

<script>
import SvStPicker from './SvStPicker';

export default {
  name: 'popup-group',
  components: {
    [SvStPicker.name]: SvStPicker
  }
};
</script>
