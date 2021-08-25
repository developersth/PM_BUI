<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="dialog-top-transition"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">ข้อมูล Payment Term #{{mode}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="8">
              <v-text-field 
                v-model="form.name"
                label="ชื่อ Payment Term*"
                required
              />
            </v-col>
                     <v-col cols="4">
              <v-switch
                v-model="form.status"
                :label="`สามารถใช้งานได้`"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> CLOSE </v-btn>
        <v-btn class="ma-2" color="primary" @click="save()">
          SAVE
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      mode: '',
      form: {
        name: '',
        status: true,
      },
    }
  },
  methods: {
    open(mode, data) {
      this.mode = mode
      this.dialog = true
      if (data) {
        this.form = { ...data }
      }
    },
    close() {
      this.dialog = false
      this.clearData()
    },

    clearData() {
      this.form = {
        name: '',
        status: true,
      }
    },
    save() {
       this.$emit(this.mode, this.form) //Send to  @add="submitAddSupplier"
      //this.$store.commit('addSupplier', this.supplier)
    },
  },
}
</script>