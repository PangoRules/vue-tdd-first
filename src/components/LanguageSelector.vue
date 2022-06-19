<template>
    <div class="col-lg-6 offset-lg-3 coo-md-8 offset-md-2">
        <img src="https://countryflagsapi.com/png/mx" alt="Flag of Mexico" title="Spanish" @click="$i18n.locale = 'es'">
        <img src="https://countryflagsapi.com/png/usa" alt="Flag of USA" title="English" @click="$i18n.locale = 'en'">
    </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
img{
    cursor: pointer;
    width: 2rem!important;
}
img:not(:first-child){
    margin-inline: 1rem!important;
}
</style>