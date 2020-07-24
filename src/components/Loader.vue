<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
}
.loading {
  display: flex;
  flex-wrap: wrap;
  width: 27px;
}
.tile {
  opacity: 0;
  width: 7px;
  height: 7px;
  background: #1f9aff;
}
.tile:not(:nth-of-type(3n - 2)) {
  margin-left: 3px;
}
.tile:not(:nth-of-type(-n + 3)) {
  margin-top: 3px;
}
.tile[class*='wave'] {
  animation: wave 0.8s ease-in infinite;
}
.tile.wave-01 {
  animation-delay: 0.1s;
}
.tile.wave-02 {
  animation-delay: 0.2s;
}
.tile.wave-03 {
  animation-delay: 0.3s;
}
.tile.wave-04 {
  animation-delay: 0.4s;
}
.tile.wave-05 {
  animation-delay: 0.5s;
}
.tile.wave-06 {
  animation-delay: 0.6s;
}
.tile.wave-07 {
  animation-delay: 0.7s;
}
.tile.wave-08 {
  animation-delay: 0.8s;
}
@keyframes wave {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80%,
  100% {
    opacity: 0;
  }
}
</style>

<template>
  <div class="loader">
    <div class="loading">
      <div class="tile wave-01"></div>
      <div class="tile wave-02"></div>
      <div class="tile wave-03"></div>
      <div class="tile wave-08"></div>
      <div class="tile"></div>
      <div class="tile wave-04"></div>
      <div class="tile wave-07"></div>
      <div class="tile wave-06"></div>
      <div class="tile wave-05"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loader'
}
</script>
