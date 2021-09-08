<template>
  <v-card class="mx-auto">
    <v-img
      class="white--text align-end"
      height="500px"
      src="./pexels-fauxels-3183153.jpg"
    >
      <v-card-title class="primary"
        >ยินดีต้อนรับเข้าสู่ระบบจัดซื้อ</v-card-title
      >
    </v-img>

    <v-card-text class="text--primary">
      <div>สวัสดี คุณ {{ $store.getters.isName }}</div>

      <div>LEADERSHIP TURNKEY EPC CONTRACTOR IN OIL & GAS AND ENERGY INDUSTRY.</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" nuxt to="/documents"> Continue </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  //middleware: 'auth',
  components: {
    Logo,
    VuetifyLogo,
  },
}
</script>
