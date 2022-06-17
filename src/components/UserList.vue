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
		<div class="card-footer text-center">
			<button
				@click="loadPrevious()"
				:disabled="disablePrevious"
				class="btn btn-outline-secondary btn-sm">
				&lt; previous</button>
			<button
				@click="loadNext()"
				:disabled="disableNext"
				class="btn btn-outline-secondary btn-sm">
				next &gt;</button>
		</div>
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
			},
			/**@type {Number} Page position on the api call*/
			currentPage: 0,
			/**@type {Number} Size of user list to show*/
			listSize: 3
		}
	},

	mounted(){
		this.loadUsers();
	},

	methods:{
		async loadUsers(){
			let response = await getUsers(this.currentPage, this.listSize);
			if(response.status === 200){
				this.page = response.data;
			}else{
				return;
			}
		},

		async loadNext(){
			if(this.currentPage>=0 && this.currentPage < this.page.totalPages){
				this.currentPage++;
				await this.loadUsers();
			}
		},

		async loadPrevious(){
			if(this.currentPage>=0 && this.currentPage <= this.page.totalPages){
				this.currentPage--;
				await this.loadUsers();
			}
		}
	},

	computed:{
		disableNext(){
			return this.currentPage === this.page.totalPages-1;
		},

		disablePrevious(){
			return this.currentPage === 0;
		}
	}
}
</script>

<style scoped>

</style>