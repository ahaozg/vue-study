<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"
                @add-feature="addFeature"/>
    <HelloWorld1 />
    <HelloWorld2 msg="hahahha" />
    <AchieveComponent msg="Welcome to Your Vue.js + TypeScript App"
                      @add-feature="addFeature" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld, {FeatureSelect} from '@/components/HelloWorld.vue'; // @ is an alias to /src
import HelloWorld1 from '@/components/HelloWorld1.vue';
import HelloWorld2 from '@/components/HelloWorld2';
import AchieveComponent from '@/components/AchieveComponent.vue';

@Component({
  components: {
    HelloWorld,
    HelloWorld1,
    HelloWorld2,
    AchieveComponent,
  }
})
export default class HomeView extends Vue {
  addFeature(feature: FeatureSelect) {
    console.log('addFeature', feature);
  }
}
</script>
