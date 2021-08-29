<template>
  <v-app-bar :clipped-left="clipped" fixed app>
    <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
    <v-btn icon @click.stop="toggleMiniVariant()">
      <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
    </v-btn>
    <v-btn icon @click.stop="toggleClipped()">
      <v-icon>mdi-application</v-icon>
    </v-btn>
    <img class="mr-4"   src="~/static/logo.png" height="50" />

    <v-spacer />
       <v-menu  open-on-hover offset-y transition="slide-x-transition" bottom right>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn x-large icon v-bind="attrs" v-on="on">
                         <v-icon>mdi-account-circle</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item v-for="(item, index) in account" :key="index" router :to="item.link">
                       <v-list-item-action>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-menu>
    <v-switch
      class="mt-5"
      v-model="swtheme"
      v-on:click="toggleDarkMode()"
      inset
      prepend-icon="mdi-white-balance-sunny"
      persistent-hint
    ></v-switch>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      title: 'Inter Purchasing',
      swtheme: false,
         account: [{
                icon: "mdi-domain",
                title: "Profile",
                link: "/mmrservices"
            },
            {
                icon: "mdi-message-text",
                title: "Logout",
                link: "/logout"
            }
        ]
    }
  },
  mounted() {
    const theme = localStorage.getItem('dark_theme')
    if (theme) {
      if (theme == 'true') {
        this.$vuetify.theme.dark = true
        this.swtheme = true
      } else {
        this.$vuetify.theme.dark = false
        this.swtheme = false
      }
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
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('dark_theme', this.$vuetify.theme.dark.toString())
    },
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