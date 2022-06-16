<template>
    <div class="col-lg-6 offset-lg-3 coo-md-8 offset-md-2" data-testid="signup-page">
        <div class="alert alert-success mt-5" v-if="successfulSignup">{{$t("accountActivationNotification")}}</div>
        <form v-on:submit.prevent="submitForm" class="card" data-testid="form-sign-up" v-if="!successfulSignup">
            <div class="card-header">
                <h1 class="text-center">{{$t("signUp")}}</h1>
            </div>
            <div class="card-body">
                <input-component :label="$t('username')" id="username" :help="errors.username" v-model="userModel.username" type="text"/>
                <input-component :label="$t('email')" id="email" :help="errors.email" v-model="userModel.email" type="email"/>
                <input-component :label="$t('password')" id="password" :help="errors.password" v-model="userModel.password" type="password"/>
                <input-component :label="$t('passwordRepeat')" id="password-repeat" :help="passwordMismatch ? $t('passwordMismatchValidation') : ''" v-model="repeatPassword" type="password"/>
                <div class="text-center">
                    <button :disabled="disableButton" type="submit" class="btn btn-primary">
                        <spinner-component v-if="isLoading"/>
                        {{$t("signUp")}}
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import userModel from '../models/user.js';
import { createNewUser } from '../api/userServices.js';
import InputComponent from '../components/Input.vue';
import SpinnerComponent from '../components/Spinner.vue';

export default {
    name: 'SignUpPage',

    components:{
        InputComponent, SpinnerComponent
    },

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
            /**@type {<Object>} Validation errors*/
            errors: {}
        }
    },

    methods:{
        async submitForm(){
            this.errors = {};
            if(this.isLoading){
                return;
            }
            this.isLoading = true;
            const response = await createNewUser(this.userModel);
            if(response.status === 200){
                this.userModel = new userModel();
                this.successfulSignup = true;
                this.repeatPassword = "";
            }else if(response.status === 400){
                this.errors =  response.data ? response.data.validationErrors : {};
            }
            this.isLoading = false;
        }
    },

    computed:{
        disableButton(){
            return (this.userModel.password !== this.repeatPassword || 
                this.userModel.password.length === 0 ||
                this.isLoading);
        },

        passwordMismatch(){
            return (this.userModel.password != this.repeatPassword);
        },

        username(){
            return this.userModel.username;
        },

        email(){
            return this.userModel.email;
        },

        password(){
            return this.userModel.password;
        },
    },

    watch:{
        username(){
            delete this.errors.username
        },

        email(){
            delete this.errors.email
        },

        password(){
            delete this.errors.password
        },
    }
}
</script>

<style>

</style>