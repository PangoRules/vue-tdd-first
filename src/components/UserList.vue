<template>
	<div data-testid="userlist-page">
		<card-component>
			<template v-slot:header>
				<h3>{{$t("userListPage.header")}}</h3>
			</template>
			<template v-slot:default>
				<ul class="list-group list-group-flush">
					<li
						class="list-group-item list-group-item-action"
						v-for="(user) in page.content"
						:key="user.id"
						@click="$router.push(`/user/${user.id}`)">
						<user-list-item-component :user="user"/>
						</li>
				</ul>
			</template>
			<template v-slot:footer>
				<button
				@click="loadPrevious()"
				:disabled="disablePrevious"
				v-show="!isLoading"
				class="btn btn-outline-secondary btn-sm">
				{{$t("userListPage.previousPage")}}</button>
				<button
					@click="loadNext()"
					:disabled="disableNext"
					v-show="!isLoading"
					class="btn btn-outline-secondary btn-sm">
					{{$t("userListPage.nextPage")}}</button>
					<spinner-component size="medium" v-if="isLoading"/>
			</template>
		</card-component>
	</div>
</template>

<script>
import { getUsers } from '../api/userServices.js';
import UserListItemComponent from '../components/UserListItem.vue';
import SpinnerComponent from '../components/Spinner.vue';
import CardComponent from '../components/Card.vue';

export default{
	name: 'UserList',

	components:{
		UserListItemComponent, SpinnerComponent, CardComponent
	},

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
			listSize: 3,
			/**@type  {Boolean} Detects if there is something loading to show or hide spinner*/
			isLoading: false
		}
	},

	mounted(){
		this.loadUsers();
	},

	methods:{
		async loadUsers(){
			this.isLoading = true;
			let response = await getUsers(this.currentPage, this.listSize);
			if(response.status === 200){
				this.page = response.data;
			}else{
				return;
			}
			this.isLoading = false;
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
li{
	cursor: pointer;
}
</style>