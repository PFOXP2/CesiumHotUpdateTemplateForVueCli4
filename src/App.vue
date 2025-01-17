<template>
  <div id="app">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from './cesiumSource'
import './cesiumSource/packages/widgets/Source/widgets.css'

export default {
  created() {
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer')
  },
  methods: {

  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#cesiumContainer {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
