<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html, body {
	scroll-behavior: smooth;
}
</style>
