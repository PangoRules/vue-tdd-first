<template>
    <div class="col-lg-6 offset-lg-3 coo-md-8 offset-md-2">
        <div class="alert alert-success mt-5" v-show="successfulSignup">Please check your e-mail to activate your account</div>
        <form v-on:submit.prevent="submitForm" class="card">
            <div class="card-header">
                <h1 class="text-center">Sign Up</h1>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input id="username" type="text" class="form-control" placeholder="username" v-model="userModel.username">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input id="email" type="email" class="form-control" placeholder="e-mail" v-model="userModel.email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input id="password" type="password" class="form-control" placeholder="password" v-model="userModel.password">
                </div>
                <div class="mb-3">
                    <label for="password-repeat" class="form-label">Password Repeat</label>
                    <input id="password-repeat" type="password" class="form-control" placeholder="password" v-model="repeatPassword">
                </div>
                <div class="text-center">
                    <button :disabled="disableButton" type="submit" class="btn btn-primary">
                        <span class="spinner-border spinner-border-sm" role="status" v-show="isLoading"></span>
                        Sign Up
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import userModel from '../models/user.js';
import userServices from '../api/userServices.js';

export default {
    name: 'SignUpPage',

    data(){
        return{
            /**@type {Object} Data model for storing new user */
            userModel: new userModel(),
            /**@type {String} String for the repeat password field */
            repeatPassword: "",
            /**@type {Boolean} Boolean value to detect if the page is waiting for a request */
            isLoading: false,
            /**@type {Boolean} Indicates if the signup was successful */
            successfulSignup: false,
        }
    },

    methods:{
        async submitForm(){
            if(this.loading){
                return;
            }
            this.loading = true;
            const response = await userServices.createNewUser(this.userModel);
            if(response){
                this.userModel = new userModel();
                this.successfulSignup = true;
                this.repeatPassword = "";
            }
            this.loading = false;
        }
    },

    computed:{
        disableButton(){
            return (this.userModel.password !== this.repeatPassword || 
                this.userModel.password.trim().length === 0 ||
                this.isLoading);
        }
    }
}
</script>

<style>

</style>