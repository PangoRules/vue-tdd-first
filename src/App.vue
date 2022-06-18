<template>
	<navbar-component />
	<div class="container">
		<router-view />
		<LanguageSelector />
	</div>
</template>

<script>
import LanguageSelector from './components/LanguageSelector.vue';
import NavbarComponent from './components/Navbar.vue';

export default {
	name: 'App',
	components: {
		LanguageSelector, NavbarComponent
	},
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
