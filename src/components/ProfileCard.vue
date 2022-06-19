<template>
	<card-component>
		<template v-slot:header>
			<img
			src="../assets/profile.png"
			alt="profile"
			width="200"
			class="rounded-circle shadow" />
		</template>
		<template v-slot:body>
			<h3>{{user.username}}</h3>
		</template>
	</card-component>
</template>

<script>
import CardComponent from './Card.vue';

export default {
	name: "ProfileCardComponent",

	components:{ CardComponent },

	props:{
		user: Object
	}
}
</script>

<style lang="scss" scoped>

</style>