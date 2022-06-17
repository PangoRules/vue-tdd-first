<template>
	<div data-testid="userlist-page" class="card">
		<div class="card-header text-center">
			<h3>Users</h3>
		</div>
		<ul class="list-group list-group-flush">
			<li
				class="list-group-item list-group-item-action"
				v-for="(user, index) in page.content"
				v-bind:key="index">{{user.username}}</li>
		</ul>
	</div>
</template>

<script>
import { getUsers } from '../api/userServices.js';

export default{
	name: 'UserList',

	data(){
		return{
			/**@type {Object} Page object with the current users*/
			page: {
				content: [],
				page: 0,
				size: 0,
				totalPages: 0
			}
		}
	},

	mounted(){
		this.loadUsers();
	},

	methods:{
		async loadUsers(){
			let response = await getUsers();
			if(response.status === 200){
				this.page = response.data;
			}else{
				return;
			}
		}
	}
}
</script>

<style scoped>

</style>