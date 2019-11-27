<template>
  <div>

    <!-- mt: margin top -->
    <!-- More info on these params: https://getbootstrap.com/docs/4.0/utilities/colors/ -->
    <b-tabs v-model="tabIndex"
    content-class="mt-3"
    active-nav-item-class="font-weight-bold bg-primary text-white"
    align="center" >
      <b-tab title="1. Functional requirements" active><FirstTab :globalObject="this.$root.$data.globalObject" /></b-tab>
      <b-tab title="2. Goal trees & metrics"><SecondTab :globalObjectSection2="this.$root.$data.globalObject.treeSection" /></b-tab>
      <b-tab title="3. Provided resources"><ThirdTab :globalObjectSection3="this.$root.$data.globalObject.providedResources" /></b-tab>
      <b-tab title="4. Summary" > <FourthTab/> </b-tab>
    </b-tabs>


    <!-- Control buttons: Previous/Next tab -->
    <b-container class="mt-5" style="position: relative; bottom: 5px;">
      <b-button pill variant="primary" @click="tabIndex--">Previous</b-button>
      &nbsp;
      <b-button pill variant="primary" @click="tabIndex++">Next</b-button>
    </b-container>

  </div>
</template>


<script>
import FirstTab from './FirstTab.vue'
import SecondTab from './SecondTab.vue'
import ThirdTab from './ThirdTab.vue'
import FourthTab from './FourthTab.vue'


export default {
  name: 'Tabs',
  components: {
    FirstTab,
    SecondTab,
    ThirdTab,
    FourthTab
  },
  data() {
    return {
      tabIndex: 0,
    }
  }
}
</script>
