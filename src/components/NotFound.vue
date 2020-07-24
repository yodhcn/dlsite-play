<template>
  <div class="page">
    <header class="navigation-bar">
      <div v-if="!$app.$data.isWide" class="menu" @click="$app.$data.isShowMenu = true" v-touchfeedback>
        <svgicon name="hamburger-menu" width="20" height="20" color="#fff"></svgicon>
      </div>
    </header>

    <div class="page-content page-bottom scroll">
      <div class="empty-box">
        <h1>Not Found</h1>
        <h2>{{ $t('app.not_found') }}</h2>
        <hr />
        <h3 @click="$router.push('/library')" class="link" v-touchfeedback>
          {{ $t('library.title') }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-found'
}
</script>
