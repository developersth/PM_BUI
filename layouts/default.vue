<template>
  <v-app dark class="app">
    <topbar></topbar>
    <Sidebar></Sidebar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from '@/components/global/footer'
import Sidebar from '@/components/global/sidebar'
import Topbar from '@/components/global/topbar'
export default {
  components: {
    Footer,
    Sidebar,
    Topbar
  },
  data() {
    return {

    }
  },
}
</script>
<style scoped>
.app{
  font-family: 'Kanit',sans-serif;
}
</style>
