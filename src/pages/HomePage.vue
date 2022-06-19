<template>
    <div class="col-lg-6 offset-lg-3 coo-md-8 offset-md-2" data-testid="home-page">
        <user-list-component />
    </div>
</template>

<script>
import UserListComponent from '../components/UserList.vue';

export default {
    name: 'HomePage',

    components:{
        UserListComponent
    },

    data(){
        return{

        }
    },

    methods:{

    }
}
</script>

<style scoped>

</style>