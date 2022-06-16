<template>
	<div data-testid="activation-page">
        <spinner-component v-if="isLoading" size="normal"/>
		<div class="alert alert-success mt-3" v-if="success">Account is activated</div>
		<div class="alert alert-danger mt-3" v-if="fail">Activation failure</div>
	</div>
</template>

<script>
import { activateUser } from "../api/userServices.js";
import SpinnerComponent from "../components/Spinner.vue";

export default{
    components:{
        SpinnerComponent
    },

	data(){
		return{
			/**@type{Boolean} Tracks if api call was successful to activate an user account */
			success: false,
			/**@type{Boolean} Tracks if api call failed to activate an user account */
			fail: false,
			/**@type{Boolean} Checks if spinner must show */
			isLoading: false
		}
	},

	mounted(){
		this.activateUserAccount();
	},

	methods:{
		async activateUserAccount(){
            this.isLoading = true;
			let response = await activateUser(this.$route.params.token);
			if(response.status == 200){
				this.success=true;
			}else{
				this.fail=true;
			}
            this.isLoading = false;
		}
	}
}
</script>

<style scoped>
</style>