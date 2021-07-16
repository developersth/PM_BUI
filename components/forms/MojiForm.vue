<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">เพิ่มข้อมูลขนมโมจิ</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="moji.name"
                label="Name*"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="moji.store"
                label="Store Name*"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="moji.price"
                label="Price*"
                type="number"
                required
              />
            </v-col>
          </v-row>
          <small>*indicates required field</small>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
              <v-btn
            color="red"
           @click="dialog = false"
          >
          close
    </v-btn>
      <v-btn
            class="ma-2"
            :loading="loading"
            :disabled="loading"
            color="primary"
            @click="loader = 'loading'"
          >
          SAVE
    </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dialog: false,
      mode: '',
      moji: {
        name: '',
        store: '',
        price: ''
      }
    }
  },
   watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },
  methods: {
    open (mode, data) {
      this.dialog = true
      this.mode = mode
      if (data) {
        this.moji = { ...data }
      }
    },
    close () {
      this.dialog = false
      this.clearData()
    },
    clearData () {
      this.moji = {
        name: '',
        store: '',
        price: ''
      }
    },
    save () {
      this.$emit(this.mode, this.moji)
    }
  }
}
</script>
