<template>
    <div class="col-lg-6 offset-lg-3 coo-md-8 offset-md-2" data-testid="login-page">
			<div class="alert alert-danger" v-if="errorMessage.length!==0">{{errorMessage}}</div>
			<form v-on:submit.prevent="submitForm" data-testid="form-login">
				<card-component>
					<template v-slot:header>
						<h1 class="text-center">{{$t("login")}}</h1>
					</template>
					<template v-slot:body>
						<input-component :label="$t('email')" id="email" v-model="userModel.email" type="email"/>
						<input-component :label="$t('password')" id="password" v-model="userModel.password" type="password"/>
						<div class="text-center">
							<button-with-progress-component :isDisabled="disableButton" :isLoading="isLoading">{{$t("login")}}</button-with-progress-component>
						</div>
					</template>
				</card-component>
			</form>
    </div>
</template>

<script>
import userModel from '../models/user.js';
import ButtonWithProgressComponent from '../components/ButtonWithProgress.vue';
import InputComponent from '../components/Input.vue';
import { userLogin } from '../api/userServices.js';
import CardComponent from '../components/Card.vue';

export default{
	name: "LoginPage",

	components:{ ButtonWithProgressComponent, InputComponent, CardComponent },

	data(){
		return{
			/**@type {Object} Data model for storing new user */
			userModel: new userModel(),
			/**@type {Boolean} Boolean value to detect if the page is waiting for a request */
			isLoading: false,
			/**@type {<Object>} Validation errors*/
			errorMessage: "",
		}
	},

	methods:{
		async submitForm(){
			if(this.isLoading)
				return;
			this.isLoading = true;
			let response = await userLogin(this.userModel);
			if(response.status==200){
				this.$router.push("/");
				const data ={
					...response.data,
					header: `Bearer ${response.data.token}`
				}
				this.$store.commit('loginSuccess', data);
			}else{
				this.errorMessage = response.data.message;
			}
			this.isLoading = false;
		}
	},

	computed:{
		disableButton(){
			return (this.userModel.password.length === 0 || this.userModel.email.length === 0 || this.isLoading);
		},

		email(){
			return this.userModel.email;
		},

		password(){
			return this.userModel.password;
		},
	},

	watch:{
		email(){
			this.errorMessage = "";
		},

		password(){
			this.errorMessage = "";
		},
	}
}
</script>

<style scoped>

</style>