<template>
<div :class="['modal', {'is-active': active}]" >
    <div class="modal-background" @click="closeClick"></div>
    <div class="modal-content" >
		<h1 class="has-text-centered is-size-5">{{title}}</h1>
        <p v-for="line in message" :key="line.key" class="section">{{line.key}}: {{line.value}}</p>
		<p class="section">
			<a class="button" @click="okClick" v-if="ok">Rendben</a>
			<a class="button" @click="okClick" v-if="yes">Igen</a>
			<a class="button" @click="cancelClick" v-if="no">Nem</a>
			<a class="button" @click="cancelClick" v-if="cancel">Mégsem</a>
		</p>

    </div>
	<button class="modal-close is-large" aria-label="close" @click="closeClick"></button>
</div>
</template>

<script>
export default {
  name: 'detailPanel',
	props: {
		active: { type: Boolean, default: false},
		yes: { type: Boolean, default: false},
		no: { type: Boolean, default: false},
		cancel: { type: Boolean, default: false},
		ok: { type: Boolean, default: false},
		title: {type: String, default: '' },
		message: { type: Array, required: true },
		closeEvent: { type: String, default: 'modal-close' },
		okEvent: { type: String, default: 'modal-ok' },
		cancelEvent: { type: String, default: 'modal-cancel' }
	},
    data() {
        return {
		};
	},
	computed: {
    },
	methods: {
		closeClick()	{
			this.$emit(this.closeEvent);
		},
		okClick()	{
			this.$emit(this.okEvent);
		},
		cancelClick()	{
			this.$emit(this.cancelEvent);
		}
    }
}
</script>

<style scoped>
.button {
	cursor: pointer;
	text-decoration: none;
	align-items: center;
	display: flex;
	justify-content: center;
	padding: .5em 1em;
	vertical-align: top;
	border-style: solid;
	border-width: 1px;
	margin-bottom: 0;
	position: relative;
	border-radius: 5px;
}

.modal-content {
	background-color: white;
	overflow:visible;
	width: max-content;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 1em;
    position: relative;
	margin: 0 auto;
    max-height: calc(100vh - 40px);
}
.modal.is-active {
    display: flex;
}
.modal {
    align-items: center;
    display: none;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    z-index: 40;
}
.modal-background {
    background-color: rgba(10,10,10,.86);
}
.modal, .modal-background {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}

.section {
	overflow: visible;
	background-color: inherit;
	padding: 0.5rem;
}

</style>
