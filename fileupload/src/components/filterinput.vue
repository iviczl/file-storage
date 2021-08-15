<template>
<div class="control has-icons-right" @mouseover="mouseIn = true" @mouseout="mouseIn = false">
  <input ref="filterInput" type="text" v-model="inputValue" class=" input is-fullwidth" :disabled="disabled" :style="inputStyle()"
    @focus="focus" @blur="blur"/>
  <span class="icon is-small is-right clickable" @click="emptyFilter"  v-show="mouseIn">
    <i class="fas fa-times" ></i>
  </span>
</div>
</template>

<script>
export default {
  name: 'filterinput',
  props: {
    value: { type: String, default: '' },
    ignoreCase: { type: Boolean, default: true },
    returnType: { type: String, default: 'object'},
    fontSize: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      inputValue: this.value,
      mouseIn: false
    }
  },
  watch: {
    inputValue() {
      switch (this.returnType) {
        case 'string':
          this.$emit('filter-updated', this.inputValue);
          break;
        default:
          this.$emit('filter-updated', new RegExp(this.inputValue, this.ignoreCase ? 'i' : ''));
          break;
      }
    },
    value() {
      this.inputValue = this.value;
    }
  },
  methods: {
    emptyFilter() {
      this.inputValue = '';
    },
    inputStyle() {
      return {
        fontSize: this.fontSize + 'em'
      };
    },
    focusOnInput() {
      this.$refs.filterInput.focus();
    },
    focus() {
      this.$emit('input-focus');
    },
    blur() {
      this.$emit('input-blur');
    }
  }
}
</script>

<style scoped>
.control.has-icons-right .icon {
  pointer-events: initial;
	width: 1em;
}
.control.has-icons-right .input {
  padding-right: 1em;
}

.input.is-fullwidth {
	max-height: 100%;
  height: 100%;
}
.clickable {
  cursor: pointer;
}
</style>
