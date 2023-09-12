<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="feature in features"
          :class="{selected: feature.selected}"
          :key="feature.id">
        {{feature.name}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

// 类型别名
type Feature = {
  id: number;
  name: string;
}

type FeatureSelect = Feature & {selected: boolean}

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  features: FeatureSelect[] = [
    {id: 1, name: '类型注解', selected: false},
    {id: 2, name: '编译形语言', selected: true},
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

.selected {
  background: #63c68f;
}

a {
  color: #42b983;
}
</style>
