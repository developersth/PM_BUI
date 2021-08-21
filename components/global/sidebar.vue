<template lant="html">
  <v-navigation-drawer v-model="drawer" :mini-variant=miniVariant   :clipped=clipped fixed app>
    <v-list class="font-display">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'mdi-file-document',
          title: 'จัดการเอกสาร',
          to: '/documents'
        },
        {
          icon: 'mdi-account',
          title: 'ผู้ใช้งาน',
          to: '/users'
        },
        {
          icon: 'mdi-pencil',
          title: 'crudaction',
          to: '/crudaction'
        }
      ],
      title: 'SasTech International Purchasing'
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(newVal) {
        this.$store.commit('set_drawer', newVal)
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
    clipped: {
      get() {
        return this.$store.state.clipped
      },
      set(newVal) {
        this.$store.commit('set_clipped', newVal)
      },
    },
  },
  methods: {},
}
</script>
