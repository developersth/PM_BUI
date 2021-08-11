<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="pink">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>จัดการเอกสาร</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="firstname"
                  :counter="10"
                  label="เลขที่เอกสาร"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="วันที่เอกสาร"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    :active-picker.sync="activePicker"
                    :max="
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                    "
                    min="1950-01-01"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" lg="12">
                <v-card width="100vw">
                  <v-app-bar dark color="info">
                    <v-toolbar-title>Purchase Order</v-toolbar-title>

                    <v-spacer></v-spacer>
                  </v-app-bar>
                  <v-row>
                    <v-col cols="12" lg="12">
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="po"
                            label="เลขที่ใบสั่งซื้อ (PO)"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            truncate-length="30"
                            label="ไฟล์แนบ"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="po"
                        label="เลขที่ใบขอซื้อ (PR)"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="po"
                        label="เลขที่ Job"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-file-input
                        truncate-length="30"
                        label="ไฟล์แนบ"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" lg="12">
                      <v-btn large depressed color="green">
                        <v-icon> mdi-plus</v-icon>เพิ่ม PR
                      </v-btn>
                    </v-col>
                    <v-col>
                      <div
                        class="form-group"
                        v-for="(input, k) in inputs"
                        :key="k"
                      >
                        <v-text-field
                          v-model="input.name"
                          label="เลขที่ Job"
                          required
                        ></v-text-field>
                            <v-btn large depressed color="info"  @click="add(k)">
                        <v-icon> mdi-plus</v-icon>เพิ่ม
                      </v-btn>
                          <v-btn large depressed color="red"   @click="remove(k)">
                        <v-icon> mdi-del</v-icon>ลบ
                      </v-btn>
                      </div>
                    </v-col>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="6" md="6">
                          <v-row>
                            <v-col class="d-flex" cols="8" md="8">
                              <v-select
                                :items="items"
                                label="ผู้ขอซื้อ"
                                outlined
                              ></v-select>
                            </v-col>
                            <v-col cols="4" md="4">
                              <v-btn large depressed color="primary">
                                <v-icon> mdi-plus</v-icon>เพิ่มผู้ขอซื้อ
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="d-flex" cols="8" md="8">
                              <v-select
                                :items="items"
                                label="Supplier"
                                outlined
                              ></v-select>
                            </v-col>
                            <v-col cols="4" md="4">
                              <v-btn large depressed color="primary">
                                <v-icon> mdi-plus</v-icon>เพิ่ม Supplier
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="6">
                          <v-textarea label="รายละเอียด"> </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      inputs: [{ name: '' }],
      alignments: ['start', 'center', 'end'],
      items: ['Suchanya Sripumkai (Ning)', 'FMC', 'end'],
      loading: false,
      dialog: false,
      firstname: '',
      po: '',
      mode: '',
      users: {
        username: '',
        name: '',
        email: '',
        mobile: '',
      },
      activePicker: null,
      date: null,
      menu: false,
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  methods: {
    add(index) {
      this.inputs.push({ name: '' })
    },
    remove(index) {
      this.inputs.splice(index, 1)
    },
    save(date) {
      this.$refs.menu.save(date)
    },
    open(mode, data) {
      this.dialog = true
      this.mode = mode
      if (data) {
        this.users = { ...data }
      }
    },
    close() {
      this.dialog = false
      this.clearData()
    },
    clearData() {
      this.users = {
        username: '',
        name: '',
        email: '',
        mobile: '',
      }
    },
    save() {
      this.$emit(this.mode, this.users)
    },
  },
}
</script>