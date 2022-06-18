<template>
    <div data-testid="home-page">
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