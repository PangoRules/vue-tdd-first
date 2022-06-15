<template>
    <div class="shadow-sm bg-light">
        <nav class="navbar navbar-expand navbar-light container">
            <div class="container-fluid ">
                <router-link
                  class="navbar-brand"
                  to="/"
                  title="Home">
                  <img src="./assets/hoaxify.png" width="60" alt="Hoaxify Logo">
                  Hoaxify</router-link>
                <ul class="navbar-nav ml-auto">
                    <router-link
                      class="nav-link"
                      to="/signup"
                      title="Sign-Up">{{$t('signUp')}}</router-link>
                      <router-link
                      class="nav-link"
                      to="/login"
                      title="Login">{{$t('login')}}</router-link>
                </ul>
            </div>
        </nav>
    </div>
    <div class="container">
        <router-view />
        <LanguageSelector />
    </div>
</template>

<script>
import LanguageSelector from './components/LanguageSelector.vue';

export default {
    name: 'App',
    components: {
        LanguageSelector,
    },
    data(){
        return {
            path: window.location.pathname
        }
    },
    // computed:{
    //     path(){
    //         return window.location.pathname;
    //     }
    // },
    methods:{
        onClickLink(event){
            this.path = event.currentTarget.attributes.href.value;
            window.history.pushState({}, "", this.path)
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
