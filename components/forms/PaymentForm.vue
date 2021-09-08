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
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="save()"
      >
        <v-toolbar dark color="primary">
          <v-toolbar-title>ข้อมูล Payment #{{ mode }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
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
                  :rules="formValid.PaymentToRules"
                  :items="itemsPaymentTo"
                  :label="`${form.PaymentName} name`"
                  @change="findPoNo"
                />
              </v-col>
              <v-col cols="2" md="2">
                <v-btn depressed color="primary" @click="openPayment()">
                  <v-icon> mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :rules="formValid.PurposeRules"
                  v-model="form.Purpose"
                  :items="itemsPurpose"
                  :label="`เพื่อใช้ / Purpose for`"
                  item-value="id"
                  item-text="name"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="!form.Purpose === 5 || formValid.otherRules"
                  v-if="form.Purpose === 5"
                  v-model="form.PurposeOther"
                  label="ระบุ อื่นๆ*"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  class="mt-6"
                  :rules="formValid.PoNoRules"
                  v-model="form.PoNo"
                  :items="itemsPoNo"
                  dense
                  chips
                  small-chips
                  label="PO No."
                  @change="findDataByPoNo"
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
                      :rules="formValid.itemJobNoRules"
                      :items="itemsJobNo"
                      label="Job No."
                      @change="selectPR(item)"
                    />
                  </template>
                  <template v-slot:[`item.PRNo`]="{ item }">
                    <v-text-field v-model="item.PRNo" />
                  </template>
                  <template v-slot:[`item.Price`]="{ item }">
                    <v-text-field
                      :rules="formValid.itemPriceRules"
                      type="number"
                      v-model="item.Price"
                    />
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
              <v-col cols="9"> </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  type="number"
                  v-model="subTotal"
                  label="จำนวนเงินทั้งหมด."
                  filled
                />
              </v-col>
            </v-row>

            <small class="red--text">
              Note!! 1 ใบเบิก สามารถทำได้ 1 Invoice,1 Invoce สามารถมีได้หลาย PO
              1 PO สามารถมีได้หลาย PR,JOB
            </small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="dialog = false"> CLOSE </v-btn>
          <v-btn
            class="ma-2"
            :disabled="loading || mode === 'show'"
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
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import * as api from '~/utils/service'
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
        itemPR: [{ PRDetail: '', JobNo: '', PRNo: '', Price: '0' }],
        PriceTotal: 0,
      },
      menuPaymentDate: false,
      itemsPayment: ['Supplier', 'Freigh'],
      itemsPaymentTo: [],
      itemsPurpose: [
        {
          id: 1,
          name: 'ชำระสินค้า',
        },
        {
          id: 2,
          name: 'ชำระค่าอากรนำเข้า',
        },
        {
          id: 3,
          name: 'ชำระค่า Freight',
        },
        {
          id: 4,
          name: 'ชำระค่า Clearance',
        },
        {
          id: 5,
          name: 'อื่น ๆ',
        },
      ],
      itemsPoNo: [],
      headers: [
        { text: 'No.', value: 'Number', width: '7%' },
        { text: 'รายละเอียด', value: 'PRDetail', width: '30%' },
        { text: 'Job No.', value: 'JobNo' },
        { text: 'PR No.', value: 'PRNo' },
        { text: 'ราคา', value: 'Price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      PurposeName: '',
      itemsJobNo: [],
      itemPRlist: [],
      //Vadit
      valid: true,
      formValid: {
        PurposeRules: [(v) => !!v || 'กรุณาเลือก เพื่อใช้/Purpose for'],
        PaymentToRules: [(v) => !!v || 'กรุณาระบุ ชื่อ Supplier/Freight'],
        otherRules: [(v) => !!v || 'กรุณาระบุ อื่นๆ'],
        PoNoRules: [(v) => !!v || 'กรุณาเลือก Po No.'],
        itemJobNoRules: [(v) => !!v || 'กรุณาระบุ Job No.'],
        itemPriceRules: [(v) => !!v || 'กรุณาระบุ ราคา.'],
      },
    }
  },
  computed: {
    subTotal: function () {
      let total = 0
      for (const key in this.form.itemPR) {
        if (this.form.itemPR[key].Price)
          total += parseFloat(this.form.itemPR[key].Price)
      }
      //let parseMoney = total.toLocaleString('th', { maximumFractionDigits: 2 })
      this.form.PriceTotal = total.toString()
      return total
    },
  },
  methods: {
    open(mode, data) {
      this.dialog = true
      this.mode = mode
      this.clearData()
      if (data) {
        this.assignValue(data)
        //this.form = { ...data }
      }
    },
    assignValue(data) {
      if (data.PaymentDate)
        this.form.PaymentDate = this.$dateFns.format(
          data.PaymentDate,
          'yyyy-MM-dd'
        )
      this.form.Status = data.Status
      this.form.PaymentName = data.PaymentName
      this.paymentChange()
      this.form.PaymentTo = data.PaymentTo
      this.form.Purpose = data.PurposeId
      this.form.PurposeOther = data.PurposeOther
      this.findPoNo()
      this.form.PoNo = data.PoNo
      this.form.PRNo = data.PRNo
      this.form.InvoiceNo = data.InvoiceNo
      this.form.AirWayBillNo = data.AirWayBillNo
      if (data.itemPR) {
        this.form.itemPR = data.itemPR
      }
      this.findDataByPoNo()
      this.form.PriceTotal = data.PriceTotal
    },
    close() {
      this.dialog = false
      this.clearData()
    },
    clearData() {
      this.form = {
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
        itemPR: [{ PRDetail: '', JobNo: '', PRNo: '', Price: '0' }],
        PriceTotal: 0,
      }
    },
    addItemPR(index) {
      this.form.itemPR.push({ PRDetail: '', JobNo: '', PRNo: '', Price: '0' })
    },
    removeItemPR(index) {
      if (this.form.itemPR.length > 0) {
        this.form.itemPR.splice(index, 1)
      }
    },
    async save() {
      if (!this.$refs.form.validate()) return //chek validate
      let name = ''
      const result = await this.itemsPurpose.find(
        ({ id }) => id === this.form.Purpose
      )
      if (result) name = result.name
      var itemsPR
      if (this.form.itemPR) {
        const obj = this.form.itemPR
        for (const key in obj) {
          obj[key].PRDetail = obj[key].PRDetail.trim()
          obj[key].JobNo = obj[key].JobNo.trim()
        }
        itemsPR = JSON.stringify(obj)
      }
      const body = {
        PaymentDate: this.form.PaymentDate,
        Status: this.form.Status,
        PaymentName: this.form.PaymentName,
        PaymentTo: this.form.PaymentTo,
        PurposeId: this.form.Purpose,
        PurposeName: name,
        PurposeOther: this.form.PurposeOther,
        PoNo: this.form.PoNo,
        PRNo: this.form.PRNo,
        InvoiceNo: this.form.InvoiceNo,
        AirWayBillNo: this.form.AirWayBillNo,
        itemPR: itemsPR,
        PriceTotal: this.form.PriceTotal,
        createBy: this.$store.getters.isName,
        updateBy: this.$store.getters.isName,
      }
      this.$emit(this.mode, body)
    },
    paymentChange() {
      this.itemsPaymentTo = []
      this.form.PaymentTo = ''
      this.$emit('paymentChange', this.form.PaymentName)
    },
    async selectPR(item) {
      try {
        for (const key in this.form.itemPR) {
          if (this.form.itemPR[key].JobNo === item.JobNo) {
            for (const index in this.itemPRlist) {
              if (
                this.form.itemPR[key].JobNo === this.itemPRlist[index].JobNo
              ) {
                //console.log(this.itemPRlist[index].PRNo)
                this.form.itemPR[key].PRNo = this.itemPRlist[index].PRNo
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async findPoNo() {
      try {
        const result = await api.getPoNo(this.form.PaymentTo)
        const poList = []
        for (const key in result.data) {
          if (Object.hasOwnProperty.call(result.data, key)) {
            const element = result.data[key].PoNo
            poList.push(element)
          }
        }
        this.itemsPoNo = poList
      } catch (error) {
        console.log('error', error)
      }
    },
    async findDataByPoNo() {
      try {
        if (!this.form.PoNo) return
        const result = await api.findDataByPoNo(this.form.PoNo)
        if (result.data) {
          const PRNo = []
          const JobNo = []
          this.itemPRlist = result.data.itemPR
          if (result.data.itemPR) {
            for (const item in result.data.itemPR) {
              PRNo.push(result.data.itemPR[item].PRNo)
              JobNo.push(result.data.itemPR[item].JobNo)
            }
            this.form.PRNo = PRNo.join()
          }
          this.form.InvoiceNo = result.data.InvoiceNo
          this.form.AirWayBillNo = result.data.AirWayBillNo
          this.itemsJobNo = JobNo
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    openPayment() {
      if (this.form.PaymentName.toLowerCase() === 'supplier')
        this.$emit('openSupplier')
      else this.$emit('openFreightForwarder')
    },
  },
}
</script>