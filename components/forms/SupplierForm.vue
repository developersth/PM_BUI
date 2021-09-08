<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="dialog-top-transition"
    max-width="600px"
  >
    <v-card>
          <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="save()"
      >
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>ข้อมูล Supplier #{{ mode }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  :rules="nameRules"
                  v-model="supplier.name"
                  label="ชื่อ Supplier"
                  required
                />
              </v-col>
              <v-col cols="4">
                <v-switch
                  v-model="supplier.status"
                  :label="`สามารถใช้งานได้`"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> CLOSE </v-btn>
        <v-btn class="ma-2" color="primary" type="submit">
          SAVE
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-card-actions>
              </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      valid:true,
      mode: '',
      supplier: {
        name: '',
        status: true,
      },
       nameRules: [(v) => !!v || 'กรุณากรอก ชื่อ Supplier'],
    }
  },
  methods: {
    open(mode, data) {
      this.clearData()
      this.mode = mode
      this.dialog = true
      if (data) {
        this.supplier = { ...data }
      }
    },
    close() {
      this.dialog = false
      this.clearData()
    },

    clearData() {
      this.supplier = {
        name: '',
        status: true,
      }
    },
    save() {
      if (!this.$refs.form.validate()) return //chek validate
      this.$emit(this.mode, this.supplier) //Send to  @add="submitAddSupplier"
      //this.$store.commit('addSupplier', this.supplier)
    },
  },
}
</script>