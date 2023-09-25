<template>
  <div class="home">
    <h2 @click="$store.commit('add')">{{$store.state.count}}</h2>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  asyncData({store}) {
    return store.dispatch('getCount');
  }
}
</script>
