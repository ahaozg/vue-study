<template>
  <div class="AchieveComponent">
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
import {Prop, Vue, Emit, Watch} from 'vue-property-decorator';
import Axios from 'axios';

// 类型别名
type Feature = {
  id: number;
  name: string;
}

// 交叉类型
export type FeatureSelect = Feature & {selected: boolean}

function Component(target: any): any {
  const options: any = {};
  const proto = target.prototype;
  const keys = Object.getOwnPropertyNames(proto);
  keys.forEach(key => {
    if (key !== 'constructor') {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        if (typeof desc.value === 'function') {
          const lifeCycle = ['beforeCreated', 'created', 'beforeMounted', 'mounted'];
          if (lifeCycle.includes(key)) {
            options[key] = proto[key];
            // options[key] = desc.value;
          } else {
            const methods = options.methods = options.methods || {};
            methods[key] = desc.value;
          }
        } else if (desc.get || desc.set) {
          const computed = options.computed = options.computed || {};
          computed[key] = {
            get: desc.get,
            set: desc.set,
          }
        }
      }
    }
  });
  options.data = function () {
    const data: any = {};
    const vm = new target();
    Object.keys(vm)
        .filter(key => !key.startsWith('_') && !key.startsWith('$'))
        .forEach(key => {
          data[key] = vm[key];
        })
    return data;
  }

  return Vue.extend(options);
}

@Component
export default class AchieveComponent extends Vue {
  @Prop({type: String, required: true})
  private msg!: string;

  features: FeatureSelect[] = [];

  async created() {
    // this.features = (await getResult<FeatureSelect[]>()).data;
    Axios.get<FeatureSelect[]>('/api/list').then(res => {
      this.features = res.data;
    })
  }

  @Emit()
  addFeature(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement;
    const feature: FeatureSelect = {
      id: this.features.length + 1,
      name: input.value,
      selected: false
    }
    this.features.push(feature);
    input.value = '';
    return feature;
  }

  get count() {
    return this.features.length
  }

  @Watch('features', {
    immediate: true,
    deep: true,
  })
  onFeaturesChange(val: FeatureSelect[], old: FeatureSelect[]) {
    console.log('onFeaturesChange', val.length, old && old.length);
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
