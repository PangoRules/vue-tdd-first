<template>
	<div data-testid="user-page">
		<div class="alert alert-secondary text-center" v-if="isLoading">
			<spinner-component size="medium"/>
		</div>
		<profile-card-component :user="user" v-if="!isLoading && errorMessage.length===0"/>
		<div class="alert alert-danger text-center" v-show="errorMessage.length!==0">
			<h3>{{errorMessage}}</h3>
		</div>
	</div>
</template>

<script>
	import ProfileCardComponent from '../components/ProfileCard.vue';
	import {getUser} from '../api/userServices.js';
	import SpinnerComponent from '../components/Spinner.vue';

	export default{
		name: "UserPage",

		components:{ ProfileCardComponent, SpinnerComponent },

		data(){
			return{
				/**@type  {Boolean} Detects if there is something loading to show or hide spinner*/
				isLoading: false,
				/**@type {Object} Object with the data of the user */
				user: {},
				/**@type {String} Error message returned from backend if any*/
				errorMessage: ""
			}
		},

		mounted(){
			this.loadUser();
		},

		methods:{
			async loadUser(){
				this.isLoading = true;
				let response = await getUser(this.$route.params.id);
				if(response.status === 200){
					this.user = response.data;
				}else{
					this.errorMessage = response.data.message;
				}
				this.isLoading = false;
			}
		}
	}
</script>

<style scoped>

</style>