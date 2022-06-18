<template>
	<div data-testid="user-page">
		<profile-card-component :user="user"/>
	</div>
</template>

<script>
	import ProfileCardComponent from '../components/ProfileCard.vue';
	import {getUser} from '../api/userServices.js';

	export default{
		name: "UserPage",

		components:{ ProfileCardComponent },

		data(){
			return{
				/**@type  {Boolean} Detects if there is something loading to show or hide spinner*/
				isLoading: false,
				/**@type {Object} Object with the data of the user */
				user: {}
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
					return;
				}
				this.isLoading = false;
			}
		}
	}
</script>

<style scoped>

</style>