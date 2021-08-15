<template>
	<div class="field is-horizontal">
		<div v-if="typeof label === 'string'" class="field-label is-normal">
			<label class="label">{{title + (required ? '*' : '')}}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<div class="select is-small" :class="{ 'is-multiple' : multiple, 'is-fullwidth' : fullWidth }">
						<select v-if="hasGroups && visibleIfEmpty ? true : hasGroups && listItems != null" :name="name" ref="input" v-model="selected" @change="handleInput" @input="input" :disabled="isDisabled" :multiple="multiple" 
							:size="size ? size : (multiple ? itemCount : 1)" >
							<option v-if="emptyText" :disabled="required" :value="emptyValue">({{ emptyText }})</option>
							<optgroup v-for="group in listItems" :key="group.name" :label="group.name">
								<option v-for="item in group.items" :key="item.value" :class="{ 'marked': marked && marked.includes(item.value) }"
									:value="item.value" :disabled="item.disabled" >
									{{item.title}}
								</option>
							</optgroup>
						</select>
						<select v-else-if="visibleIfEmpty ? true : listItems.length > 0" :name="name" ref="input" v-model="selected" @change="handleInput" @input="input" :disabled="isDisabled" :multiple="multiple" 
							:size="size ? size : (multiple ? itemCount : 1)" >
							<option v-if="emptyText" :disabled="required" :value="emptyValue">({{ emptyText }})</option>
							<option v-for="item in listItems" :key="item.value" :class="{ 'marked': marked && marked.includes(item.value) }"
								:value="item.value" :disabled="item.disabled" >
								{{item.title}}
							</option>
						</select>
					</div>
				</div>
				<p class="help is-danger" v-if="error" v-text="error"></p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'selectInput',
	props: {
		name: String,
		value: [String, Number, Array],
		markedValue: [String, Number, Array],
		label: [String, undefined],
		error: String,
		items: [Array, Object],
		required: Boolean,
		disabled: Boolean,
		fullWidth: () => [Boolean, false],
		size: Number,
		emptyText: String,
		multiple: { type: Boolean, default: false },
		maxSelectable: Number,
		visibleIfEmpty: { type: Boolean, default: false }
	},
	data() {
		return {
			title: this.label,
			selected: this.value,
			marked: this.markedValue,
			isDisabled: this.disabled,
			listItems: this.items,
			selectedItems: [],
			shouldHandleChange: true
		}
	},
	computed: {
		hasGroups() {
			return !Array.isArray(this.listItems);
		},
		itemCount() {
			if(this.hasGroups){
				let count = 0;
				for (const group in this.listItems) {
					count += group.items.length + 1;
				}
				return count;
			} else {
				return this.listItems.length;
			}
		},
		emptyValue() {
			let empty = null;
			switch (typeof this.value) {
				case 'number':
					empty = 0;
					break;
				case 'string':
					empty = this.value ? '' : null;
					break;
				case 'undefined':
					empty = undefined
					break;
			}
			return empty;
		}
	},
	watch: {
		items() {
			this.listItems = this.items;
		},
		value() {
			this.selected = this.value;
		},
		label() {
			this.title = this.label;
		},
		disabled() {
			this.isDisabled = this.disabled;
		}
	},
	methods: {
		input(e) {
			if(this.maxSelectable && this.maxSelectable < e.target.selectedOptions.length) {
				for(let option of e.target.options) {
					if(this.selected.includes(option.value)) {
						option.selected = true;
					}
					else {
						option.selected = false;
					}
				}
				this.shouldHandleChange = false;
			}
		},
		handleInput() {
			if(this.shouldHandleChange) {
				this.$emit('input', this.selected);
			}
			this.shouldHandleChange = true;
		},
		focus() {
			this.$nextTick(() => this.$refs.input.focus());
		}
	}
}
</script>

<style scoped>
.select select {
	box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
	overflow-y: auto;
}

.select:not(.is-multiple):not(.is-loading)::after {
	border-color: black;
}
.select select:focus, .select select:active {
	border-color: 	black !important;
	outline: none;
}
.field-label {
	text-align: left;
}
.marked {
	background-color: aquamarine;
}
</style>
