<template>
  <v-app-bar  :clipped-left=clipped  fixed app>
    <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
      <v-btn icon @click.stop="toggleMiniVariant()">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
    <v-btn icon @click.stop="toggleClipped()">
      <v-icon>mdi-application</v-icon>
    </v-btn>
    <v-toolbar-title v-text="title" />
    <v-spacer />
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      title: 'Inter Purchasing',
    }
  },
  computed: {
      clipped: {
      get() {
        return this.$store.state.clipped
      },
      set(newVal) {
        this.$store.commit('set_clipped', newVal)
      },
    },
    miniVariant: {
      get() {
        return this.$store.state.miniVariant
      },
      set(newVal) {
        this.$store.commit('set_miniVariant', newVal)
      },
    },
  },
  methods: {
    toggleDrawer() {
      console.log(this.$store.state.drawer)
      this.$store.commit('set_drawer', !this.$store.state.drawer)
    },
    toggleClipped() {
        console.log(this.$store.state.clipped)
      this.$store.commit('set_clipped', !this.$store.state.clipped)
    },
    toggleMiniVariant() {
      console.log(this.$store.state.miniVariant)
      this.$store.commit('set_miniVariant', !this.$store.state.miniVariant)
    },
  },
}
</script>

<style>
</style>