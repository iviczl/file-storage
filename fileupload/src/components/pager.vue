<template>
<nav v-if="isVisible()" class="pagination is-small is-centered" role="navigation" aria-label="pagination">
  <a class="pagination-link pagination-previous" :disabled="!hasPrevious()" @click="previous">előző</a>
  <a class="pagination-link pagination-next" :disabled="!hasNext()" @click="next">következő</a>
	<span class="page">lap: {{ page }}</span>
</nav>
</template>
<script>
export default {
		name: 'pager',
		props: {
			totalCount: { type: Number, required: true },
			pageSize: { type: Number, required: true },
			page: { type: Number, required: true }
		},
		data() {
			return {

			};
		},
		methods: {
			isVisible() {
				return this.pageCount() > 1;
			},
			pageCount() {
				return Math.ceil(this.totalCount / this.pageSize);
			},
			hasNext() {
				return this.page < this.pageCount();
			},
			hasPrevious() {
				return this.page > 1;
			},
			previous() {
				if(this.hasPrevious()) {
					this.$emit('page-previous', this.page - 1);
				}
			},
			next() {
				if(this.hasNext()) {
					this.$emit('page-next', this.page + 1);
				}
			}
		}
}
</script>
<style scoped>
.page {
	margin-left: 16px;
	align-self: center;
}
.pagination {
	display: flex;
	flex-direction: row ;
	font-size: 0.9rem;
	width: fit-content;
	justify-content: space-between;
	overflow: hidden;
	overflow-x: auto;
	white-space: nowrap;
	align-items: stretch;
	-webkit-box-align: stretch;
}
.pagination-link {
	cursor: pointer;
  text-decoration: none;
	-webkit-box-align: center;
	align-items: center;
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	padding: .5em 1em;
	vertical-align: top;
	border-style: solid;
	border-width: 1px;
	margin-bottom: 0;
	position: relative;
}
.pagination-link.pagination-previous {
	border-radius: 5px 0 0 5px;
}
.pagination-link.pagination-next {
	border-radius: 0 5px 5px 0;
}
.pagination-link.is-active {
	background-color: #0e3295;
	border-color: #0e3295;
	color: white;
	z-index: 1;
}
</style>