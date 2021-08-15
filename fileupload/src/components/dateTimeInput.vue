<template>
	<div class="field is-horizontal" >
		<div v-if="typeof label === 'string'" class="field-label is-normal">
			<label class="label ">{{title + (required ? '*' : '')}}</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control" >
					<!-- YYYY.MM.DD. HH:mm  :format="dateFormat()"-->
					<!-- format="YYYY-MM-DD HH:mm" -->
					<!-- formatted="lll" -->
					<!-- input-class="theme-orange"						 -->
					<datetime-picker v-if="exists" :key="key" ref="picker" :disabled="disabled"
						v-model="dateTimeString"
						:input-id="name"
						:format="{ year: 'numeric',month: '2-digit',day: '2-digit',hour:'2-digit',minute:'2-digit'}" 
						:min-datetime="minDateString" 
						:max-datetime="maxDateString" 
						:type="dateOnly ? 'date' : (timeOnly ? 'time' : 'datetime')" 
						:value-zone="Intl.DateTimeFormat().resolvedOptions().timeZone" 
						:zone="zone" 
						:phrases="{ ok: 'Rendben', cancel: 'Mégsem' }"
						:auto="true"
						@input="handleInput"
						input-class="fit-width">
					</datetime-picker>
				</div>
				<p class="help is-danger" v-if="error" v-text="error"></p>
			</div>
		</div>
	</div>
</template>

<script>
import { Datetime } from 'vue-datetime';
import { Settings } from 'luxon';
import {formatDate} from '@/modules/dateHelper.js';

export default {
	name: 'dateTimeInput',
	props: {
		name: String,
		value: [Date, String],
		label: [String, undefined],
		error: String,
		required: Boolean,
		disabled: Boolean,
		zone: () =>[String, 'Europe/Budapest'],
		minDate: [Date, String],
		maxDate: [Date, String],
		dateOnly: { type: Boolean, default: false }
	},
	components: {
		'datetime-picker': Datetime
	},
	data() {
		return {
			title: this.label,
			dateValue: this.value,
			timeOnly: false,
			exists: true,
			locale: 'hu'
		}
	},
	computed: {
		key() {
			return Math.random();
		},
		actualLocale() {
			return this.locale === 'en' ? 'en-GB' : 'hu-HU';
		},
		dateTimeString: {
			get() {
				return this.dateValue.toISOString(this.actualLocale);
			},
			set(value) {
				this.dateValue = new Date(value);
			}
		},
		maxDateString() {
			if(!this.maxDate) { return undefined; }
			return this.maxDate.toISOString(this.actualLocale);
		},
		minDateString() {
			if(!this.minDate) { return undefined; }
			return this.minDate.toISOString(this.actualLocale);
		}
	},
	watch: {
		value() {
			this.dateValue = this.value;
		},
		label() {
			this.title = this.label;
		}
	},
	methods: {
			dateFormatter(date) {
			return `${date}`;
		},
		dateFormat() {
			return 'YYYY. MM. DD.';
		},
		handleInput() {
			this.$emit('input', this.dateValue);
		}
	},
	created() {
		Settings.defaultLocale = 'hu';
	}
}
</script>

<style >
@import '~vue-datetime/dist/vue-datetime.min.css';

.fit-width {
	max-width: 120px;
	padding-left: 4px;
	padding-right: 4px;
	cursor: pointer;
}
/* .theme-orange .vdatetime-popup__header,
.theme-orange .vdatetime-calendar__month__day--selected > span > span,
.theme-orange .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #FF9800;
}

.theme-orange .vdatetime-year-picker__item--selected,
.theme-orange .vdatetime-time-picker__item--selected,
.theme-orange .vdatetime-popup__actions__button {
  color: #ff9800;
} */

</style>
