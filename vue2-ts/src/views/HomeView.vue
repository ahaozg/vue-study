<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <HelloWorld1 />
    <HelloWorld2 msg="hahahha" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import HelloWorld1 from '@/components/HelloWorld1.vue';
import HelloWorld2 from '@/components/HelloWorld2';

@Component({
  components: {
    HelloWorld,
    HelloWorld1,
    HelloWorld2,
  },
})
export default class HomeView extends Vue {}
</script>
