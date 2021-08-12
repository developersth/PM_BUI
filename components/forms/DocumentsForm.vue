<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      scrollable
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
            <v-btn text @click="dialog = false"
              >Save <v-icon> mdi-content-save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <div class="text-center">
            <v-btn
              :disabled="dialogLoading"
              :loading="dialogLoading"
              class="white--text"
              color="purple darken-2"
              @click="dialogLoading = true"
            >
              Start loading
            </v-btn>
            <v-dialog
              v-model="dialogLoading"
              hide-overlay
              persistent
              width="300"
            >
              <v-card color="primary" dark>
                <v-card-text>
                  Please Wait
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-form>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="firstname"
                    prepend-icon="mdi-text-box-outline"
                    :counter="10"
                    label="เลขที่เอกสาร"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.DocDate"
                        label="วันที่เอกสาร"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="12">
                  <div class="font-weight-medium text-decoration-underline">
                    Status
                  </div>
                  <v-radio-group v-model="form.status" row>
                    <v-radio
                      outlined
                      color="secondary"
                      label="Incomplete"
                      value="Incomplete"
                    ></v-radio>
                    <v-radio
                      color="primary"
                      label="Acknowledged"
                      value="Acknowledged"
                    ></v-radio>
                    <v-radio
                      color="orange"
                      label="In Progress"
                      value="In Progress"
                    ></v-radio>
                    <v-radio
                      color="info"
                      label="Shipped"
                      value="Shipped"
                    ></v-radio>
                    <v-radio
                      color="red"
                      label="Received"
                      value="Received"
                    ></v-radio>
                    <v-radio
                      color="green"
                      label="Completed"
                      value="Completed"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" lg="12">
                  <!--               <v-card>
                  <v-app-bar dark color="info">
                    <v-toolbar-title>Purchase Order</v-toolbar-title>

                    <v-spacer></v-spacer>
                  </v-app-bar> -->
                  <div class="font-weight-medium text-decoration-underline">
                    Purchase Order
                  </div>
                  <v-row>
                    <v-col cols="12" lg="12">
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="po"
                            prepend-icon="mdi-file-document"
                            label="เลขที่ใบสั่งซื้อ (PO)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            prepend-icon="mdi-file-multiple"
                            truncate-length="30"
                            label="ไฟล์แนบ (PO)"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row
                        class="form-group"
                        v-for="(itemPR, k) in form.itemPR"
                        :key="k"
                      >
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="itemPR.PRNo"
                            prepend-icon="mdi-file-document"
                            :label="`เลขที่ใบสั่งขอซื้อ (PR) #${k + 1}`"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="itemPR.JobNo"
                            prepend-icon="mdi-account-hard-hat"
                            :label="`เลขที่ Job #${k + 1}`"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8" md="2">
                          <v-file-input
                            v-model="itemPR.PRFile"
                            prepend-icon="mdi-file-multiple"
                            chips
                            multiple
                            label="ไฟล์แนบ (PR)"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="4" md="2">
                          <v-btn
                            v-if="k > 0"
                            depressed
                            color="red"
                            @click="removePR(k)"
                          >
                            <v-icon> mdi-delete</v-icon>ลบ PR
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-btn depressed color="green" @click="addPR()">
                        <v-icon> mdi-plus</v-icon>เพิ่ม PR
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-row>
                        <v-col class="d-flex" cols="8" md="3">
                          <v-text-field
                            prepend-icon="mdi-cash-100"
                            label="มูลค่าสินค้า (ทั้งหมด)"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="4" md="3">
                          <v-select
                          v-model="form.currency"
                            :items="currency"
                            label="สกุลเงิน"
                            dense
                            outlined
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="6" md="6">
                          <v-row>
                            <v-col cols="10" md="10">
                              <v-autocomplete
                                :items="items"
                                prepend-icon="mdi-account-tie-voice"
                                outlined
                                dense
                                chips
                                small-chips
                                label="ผู้ขอซื้อ"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn depressed color="primary">
                                <v-icon> mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="d-flex" cols="10" md="10">
                              <v-autocomplete
                                :items="items"
                                prepend-icon="mdi-account-switch"
                                outlined
                                dense
                                chips
                                small-chips
                                label="Supplier"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn depressed color="primary">
                                <v-icon> mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="6">
                          <v-textarea
                            label="รายละเอียด"
                            prepend-icon="mdi-card-account-details"
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6" md="6">
                          <v-row>
                            <v-col class="d-flex" cols="10" md="10">
                              <v-autocomplete
                                :items="items"
                                prepend-icon="mdi-contactless-payment"
                                outlined
                                dense
                                chips
                                small-chips
                                label="Payment Term"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn depressed color="info">
                                <v-icon> mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="d-flex" cols="10" md="10">
                              <v-autocomplete
                                :items="items"
                                prepend-icon="mdi-truck-delivery"
                                outlined
                                dense
                                chips
                                small-chips
                                label="Delivery Term"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn depressed color="info">
                                <v-icon> mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="6">
                          <v-textarea
                            label="หมายเหตุ"
                            prepend-icon="mdi-card-account-details"
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <!-- </v-card> -->
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <!--      <v-btn color="blue darken-1" text @click="dialog = false">
            Save
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      form: {
        DocNo: '',
        DocDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        itemPR: [{ PRNo: '', JobNo: '', PRFile: null }],
        currency:'THB',
        status: 'Incomplete',
      },

      dialog: false,
      dialogLoading: false,
      menu2: false,
      alignments: ['start', 'center', 'end'],
      currency: ['THB', 'USD','CNY','EUR'],
      items: ['Suchanya Sripumkai (Ning)', 'FMC', 'end'],
      loading: false,
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
    dialogLoading(val) {
      if (!val) return
      setTimeout(() => (this.dialogLoading = false), 4000)
    },
  },
  methods: {
    addPR(index) {
      this.form.itemPR.push({ PRNo: '', JobNo: '', PRFile: null })
    },
    removePR(index) {
      if (this.form.itemPR.length > 1) {
        this.form.itemPR.splice(index, 1)
      }
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