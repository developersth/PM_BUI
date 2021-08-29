<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>ข้อมูล Payment #{{ mode }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-container>
            <div class="text-h6 text-decoration-underline">
              Payment Requisition
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menuPaymentDate"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.PaymentDate"
                      clearable
                      label="Payment Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.PaymentDate"
                    @change="menuPaymentDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-radio-group v-model="form.Status" row>
                  <v-radio
                    outlined
                    color="red"
                    label="Incomplete"
                    value="Incomplete"
                  ></v-radio>
                  <v-radio
                    color="green"
                    label="Completed"
                    value="Completed"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="form.PaymentName"
                  :items="itemsPayment"
                  label="จ่ายให้ / Pay to"
                  @change="paymentChange"
                />
              </v-col>
              <v-col cols="10" md="6">
                <v-select
                  v-model="form.PaymentTo"
                  :items="itemsPayment"
                  :label="`${form.PaymentName} name`"
                />
              </v-col>
              <v-col cols="2" md="2">
                <v-btn depressed color="primary">
                  <v-icon> mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.Purpose"
                  :items="itemsPurpose"
                  :label="`เพื่อใช้ / Purpose for`"
                  item-value="id"
                  item-text="name"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-if="form.Purpose === 5"
                  v-model="form.PurposeOther"
                  label="ระบุ อื่นๆ*"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  class="mt-6"
                  v-model="form.PoNo"
                  :items="itemsPoNo"
                  dense
                  chips
                  small-chips
                  label="PO No."
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.PRNo" label="PR No." />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.InvoiceNo" label="Invoice No." />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.AirWayBillNo"
                  label="Air Waybill No."
                />
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="form.itemPR"
                  :hide-default-footer="true"
                  class="elevation-1"
                >
                  <template v-slot:[`item.Number`]="{ item }">
                    {{ form.itemPR.indexOf(item) + 1 }}
                  </template>
                  <template
                    style="width: 20%"
                    v-slot:[`item.PRDetail`]="{ item }"
                  >
                    <v-text-field v-model="item.PRDetail" />
                  </template>
                  <template v-slot:[`item.JobNo`]="{ item }">
                    <v-select
                      v-model="item.JobNo"
                      :items="itemsPayment"
                      label="Job No."
                    />
                  </template>
                  <template v-slot:[`item.PRNo`]="{ item }">
                    <v-text-field v-model="item.PRNo" />
                  </template>
                  <template v-slot:[`item.Price`]="{ item }">
                    <v-text-field type="number" v-model="item.Price" />
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      small
                      color="red"
                      @click="removeItemPR(item)"
                    >
                      <v-icon dark> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-card-actions>
                  <v-spacer />
                  <v-btn depressed color="green" @click="addItemPR()">
                    <v-icon> mdi-plus</v-icon>เพิ่ม Job/PR
                  </v-btn>
                </v-card-actions>
              </v-col>
              <v-col cols="8"> </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  type="number"
                  v-model="form.PriceTotal"
                  label="จำนวนเงินทั้งหมด."
                />
              </v-col>
            </v-row>

            <small class="red--text">
              Note!! 1 ใบเบิก สามารถทำได้ 1 Invoice,1 Invoce สามารถมีได้หลาน PO
              1 PO สามารถมีได้หลาย PR,JOB
            </small>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="dialog = false"> CLOSE </v-btn>
        <v-btn
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          color="primary"
          @click="save()"
        >
          SAVE
          <v-icon right dark> mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
      <div class="text-center">
        <v-dialog v-model="loading" hide-overlay persistent width="300">
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
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      mode: '',
      form: {
        PaymentDate: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        Status: 'Completed',
        PaymentName: 'Supplier',
        PaymentTo: '',
        Purpose: null,
        PurposeOther: '',
        PoNo: '',
        PRNo: '',
        InvoiceNo: '',
        AirWayBillNo: '',
        itemPR: [{ PRDetail: '', JobNo: '', PRNo: '', Price: 0 }],
        PriceTotal: 0,
      },
      menuPaymentDate: false,
      itemsPayment: ['Supplier', 'Freigh'],
      itemsPurpose: [
        {
          id: 1,
          name: '1. ชำระสินค้า',
        },
        {
          id: 2,
          name: '2. ชำระค่าอากรนำเข้า',
        },
        {
          id: 3,
          name: '3. ชำระค่า Freight',
        },
        {
          id: 4,
          name: '4. ชำระค่า Clearance',
        },
        {
          id: 5,
          name: '5. อื่น ๆ',
        },
      ],
      itemsPoNo: ['PO0001', 'PO0002'],
      headers: [
        { text: 'ลำดับ', value: 'Number', width: '2%' },
        { text: 'รายละเอียด', value: 'PRDetail', width: '30%' },
        { text: 'Job No.', value: 'JobNo' },
        { text: 'PR No.', value: 'PRNo' },
        { text: 'ราคา', value: 'Price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      PurposeName: '',
      itemsUserRoles: [],
      users: {
        username: '',
        name: '',
        email: '',
        password: '',
        mobile: '',
        status: true,
        role_id: null,
      },
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
  },
  methods: {
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
      this.form = {
        PaymentDate: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        PaymentName: 'Supplier',
        PaymentTo: '',
        Purpose: null,
        PurposeOther: '',
        PoNo: '',
        PRNo: '',
        InvoiceNo: '',
        AirWayBillNo: '',
        itemPR: [],
        PriceTotal: 0,
      }
    },
    addItemPR(index) {
      this.form.itemPR.push({ PRDetail: '', JobNo: '', PRNo: '', Price: 0 })
    },
    removeItemPR(index) {
      if (this.form.itemPR.length > 0) {
        this.form.itemPR.splice(index, 1)
      }
    },
   async  save() {
      const result =await this.itemsPurpose.find( ({ id }) => id === this.form.Purpose );
      const body = {
        PaymentDate: this.form.PaymentDate,
        Status: this.form.status,
        PaymentName: this.form.PaymentName,
        PaymentTo: this.form.PaymentTo,
        PurposeId: this.form.Purpose,
        PurposeName: result.name,
        PurposeOther: this.form.PurposeOther,
        PoNo: this.form.PoNo,
        PRNo: this.form.PRNo,
        InvoiceNo: this.form.InvoiceNo,
        AirWayBillNo: this.form.AirWayBillNo,
        itemPR: JSON.stringify(this.form.itemPR),
        PriceTotal: this.form.PriceTotal,
        createBy: this.$store.getters.isName,
        updateBy: this.$store.getters.isName,
      }
      this.$emit(this.mode, body)
    },
    paymentChange(){
    this.$emit('paymentChange')
    },
    selectPurpose() {},
  },
}
</script>