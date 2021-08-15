<template>
	<div class="field is-horizontal">
		<div v-if="typeof title === 'string'" class="field-label is-normal">
			<label class="label">{{title + (required ? '*' : '')}}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<input :name="name" ref="input" class="input is-small" type="text" v-model="textValue" @input="handleInput" :size="size" :maxlength="maxLength" :disabled="isDisabled" />
				</div>
				<p class="help is-danger" v-if="error" v-text="error"></p>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'textInput',
	props: {
		name: String,
		value: String,
		label: [String, undefined],
		maxLength: Number,
		size: Number,
		error: String,
		required: Boolean,
		disabled: Boolean
	},
	data() {
		return {
			title: this.label,
			textValue: this.value,
			isDisabled: this.disabled
		}
	},
	watch: {
		value() {
			this.textValue = this.value;
		},
		disabled() {
			this.isDisabled = this.disabled;
		}
	},
	methods: {
		handleInput(){
			this.$emit('input', this.textValue);
		},
		focus() {
			this.$nextTick(() =>this.$refs.input.focus());
		}
	}
}
</script>
