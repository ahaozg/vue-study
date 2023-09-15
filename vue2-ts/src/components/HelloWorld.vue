<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      <input type="text" @keydown.enter="addFeature">
    </p>
    <ul>
      <li v-for="feature in features"
          :class="{selected: feature.selected}"
          :key="feature.id">
        {{feature.name}}
      </li>
      <li>总数：{{count}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Axios from 'axios';

// 类型别名
type Feature = {
  id: number;
  name: string;
}

// 交叉类型
type FeatureSelect = Feature & {selected: boolean}

interface Result<T> {
  ok: number;
  data: T;
}

// 泛型方法
function getResult<T>(): Promise<Result<T>> {
  const data: any = [
    {id: 1, name: '类型注解', selected: false},
    {id: 2, name: '编译形语言', selected: true},
  ]
  return Promise.resolve({
    ok: 0 | 1,
    data
  });
}

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  features: FeatureSelect[] = [];

  async created() {
    // this.features = (await getResult<FeatureSelect[]>()).data;
    Axios.get<FeatureSelect[]>('/api/list').then(res => {
      this.features = res.data;
    })
  }

  addFeature(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement;
    const feature: FeatureSelect = {
      id: this.features.length + 1,
      name: input.value,
      selected: false
    }
    this.features.push(feature);
    input.value = '';
  }

  get count() {
    return this.features.length
  }
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
