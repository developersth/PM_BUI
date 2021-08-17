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
          <v-toolbar-title>จัดการเอกสาร #{{ mode }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              text
              :disabled="dialogLoading"
              :loading="dialogLoading"
              class="white--text"
              @click="save()"
              >Save <v-icon> mdi-content-save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <div class="text-center">
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
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            enctype="multipart/form-data"
          >
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.DocNo"
                    prepend-icon="mdi-text-box-outline"
                    :counter="20"
                    label="เลขที่เอกสาร (Auto)"
                    readonly
                    :disabled="true"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="form.DocDate"
                    label="วันที่เอกสาร"
                    prepend-icon="mdi-calendar"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <div class="text-h6 text-decoration-underline">Status</div>
                  <v-radio-group v-model="form.Status" row>
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
                      color="pink"
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
                  <div class="text-h6 text-decoration-underline">
                    Purchase Order
                  </div>
                  <v-row>
                    <v-col cols="12" lg="12">
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="form.PoNo"
                            :rules="PoNoRules"
                            prepend-icon="mdi-file-document"
                            label="เลขที่ใบสั่งซื้อ (PO)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            v-model="form.PoFile"
                            small-chips
                            prepend-icon="mdi-attachment"
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
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="itemPR.PRNo"
                            prepend-icon="mdi-file-document"
                            :rules="PRNoRules"
                            :label="`เลขที่ใบสั่งขอซื้อ (PR) #${k + 1}`"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="3">
                          <v-text-field
                            v-model="itemPR.JobNo"
                            prepend-icon="mdi-account-hard-hat"
                            :label="`เลขที่ Job #${k + 1}`"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="8" md="3">
                          <v-file-input
                            v-model="itemPR.PRFile"
                            small-chips
                            prepend-icon="mdi-attachment"
                            chips
                            :label="`
                             (PR) #${k + 1}`"
                          ></v-file-input>
                        </v-col>
                        <v-col class="d-flex" cols="4" md="2">
                          <v-btn
                            v-if="k > 0"
                            depressed
                            color="red"
                            @click="removePR(k)"
                          >
                            <v-icon> mdi-delete</v-icon>ลบ PR #{{ k + 1 }}
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
                            v-model="form.ProductValue"
                            prepend-icon="mdi-cash-100"
                            label="มูลค่าสินค้า (ทั้งหมด)"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="4" md="2">
                          <v-select
                            v-model="form.Currency"
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
                                v-model="form.Buyer"
                                :items="itemsBuyer"
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
                                v-model="form.Supplier"
                                :items="itemsSupplier"
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
                            v-model="form.Details"
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
                                v-model="form.PaymentTerm"
                                :items="itemsPaymentTerm"
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
                                v-model="form.DeliveryTerm"
                                :items="itemsDeliveryTerm"
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
                            v-model="form.Remarks"
                            label="หมายเหตุ"
                            prepend-icon="mdi-card-account-details"
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="12">
                  <div class="text-h6 text-decoration-underline">
                    From Supplier
                  </div>
                </v-col>
                <v-col cols="12" lg="12">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-file-input
                        v-model="form.OrderAckFile"
                        prepend-icon="mdi-attachment"
                        truncate-length="30"
                        label="ไฟล์แนบ Order Acknowledgement"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-menu
                        v-model="menuDeliveryDate"
                        :close-on-content-click="false"
                        max-width="290"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.DeliveryDate"
                            clearable
                            label="Delivery Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @click:clear="date = null"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.DeliveryDate"
                          @change="menuDeliveryDate = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" lg="12">
                      <v-row>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.TaxInvoiceNo"
                            prepend-icon="mdi-file-document"
                            label="Invoice No."
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-file-input
                            v-model="form.InvoiceFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (Inv)"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.PackingListNo"
                            prepend-icon="mdi-file-document"
                            label="Packing List No."
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-file-input
                            v-model="form.PackingListFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (PL)"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" md="12">
                          <div class="text-h6 text-decoration-underline">
                            From Freight forwarder
                          </div>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="4">
                          <v-select
                            v-model="form.FreightForworder"
                            :items="itemsFreightForworder"
                            label="Freight Forwarder"
                            dense
                            small-chips
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="2">
                          <v-btn depressed color="primary">
                            <v-icon> mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="4">
                          <v-text-field
                            v-model="form.BillOfLadingNo"
                            prepend-icon="mdi-file-document"
                            label="เลขที่ใบขน"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="2">
                          <v-file-input
                            v-model="form.BillOfLadingFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (เลขที่ใบขน)"
                          ></v-file-input>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="2">
                          <v-text-field
                            v-model="form.AirWayBillNo"
                            prepend-icon="mdi-file-document"
                            label="Air Waybill No."
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-file-input
                            v-model="form.AirWayBillFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (Air Waybill No)"
                          ></v-file-input>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="2">
                          <v-text-field
                            v-model="form.TaxInvoiceNo"
                            prepend-icon="mdi-file-document"
                            label="Tax Invoice No."
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-file-input
                            v-model="form.TaxInvoiceFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (Tax Invoice)"
                          ></v-file-input>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="2">
                          <v-text-field
                            v-model="form.TaxValue"
                            prepend-icon="mdi-cash-100"
                            label="มูลค่าของ Tax Inv."
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-text-field
                            v-model="form.FreightInvoiceNo"
                            prepend-icon="mdi-file-document"
                            label="Freight Invoice No."
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-file-input
                            v-model="form.FreightInvoiceFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (Freight Invoice)"
                          ></v-file-input>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-text-field
                            v-model="form.FreightInvoiceValue"
                            prepend-icon="mdi-cash-100"
                            label="มูลค่าของ Freight Inv."
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="6" md="3">
                          <v-file-input
                            v-model="form.DeliveryNoticeFile"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (แจ้งรับสินค้า)"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  data() {
    return {
      form: {
        DocNo: '',
        DocDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        Status: 'Incomplete',
        PoNo: '',
        PoFile: null,
        itemPR: [{ PRNo: '', JobNo: '', PRFile: null }],
        ProductValue: '',
        Currency: 'THB',
        Buyer: '',
        Supplier: '',
        Details: '',
        PaymentTerm: '',
        DeliveryTerm: '',
        Remarks: '',
        OrderAckFile: null,
        DeliveryDate: null,
        InvoiceNo: '',
        InvoiceFile: null,
        PackingListNo: '',
        PackingListFile: null,
        FreightForworder: '',
        BillOfLadingNo: '',
        BillOfLadingFile: null,
        AirWayBillNo: '',
        AirWayBillFile: null,
        TaxInvoiceNo: '',
        TaxInvoiceFile: null,
        TaxValue: '',
        FreightInvoiceNo: '',
        FreightInvoiceFile: null,
        FreightInvoiceValue: '',
        DeliveryNoticeFile: null,
      },
      valid: true,
      PoNoRules: [
        (v) => !!v || 'กรุณากรอก เลขที่ใบสั่งซื้อ',
        (v) =>
          (v && v.length <= 20) || 'เลขที่ใบสั่งซื้อใส่ได้เกิน 20 ตัวอักษร',
      ],
      PRNoRules: [
        (v) => !!v || 'กรุณากรอก เลขที่ใบขอซื้อ',
        (v) => (v && v.length <= 20) || 'เลขที่ใบขอซื้อใส่ได้เกิน 20 ตัวอักษร',
      ],
      dialog: false,
      dialogLoading: false,
      menu2: false,
      menuDeliveryDate: false,
      alignments: ['start', 'center', 'end'],
      currency: ['THB', 'USD', 'CNY', 'EUR'],
      items: ['Suchanya Sripumkai (Ning)', 'FMC', 'end'],
      itemsBuyer: ['Suchanya Sripumkai', 'Kritsadee'],
      itemsSupplier: ['FMC', 'Scully', 'CIRCOR', 'Chemtec', 'Alptec', 'SSRST'],
      itemsPaymentTerm: ['ชำระภายใน 30 วัน', 'ชำระภายใน 90 วัน'],
      itemsDeliveryTerm: ['ส่งของภายใน 30 วัน', 'ส่งของภายใน 90 วัน'],
      itemsFreightForworder: ['DHL', 'Penanshin', 'FedEx', 'AIL'],
      loading: false,
      mode: '',
      activePicker: null,
      date: null,
      menu: false
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
      this.form.itemPR.push({
        PRNo: '',
        JobNo: '',
        PRFile: null,
        PRFileName: '',
      })
    },
    removePR(index) {
      if (this.form.itemPR.length > 1) {
        this.form.itemPR.splice(index, 1)
      }
    },
    save(date) {
      this.$refs.menu2.save(date)
    },
    open(mode, data) {
      this.dialog = true
      this.mode = mode
      if (data) {
        this.form = { ...data }
      } else {
      }
    },
    close() {
      this.dialog = false
    },
    clearData() {
      form = {
        DocNo: '',
        DocDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        Status: 'Incomplete',
        PoNo: '',
        PoFile: null,
        itemPR: [{ PRNo: '', JobNo: '', PRFile: null, PRFileName: '' }],
        ProductValue: '',
        Currency: 'THB',
        Buyer: '',
        Supplier: '',
        Details: '',
        PaymentTerm: '',
        DeliveryTerm: '',
        Remarks: '',
        OrderAckFile: null,
        DeliveryDate: null,
        InvoiceNo: '',
        InvoiceFile: null,
        PackingListNo: '',
        PackingListFile: null,
        FreightForworder: '',
        BillOfLadingNo: '',
        BillOfLadingFile: null,
        AirWayBillNo: '',
        AirWayBillFile: null,
        TaxInvoiceNo: '',
        TaxInvoiceFile: null,
        TaxValue: '',
        FreightInvoiceNo: '',
        FreightInvoiceFile: null,
        FreightInvoiceValue: '',
        DeliveryNoticeFile: null,
      }
    },
    selectFile(){
        if (this.form.OrderAckFile) {
        let fileName='OrderAckFile-' +uuidv4() +'.' +this.form.OrderAckFile.name.split('.')[this.form.OrderAckFile.name.split('.').length - 1]
        console.log(fileName)
      }
    },
    save() {
      let fileName = ''
      let fileManage = []
      this.$refs.form.validate()
      if (!this.valid) return
      let formData = new FormData()
  
      //File Management
      if (this.form.PoFile) {
        fileName='PoFile-' +uuidv4() +'.' +this.form.PoFile.name.split('.')[this.form.PoFile.name.split('.').length - 1]
        //formData.append('PoFile',this.form.PoFile, fileName)
        fileManage.push({name: 'PoFile', filename:fileName})
        formData.append('files',this.form.PoFile, fileName)
      }
      if (this.form.OrderAckFile) {
        fileName='OrderAckFile-' +uuidv4() +'.' +this.form.OrderAckFile.name.split('.')[this.form.OrderAckFile.name.split('.').length - 1]
       // formData.append('OrderAckFile',this.form.OrderAckFile, fileName)
        formData.append('files',this.form.OrderAckFile, fileName)
        fileManage.push({name: 'OrderAckFile', filename:fileName})
      }
      if (this.form.InvoiceFile) {
        fileName='InvoiceFile-' +uuidv4() +'.' +this.form.InvoiceFile.name.split('.')[this.form.InvoiceFile.name.split('.').length - 1]
        formData.append('files',this.form.InvoiceFile, fileName)
        fileManage.push({name: 'InvoiceFile', filename:fileName})
      }
      if (this.form.PackingListFile) {
        fileName='PackingListFile-' +uuidv4() +'.' +this.form.PackingListFile.name.split('.')[this.form.PackingListFile.name.split('.').length - 1]
        formData.append('files',this.form.PackingListFile, fileName)
        fileManage.push({name: 'PackingListFile', filename:fileName})
      }
      if (this.form.BillOfLadingFile) {
        fileName='BillOfLadingFile-' +uuidv4() +'.' +this.form.BillOfLadingFile.name.split('.')[this.form.BillOfLadingFile.name.split('.').length - 1]
        formData.append('files',this.form.BillOfLadingFile, fileName)
        fileManage.push({name: 'PackingListFile', filename:fileName})
      }
      if (this.form.FreightInvoiceFile) {
        fileName='FreightInvoiceFile-' +uuidv4() +'.' +this.form.FreightInvoiceFile.name.split('.')[this.form.FreightInvoiceFile.name.split('.').length - 1]
        formData.append('files',this.form.FreightInvoiceFile, fileName)
        fileManage.push({name: 'FreightInvoiceFile', filename:fileName})
      }
      if (this.form.DeliveryNoticeFile) {
        fileName='DeliveryNoticeFile-' +uuidv4() +'.' +this.form.DeliveryNoticeFile.name.split('.')[this.form.DeliveryNoticeFile.name.split('.').length - 1]
        formData.append('files',this.form.DeliveryNoticeFile, fileName)
        fileManage.push({name: 'DeliveryNoticeFile', filename:fileName})
      } 
      let itemPR = this.form.itemPR
      let doc = 1
      for (const key in itemPR) {
        if (itemPR[key].PRFile) {
          fileName ='PR-' + uuidv4() + '-'+doc+ '.' + itemPR[key].PRFile.name.split('.')[itemPR[key].PRFile.name.split('.').length - 1]
          formData.append('files', itemPR[key].PRFile, fileName)
          itemPR[key].PRFileName = fileName
          fileManage.push({name: 'PRFile', filename:fileName})
        }
        doc++
      }
      //formData.append('itemPR', JSON.stringify(this.form.itemPR))
      formData.append('fileManage', JSON.stringify(fileManage))
      this.$emit(this.mode, formData)
    },
  },
}
</script>