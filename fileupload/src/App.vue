<template>
  <div id="app" class="app">
    <p class="wide">
      <router-link class="menu-link" to="/">Kezdőlap</router-link>
      <router-link class="menu-link" to="/about">About</router-link>
    </p>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style scoped>
.wide {
  width: 100%;
  background-color: #3c3c3c;
  height: fit-content;
  display: flex;
  flex-direction: row;
}
.menu-link {
  color: white;
  text-decoration: none;
  margin: 1rem 2rem;
  display: flex;
}
</style>
<style >
.app {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9 rem;
}
</style>
