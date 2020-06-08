<template>
	<div class="level">
		<div class="level-left">
            Items per page
            <b-numberinput
				size="is-small"
				controls-position="compact"
				:min="1"
				v-model="value.limit"
				@input="changeLimit"/>
            / {{value.total}}
		</div>
		<div class="level-right" style="flex-grow: 1">
			<b-pagination v-show="value.total" style="width: 100%"
				:key="key"
				:current="value.page"
				:per-page="+value.limit"
				:total="value.total"
				@change="changePage">
			</b-pagination>
		</div>
	</div>
</template>

<script>
import debounce from 'lodash/debounce';
export default {
	name: 'PaginationComponent',
	props: {
		value: {
			required: true,
			type: Object
		}
	},
	data() {
		return {
			key: 1
		};
	},
	watch: {
		value() {
			// rerender component by changing key
			this.key++;
		}
	},
	methods: {
		changePage(page) {
			this.value.page = page;
			this.update();
		},
		changeLimit: debounce(function(limit) {
			limit = isNaN(limit) ? 1 : +limit;
			if (limit <= 0)
				limit = 1;

			this.value.limit = limit;
			this.update();
		}, 300),
		decreaseTotal(value) {
			this.value.total -= value;
			this.update();
		},
		calcPage() {
			let totalPages = Math.ceil(this.value.total / this.value.limit) || 1;
			if (this.value.page > totalPages)
				this.value.page = totalPages;
		},
		update() {
			this.calcPage();
			this.$emit('input', this.value);
		}
	}
};
</script>
