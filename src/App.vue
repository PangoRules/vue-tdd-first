<template>
    <div class="shadow-sm bg-light">
        <nav class="navbar navbar-expand navbar-light container">
            <div class="container-fluid ">
                <a
                  class="navbar-brand"
                  @click="onClickLink"
                  href="/"
                  title="Home">
                  <img src="./assets/hoaxify.png" width="60" alt="Hoaxify Logo">
                  Hoaxify</a>
                <ul class="navbar-nav ml-auto">
                    <a
                      class="nav-link"
                      @click="onClickLink"
                      href="/signup"
                      title="Sign-Up">{{$t('signUp')}}</a>
                      <a
                      class="nav-link"
                      @click="onClickLink"
                      href="/login"
                      title="Login">{{$t('login')}}</a>
                </ul>
            </div>
        </nav>
    </div>
    <div class="container">
        <HomePage data-testid="home-page" v-if="path==='/'"/>
        <SignUpPage data-testid="signup-page" v-else-if="path==='/signup'"/>
        <LoginPage data-testid="login-page" v-else-if="path==='/login'"/>
        <UserPage data-testid="user-page" v-else-if="path.startsWith('/user/')"/>
        <LanguageSelector />
    </div>
</template>

<script>
import SignUpPage from './pages/SignUpPage.vue';
import LanguageSelector from './components/LanguageSelector.vue';
import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import UserPage from './pages/UserPage.vue';

export default {
    name: 'App',
    components: {
        SignUpPage,
        LanguageSelector,
        HomePage,
        LoginPage,
        UserPage
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
