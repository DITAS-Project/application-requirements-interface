<template>
  <div id="app">
    <Title/>
    <br>
    <Tabs/>
    <br>
      <h6 class="mt-2" style="position:relative; bottom:0; text-align: center;"
      > This project is funded by the European Commission under the Horizon 2020 Programme under grant agreement no. 731945
     </h6>
  </div>
</template>

<script>
import Title from './components/Title.vue'
import Tabs from './components/Tabs.vue'

export default {
  name: 'app',
  components: {
    Title,
    Tabs,
  },
  /*
  data() {
    return {
      someVariable: "someValue",

    }
  },
  */
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
