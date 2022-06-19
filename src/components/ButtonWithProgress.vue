<template>
	<button :disabled="isDisabled" :type="type" :class="errorFlag ? 'btn btn-danger': 'btn btn-primary'" @click="onClick">
		<spinner-component v-if="isLoading"/>
		<slot>Button</slot>
	</button>
</template>

<script>
import SpinnerComponent from './Spinner.vue';

export default {
	name: 'ButtonWithProgress',

	emits:['custom-button-click'],

	data(){
		return{
			/**@type{Boolean} - Checks if the button is trying to emit event if it is of type submit */
			errorFlag: false
		}
	},

	props:{
		isDisabled:{
			type: Boolean,
			default: true
		},
		isLoading:{
			type: Boolean,
			default: false
		},
		type:{
			type: String,
			default: "submit"
		}
	},

	components:{
		SpinnerComponent
	},

	methods:{
		onClick(){
			this.errorFlag = false;
			if(this.type==='submit'){
				this.errorFlag = true;
				return;
			}
			this.$emit('custom-button-click');
		}
	}
}
</script>

<style lang="scss" scoped>

</style>