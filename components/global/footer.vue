<template>
  <div>
     <v-footer
      :absolute="fixed"
      app
    >
      <span>G-innovation &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
    }
  },
}
</script>

<style>
</style>