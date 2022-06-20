<template>
    <div class="shadow-sm bg-light mb-3">
        <nav class="navbar navbar-expand navbar-light container">
            <div class="container-fluid ">
                <router-link
                  class="navbar-brand"
                  to="/"
                  title="Home">
                  <img src="../assets/hoaxify.png" width="60" alt="Hoaxify Logo">
                  Hoaxify</router-link>
                <ul class="navbar-nav ml-auto">
                    <router-link
											v-if="!$store.state.isLoggedIn"
                      class="nav-link"
                      to="/signup"
                      title="Sign-Up">{{$t('signUp')}}</router-link>
										<router-link
											v-if="!$store.state.isLoggedIn"
                      class="nav-link"
                      to="/login"
                      title="Login">{{$t('login')}}</router-link>
										<router-link
											v-if="$store.state.isLoggedIn"
                      class="nav-link"
                      :to="`/user/${$store.state.id}`"
                      title="Profile">{{$t('profile')}}</router-link>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>

</script>

<style scoped>

</style>