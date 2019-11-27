<template>
  <div>
    <img alt="Ditas logo" src="~@/assets/DITAS-Logo-horiz-hi.png">
  </div>
</template>


<script>
export default {
  name: 'Title',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 25%;
}
</style>
