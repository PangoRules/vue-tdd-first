<template>
    <form v-on:submit.prevent="submitForm">
        <h1>Sign Up</h1>
        <label for="username">Username</label>
        <input id="username" type="text" placeholder="username" v-model="userModel.username">
        <label for="email">E-mail</label>
        <input id="email" type="email" placeholder="e-mail" v-model="userModel.email">
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="password" v-model="userModel.password">
        <label for="password-repeat">Password Repeat</label>
        <input id="password-repeat" type="password" placeholder="password" v-model="repeatPassword">
        <button :disabled="disableButton" type="submit">Sign Up</button>
    </form>
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
        }
    },

    methods:{
        async submitForm(){
            const response = await userServices.createNewUser(this.userModel);
            console.log("🚀 ~ file: SignUpPage.vue ~ line 33 ~ submitForm ~ response", response);
        }
    },

    computed:{
        disableButton(){
            return (this.userModel.password !== this.repeatPassword || 
                this.userModel.password.trim().length === 0);
        }
    }
}
</script>

<style>

</style>