<template>
	<div>
		<img
			src="../assets/profile.png"
			alt="profile"
			width="30"
			class="rounded-circle shadow-sm" />
		{{user.username}}
	</div>
</template>

<script>
	export default {
		props:{
			user: Object
		},
	}
</script>

<style lang="scss" scoped>

</style>