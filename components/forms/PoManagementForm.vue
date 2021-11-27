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
          <v-toolbar-title>จัดการ PO #{{ mode }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              text
              :disabled="dialogLoading || mode === 'show'"
              :loading="dialogLoading"
              class="white--text"
              @click="save()"
              >Save <v-icon> mdi-content-save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            class="mt-4"
            ref="form"
            v-model="valid"
            lazy-validation
            enctype="multipart/form-data"
            @submit.prevent="save()"
          >
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
            <ShowFileForm ref="ShowFileForm" />
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
                    :disabled="true"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <div class="text-h6 text-decoration-underline">Status</div>
                  <v-radio-group
                    v-model="form.Status"
                    row
                    :disabled="mode === 'show'"
                  >
                    <v-radio
                      outlined
                      color="secondary"
                      label="Active"
                      value="S10"
                    ></v-radio>
                    <v-radio color="primary" label="Ack" value="S20"></v-radio>
                    <v-radio color="orange" label="Delay" value="S30"></v-radio>
                    <v-radio
                      color="pink"
                      label="For Ship"
                      value="S31"
                    ></v-radio>
                    <v-radio color="red" label="Ship" value="S40"></v-radio>
                    <v-radio
                      color="secondary"
                      label="Onboard"
                      value="S50"
                    ></v-radio>
                    <v-radio
                      color="info"
                      label="received"
                      value="S60"
                    ></v-radio>
                    <v-radio
                      color="green"
                      label="Completed"
                      value="S99"
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
                            prepend-icon="mdi-receipt"
                            label="เลขที่ใบสั่งซื้อ (PO)"
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8" md="4">
                          <v-file-input
                            v-model="form.PoFile"
                            :rules="FileRules"
                            show-size
                            accept=".jpg,.jpeg,.png,.pdf"
                            small-chips
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (PO)"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="4" md="4" v-if="docsItems.PoFile">
                          <v-btn
                            class="mt-6"
                            depressed
                            small
                            color="pink"
                            @click="showFileModal(docsItems.PoFile)"
                          >
                            <v-icon> mdi-eye</v-icon>
                          </v-btn>
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
                            prepend-icon="mdi-receipt"
                            :rules="PRNoRules"
                            :label="`เลขที่ใบสั่งขอซื้อ (PR) #${k + 1}`"
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="2">
                          <v-text-field
                            v-model="itemPR.JobNo"
                            prepend-icon="mdi-file-word"
                            :label="`เลขที่ Job #${k + 1}`"
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="8" md="3">
                          <v-file-input
                            v-model="itemPR.PRFile"
                            :rules="FileRules"
                            show-size
                            accept=".jpg,.jpeg,.png,.pdf"
                            small-chips
                            prepend-icon="mdi-attachment"
                            chips
                            :label="`
                             (PR) #${k + 1}`"
                          ></v-file-input>
                          <div v-if="itemPR.PRUrl">
                            <v-btn
                              class="mt-6"
                              depressed
                              small
                              color="pink"
                              @click="showFileModal(itemPR.PRUrl)"
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                        </v-col>

                        <v-col class="d-flex" cols="4" md="3">
                          <v-btn
                            class="mt-4"
                            v-if="k > 0"
                            depressed
                            color="warning"
                            @click="removePR(k)"
                          >
                            <v-icon> mdi-delete</v-icon>ลบ PR #{{ k + 1 }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-btn depressed color="primary" @click="addPR()">
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
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="4" md="2">
                          <v-select
                            v-model="form.Currency"
                            :items="currency"
                            label="สกุลเงิน"
                            dense
                            outlined
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-row>
                            <v-col cols="10" md="10">
                              <v-autocomplete
                                class="mt-4"
                                v-model="form.Buyer"
                                :items="itemsBuyer"
                                prepend-icon="mdi-account-tie-voice"
                                outlined
                                dense
                                chips
                                small-chips
                                label="ผู้ขอซื้อ"
                                :disabled="mode === 'show'"
                                :readonly="mode === 'show'"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn
                                class="mt-4"
                                depressed
                                color="primary"
                                @click="openBuyer()"
                              >
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
                                :disabled="mode === 'show'"
                                :readonly="mode === 'show'"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn
                                depressed
                                color="primary"
                                @click="openSupplier()"
                              >
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
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                            outlined
                            dense
                          >
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" md="6">
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
                                :disabled="mode === 'show'"
                                :readonly="mode === 'show'"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn
                                depressed
                                color="info"
                                @click="openPaymentTerm()"
                              >
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
                                :disabled="mode === 'show'"
                                :readonly="mode === 'show'"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="2" md="2">
                              <v-btn
                                depressed
                                color="info"
                                @click="openDeliveryTerm()"
                              >
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
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                            outlined
                            dense
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
                    <v-col class="d-flex" cols="8" md="6">
                      <v-file-input
                        v-model="form.OrderAckFile"
                        :rules="FileRules"
                        show-size
                        accept=".jpg,.jpeg,.png,.pdf"
                        prepend-icon="mdi-attachment"
                        truncate-length="30"
                        label="ไฟล์แนบ Order Acknowledgement"
                      ></v-file-input>
                      <div v-if="docsItems.OrderAckFile">
                        <v-btn
                          class="mt-6"
                          depressed
                          small
                          color="pink"
                          @click="showFileModal(docsItems.OrderAckFile)"
                        >
                          <v-icon> mdi-eye</v-icon>
                        </v-btn>
                      </div>
                    </v-col>

                    <v-col class="d-flex" cols="12" md="6">
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
                            :disabled="mode === 'show'"
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
                        <v-col class="d-flex" cols="12" md="3">
                          <v-text-field
                            v-model="form.InvoiceNo"
                            prepend-icon="mdi-receipt"
                            label="Invoice No."
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="3">
                          <v-file-input
                            v-model="form.InvoiceFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (Inv)"
                          ></v-file-input>
                          <div v-if="docsItems.InvoiceFile">
                            <v-btn
                              class="mt-6"
                              depressed
                              small
                              color="pink"
                              @click="showFileModal(docsItems.InvoiceFile)"
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.PackingListNo"
                            prepend-icon="mdi-receipt"
                            label="Packing List No."
                            :disabled="mode === 'show'"
                            :readonly="mode === 'show'"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" md="3">
                          <v-file-input
                            v-model="form.PackingListFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            prepend-icon="mdi-attachment"
                            truncate-length="30"
                            label="ไฟล์แนบ (PL)"
                          ></v-file-input>
                          <div v-if="docsItems.PackingListFile">
                            <v-btn
                              class="mt-6"
                              depressed
                              small
                              color="pink"
                              @click="showFileModal(docsItems.PackingListFile)"
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="12">
                      <div class="text-h6 text-decoration-underline">
                        From Import
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-data-table
                        :headers="headers"
                        :items="itemsImport"
                        :hide-default-footer="true"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.Number`]="{ item }">
                          {{ itemsImport.indexOf(item) + 1 }}
                        </template>
                        <template v-slot:[`item.FreightForworder`]="{ item }">
                          <v-row>
                            <v-col class="mt-4" cols="8" md="8">
                              <v-select
                                v-model="item.FreightForworder"
                                :items="itemsFreightForworder"
                                label="Freight Forwarder"
                                dense
                                small-chips
                                outlined
                              ></v-select>
                            </v-col>
                            <v-col class="mt-4" cols="4" md="4">
                              <v-btn
                                depressed
                                color="primary"
                                @click="openFreightForwarder()"
                              >
                                <v-icon> mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:[`item.ImportDutyValue`]="{ item }">
                          <v-text-field
                            class="mt-4"
                            type="number"
                            v-model="item.ImportDutyValue"
                            outlined
                            dense
                          />
                        </template>
                        <template v-slot:[`item.BillOfLadingNo`]="{ item }">
                          <v-text-field
                            v-model="item.BillOfLadingNo"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.BillOfLadingFile`]="{ item }">
                          <v-row>
                            <v-file-input
                              v-model="item.BillOfLadingFile"
                              :rules="FileRules"
                              show-size
                              small-chips
                              accept=".jpg,.jpeg,.png,.pdf"
                              truncate-length="15"
                            ></v-file-input>
                            <div v-if="item.BillOfLadingFileURL" class="mt-4">
                              <v-btn
                                depressed
                                small
                                color="pink"
                                @click="showFileModal(item.BillOfLadingFileURL)"
                              >
                                <v-icon> mdi-eye</v-icon>
                              </v-btn>
                            </div>
                          </v-row>
                        </template>
                        <template v-slot:[`item.AirWayBillNo`]="{ item }">
                          <v-text-field
                            v-model="item.AirWayBillNo"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.AirWayBillFile`]="{ item }">
                        <v-row>
                          <v-file-input
                            v-model="item.AirWayBillFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            truncate-length="15"
                          ></v-file-input>
                          <div v-if="item.AirWayBillFileURL" class="mt-4">
                            <v-btn
                              depressed
                              small
                              color="pink"
                              @click="showFileModal(item.AirWayBillFileURL)"
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                          </v-row>
                        </template>
                        <template v-slot:[`item.TaxInvoiceNo`]="{ item }">
                          <v-text-field
                            v-model="item.TaxInvoiceNo"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.TaxInvoiceFile`]="{ item }">
                        <v-row>
                          <v-file-input
                            v-model="item.TaxInvoiceFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            truncate-length="15"
                          ></v-file-input>
                          <div v-if="item.TaxInvoiceFileURL" class="mt-4">
                            <v-btn
                              depressed
                              small
                              color="pink"
                              @click="showFileModal(item.TaxInvoiceFileURL)"
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                          </v-row>
                        </template>
                        <template v-slot:[`item.FreightInvoiceNo`]="{ item }">
                          <v-text-field
                            v-model="item.FreightInvoiceNo"
                          ></v-text-field>
                        </template>
                        <template
                          v-slot:[`item.FreightInvoiceValue`]="{ item }"
                        >
                          <v-text-field
                            class="mt-4"
                            type="number"
                            outlined
                            dense
                            v-model="item.FreightInvoiceValue"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.FreightInvoiceFile`]="{ item }">
                        <v-row>
                          <v-file-input
                            v-model="item.FreightInvoiceFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            truncate-length="15"
                          ></v-file-input>
                          <div v-if="item.FreightInvoiceFileURL" class="mt-4">
                            <v-btn
                              depressed
                              small
                              color="pink"
                              @click="
                                showFileModal(item.FreightInvoiceFileURL)
                              "
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                          </v-row>
                        </template>
                        <template v-slot:[`item.DeliveryNoticeFile`]="{ item }">
                        <v-row>
                          <v-file-input
                            v-model="item.DeliveryNoticeFile"
                            :rules="FileRules"
                            show-size
                            small-chips
                            accept=".jpg,.jpeg,.png,.pdf"
                            truncate-length="15"
                          ></v-file-input>
                          <div v-if="item.DeliveryNoticeFileURL" class="mt-4">
                            <v-btn
                              depressed
                              small
                              color="pink"
                              @click="
                                showFileModal(item.DeliveryNoticeFileURL)
                              "
                            >
                              <v-icon> mdi-eye</v-icon>
                            </v-btn>
                          </div>
                          </v-row>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-btn
                            class="mx-2"
                            fab
                            dark
                            small
                            color="red"
                            @click="removeItemImp(item)"
                          >
                            <v-icon dark> mdi-delete </v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn depressed color="green" @click="addItemImport()">
                          <v-icon> mdi-plus</v-icon>เพิ่ม Import
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                    <v-col cols="12" md="8">
                      <template>
                        <v-card>
                          <v-toolbar color="indigo" dark>
                            <v-toolbar-title>Event Log</v-toolbar-title>

                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text>
                            <v-data-table
                              :headers="HeaderEventlog"
                              :items="itemEventLog"
                              :hide-default-footer="true"
                              class="elevation-1"
                            >
                              <template v-slot:[`item.Number`]="{ item }">
                                {{ itemEventLog.indexOf(item) + 1 }}
                              </template>
                              <template v-slot:[`item.event_date`]="{ item }">
                                <v-menu
                                  v-model="menuEventDate"
                                  :close-on-content-click="false"
                                  max-width="290"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="item.event_date"
                                      clearable
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      @click:clear="date = null"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="item.event_date"
                                    @change="menuEventDate = false"
                                  ></v-date-picker>
                                </v-menu>
                              </template>
                              <template v-slot:[`item.detail`]="{ item }">
                                <v-text-field v-model="item.detail" />
                              </template>
                              <template v-slot:[`item.remarks`]="{ item }">
                                <v-text-field v-model="item.remarks" />
                              </template>
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-btn
                                  class="mx-2"
                                  fab
                                  dark
                                  small
                                  color="red"
                                  @click="removeEvent(item)"
                                >
                                  <v-icon dark> mdi-delete </v-icon>
                                </v-btn>
                              </template>
                            </v-data-table>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn depressed color="info" @click="addEvent()">
                                <v-icon> mdi-plus</v-icon>เพิ่ม Event
                              </v-btn>
                            </v-card-actions>
                          </v-card-text>
                        </v-card>
                      </template>
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
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import ShowFileForm from '~/components/forms/ShowFileForm.vue'
import * as api from '~/utils/service'
export default {
  components: { ShowFileForm },
  data() {
    return {
      headers: [
        { text: 'No.', value: 'Number', class: 'primary--text', width: '70px' },
        {
          text: 'Freight',
          value: 'FreightForworder',
          class: 'primary--text',
          width: '350px',
        },
        {
          text: 'ค่าภาษีนำเข้า/THB.',
          value: 'ImportDutyValue',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'เลขที่ใบขน.',
          value: 'BillOfLadingNo',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'ไฟล์แนบ(เลขใบขน)',
          value: 'BillOfLadingFile',
          class: 'primary--text',
          width: '200px',
        },
        {
          text: 'AirWayBillNo.',
          value: 'AirWayBillNo',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'ไฟล์แนบ(AriwayBill).',
          value: 'AirWayBillFile',
          class: 'primary--text',
          width: '200px',
        },
        {
          text: 'TaxInvoiceNo.',
          value: 'TaxInvoiceNo',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'ไฟล์แนบ(TaxInvoice).',
          value: 'TaxInvoiceFile',
          class: 'primary--text',
          width: '200px',
        },
        {
          text: 'FreightInvNo.',
          value: 'FreightInvoiceNo',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'ค่า Freight/THB.',
          value: 'FreightInvoiceValue',
          class: 'primary--text',
          width: '150px',
        },
        {
          text: 'ไฟล์แนบ(FreightInvoice).',
          value: 'FreightInvoiceFile',
          class: 'primary--text',
          width: '200px',
        },
        {
          text: 'ไฟล์แนบ(ใบแจ้งรับสินค้า).',
          value: 'DeliveryNoticeFile',
          class: 'primary--text',
          width: '200px',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          class: 'primary--text',
        },
      ],
      HeaderEventlog: [
        { text: 'No.', value: 'Number', width: '7%' },
        { text: 'Event Date', value: 'event_date', width: '15%' },
        { text: 'status', value: 'status', width: '10%' },
        { text: 'รายละเอียด.', value: 'detail', width: '25%' },
        { text: 'วันที่บันทึก', value: 'record_date', width: '15%' },
        { text: 'หมายเหตุ', value: 'remarks', width: '15%' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      form: {
        DocNo: '',
        DocDate: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        Status: 'S10',
        PoNo: '',
        itemPR: [{ PRNo: '', JobNo: '', PRFile: null, PRUrl: '' }],
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
      FileRules: [
        (v) => !v || v.size / 1024 / 1024 < 4 || 'ขนาดไฟล์ไม่เกิน 4 MB ',
      ],
      dialog: false,
      dialogLoading: false,
      menu2: false,
      menuDeliveryDate: false,
      menuEventDate: true,
      alignments: ['start', 'center', 'end'],
      currency: ['THB', 'USD', 'CNY', 'EUR'],
      docsItems: [],
      items: ['Suchanya Sripumkai (Ning)', 'FMC', 'end'],
      itemsBuyer: [],
      itemsSupplier: [],
      itemsPaymentTerm: [],
      itemsDeliveryTerm: [],
      itemsFreightForworder: [],
      itemsImport: [
        {
          FreightForworder: '',
          ImportDutyValue: 0,
          BillOfLadingNo: '',
          BillOfLadingFile: null,
          BillOfLadingFileURL: '',
          AirWayBillNo: '',
          AirWayBillFile: null,
          AirWayBillFileURL: '',
          TaxInvoiceNo: '',
          TaxInvoiceFile: null,
          FreightInvoiceNo: '',
          FreightInvoiceFile: null,
          FreightInvoiceFileURL: '',
          FreightInvoiceValue: 0,
          DeliveryNoticeFile: null,
          DeliveryNoticeFileURL: '',
        },
      ],
      itemEventLog: [],
      loading: false,
      mode: '',
      activePicker: null,
      date: null,
      menu: false,
    }
  },
  watch: {},
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
    addItemImport() {
      this.itemsImport.push({
        FreightForworder: '',
        ImportDutyValue: 0,
        BillOfLadingNo: '',
        BillOfLadingFile: null,
        AirWayBillNo: '',
        AirWayBillFile: null,
        TaxInvoiceNo: '',
        TaxInvoiceFile: null,
        FreightInvoiceNo: '',
        FreightInvoiceFile: null,
        FreightInvoiceValue: 0,
        DeliveryNoticeFile: null,
      })
    },
    removeItemImp(item) {
      const index = this.itemsImport.findIndex((v) => {
        return v === item
      })
      if (this.itemsImport.length > 0) {
        this.itemsImport.splice(index, 1)
      }
    },
    addEvent(index) {
      this.itemEventLog.push({
        pm_id: '',
        event_date: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        status: this.form.Status,
        detail: '',
        record_date: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        remarks: '',
      })
    },
    removeEvent(item) {
      const index = this.itemEventLog.findIndex((v) => {
        return v === item
      })
      if (this.itemEventLog.length > 0) {
        this.itemEventLog.splice(index, 1)
      }
    },

    save(date) {
      this.$refs.menu2.save(date)
    },
    //ShowFileForm
    showFileModal(link) {
      //this.$refs.ShowFileForm.open(file)
      try {
        window.open(link, '_blank')
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    open(mode, data) {
      this.dialog = true
      this.mode = mode
      this.clearData()
      this.getBuyers()
      this.getSupplier()
      this.getPaymentTerm()
      this.getDeliveryTerm()
      this.getFreightForwarder()
      if (data) {
        this.assignValue(data)
      }
    },
    close() {
      this.dialog = false
    },
    assignValue(data) {
      this.docsItems = data
      if (this.docsItems.DocDate)
        this.form.DocDate = this.$dateFns.format(
          this.docsItems.DocDate,
          'yyyy-MM-dd'
        )
      this.form.Status = this.docsItems.Status
      this.form.PoNo = this.docsItems.PoNo
      if (this.docsItems.itemPR) {
        this.form.itemPR = []
        for (var key in this.docsItems.itemPR) {
          this.form.itemPR.push({
            PRNo: this.docsItems.itemPR[key].PRNo,
            JobNo: this.docsItems.itemPR[key].JobNo,
            PRFile: null,
            PRFileName: this.docsItems.itemPR[key].PRFileName,
            PRUrl: this.docsItems.itemPR[key].PRFile,
          })
        }
      }
      this.form.Buyer = this.docsItems.Buyer
      this.form.Supplier = this.docsItems.Supplier
      this.form.Details = this.docsItems.Details
      this.form.PaymentTerm = this.docsItems.PaymentTerm
      this.form.DeliveryTerm = this.docsItems.DeliveryTerm
      this.form.Remarks = this.docsItems.Remarks
      this.form.DeliveryDate = this.docsItems.DeliveryDate
      if (this.docsItems.DeliveryDate)
        this.form.DeliveryDate = this.$dateFns.format(
          this.docsItems.DeliveryDate,
          'yyyy-MM-dd'
        )
      this.form.DocNo = this.docsItems.DocNo
      console.log(this.docsItems)
      if (this.docsItems.itemImport) {
        this.itemsImport = []
        for (var key in this.docsItems.itemImport) {
          this.itemsImport.push({
            FreightForworder: this.docsItems.itemImport[key].FreightForworder,
            ImportDutyValue: this.docsItems.itemImport[key].ImportDutyValue,
            BillOfLadingNo: this.docsItems.itemImport[key].BillOfLadingNo,
            BillOfLadingFile: null,
            BillOfLadingFileURL:this.docsItems.itemImport[key].BillOfLadingFile,
            AirWayBillNo: this.docsItems.itemImport[key].AirWayBillNo,
            AirWayBillFile: null,
            AirWayBillFileName:
              this.docsItems.itemImport[key].AirWayBillFileName,
            AirWayBillFileURL: this.docsItems.itemImport[key].AirWayBillFile,
            TaxInvoiceNo: this.docsItems.itemImport[key].TaxInvoiceNo,
            TaxInvoiceFile: null,
            TaxInvoiceFileURL: this.docsItems.itemImport[key].TaxInvoiceFile,
            FreightInvoiceNo: this.docsItems.itemImport[key].FreightInvoiceNo,
            FreightInvoiceFile: null,
            FreightInvoiceFileURL:
              this.docsItems.itemImport[key].FreightInvoiceFile,
            FreightInvoiceValue:
              this.docsItems.itemImport[key].FreightInvoiceValue,
            DeliveryNoticeFile: null,
            DeliveryNoticeFileURL:
              this.docsItems.itemImport[key].DeliveryNoticeFile,
          })
        }
      }
    },
    ResetForm() {
      this.$refs.form.reset()
    },
    clearData() {
      this.form = {
        DocNo: '',
        DocDate: this.$dateFns.format(Date.now(), 'yyyy-MM-dd'),
        Status: 'S10',
        PoNo: '',
        PoFile: null,
        itemPR: [],
        itemPR: [{ PRNo: '', JobNo: '', PRFile: null, PRUrl: '' }],
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
        itemsImport: [],
        itemsImport: [
          {
            FreightForworder: '',
            ImportDutyValue: 0,
            BillOfLadingNo: '',
            BillOfLadingNo: null,
            AirWayBillNo: '',
            AirWayBillFile: null,
            TaxInvoiceNo: '',
            TaxInvoiceFile: null,
            FreightInvoiceNo: '',
            FreightInvoiceFile: null,
            FreightInvoiceValue: 0,
            DeliveryNoticeFile: null,
          },
        ],
      }
    },
    selectFile() {
      if (this.form.OrderAckFile) {
        let fileName =
          'OrderAckFile-' +
          uuidv4() +
          '.' +
          this.form.OrderAckFile.name.split('.')[
            this.form.OrderAckFile.name.split('.').length - 1
          ]
      }
    },
    async getBuyers() {
      try {
        const result = await api.getBuyers()
        //console.log(result.data)
        const keys = []
        for (const key in result.data) {
          if (result.data[key].name && result.data[key].status)
            keys.push(result.data[key].name)
        }
        this.itemsBuyer = keys
      } catch (e) {
        console.log(e)
      }
    },
    async getSupplier() {
      const items = await api.getSupplier()
      var keys = []
      for (var item in items.data) {
        if (items.data[item].name && items.data[item].status)
          keys.push(items.data[item].name)
      }
      this.itemsSupplier = keys
    },
    async getPaymentTerm() {
      const items = await api.getPaymentTerm()
      var keys = []
      for (var item in items.data) {
        if (items.data[item].name && items.data[item].status)
          keys.push(items.data[item].name)
      }
      this.itemsPaymentTerm = keys
    },
    async getDeliveryTerm() {
      const items = await api.getDeliveryTermAll()
      var keys = []
      for (var item in items.data) {
        if (items.data[item].name && items.data[item].status)
          keys.push(items.data[item].name)
      }
      this.itemsDeliveryTerm = keys
    },
    async getFreightForwarder() {
      const items = await api.getFreightForwordersAll()
      var keys = []
      for (var item in items.data) {
        if (items.data[item].name && items.data[item].status)
          keys.push(items.data[item].name)
      }
      this.itemsFreightForworder = keys
    },

    save() {
      if (!this.$refs.form.validate()) return //chek validate
      let fileName = ''
      let fileManage = []
      let formData = new FormData()
      //File Management
      if (this.form.PoFile) {
        fileName =
          'PoFile-' +
          uuidv4() +
          '.' +
          this.form.PoFile.name.split('.')[
            this.form.PoFile.name.split('.').length - 1
          ]
        //formData.append('PoFile',this.form.PoFile, fileName)
        fileManage.push({ name: 'PoFile', filename: fileName })
        formData.append('files', this.form.PoFile, fileName)
      }
      if (this.form.OrderAckFile) {
        fileName =
          'OrderAckFile-' +
          uuidv4() +
          '.' +
          this.form.OrderAckFile.name.split('.')[
            this.form.OrderAckFile.name.split('.').length - 1
          ]
        // formData.append('OrderAckFile',this.form.OrderAckFile, fileName)
        formData.append('files', this.form.OrderAckFile, fileName)
        fileManage.push({ name: 'OrderAckFile', filename: fileName })
      }
      if (this.form.InvoiceFile) {
        fileName =
          'InvoiceFile-' +
          uuidv4() +
          '.' +
          this.form.InvoiceFile.name.split('.')[
            this.form.InvoiceFile.name.split('.').length - 1
          ]
        formData.append('files', this.form.InvoiceFile, fileName)
        fileManage.push({ name: 'InvoiceFile', filename: fileName })
      }
      if (this.form.PackingListFile) {
        fileName =
          'PackingListFile-' +
          uuidv4() +
          '.' +
          this.form.PackingListFile.name.split('.')[
            this.form.PackingListFile.name.split('.').length - 1
          ]
        formData.append('files', this.form.PackingListFile, fileName)
        fileManage.push({ name: 'PackingListFile', filename: fileName })
      }

      let itemPR = this.form.itemPR
      let doc = 1
      for (const key in itemPR) {
        if (itemPR[key].PRFile) {
          fileName =
            'PR-' +
            uuidv4() +
            '-' +
            doc +
            '.' +
            itemPR[key].PRFile.name.split('.')[
              itemPR[key].PRFile.name.split('.').length - 1
            ]
          formData.append('files', itemPR[key].PRFile, fileName)
          itemPR[key].PRFileName = fileName
          fileManage.push({ name: 'PRFile', filename: fileName })
        }
        this.form.itemPR[key].PRNo = this.form.itemPR[key].PRNo.trim()
        this.form.itemPR[key].JobNo = this.form.itemPR[key].JobNo.trim()
        doc++
      }
      let itemImp = this.itemsImport
      doc = 1
      for (const key in itemImp) {
        if (itemImp[key].BillOfLadingFile) {
          fileName = `BillOfLadingFile-${uuidv4()}-${doc}.${
            itemImp[key].BillOfLadingFile.name.split('.')[
              itemImp[key].BillOfLadingFile.name.split('.').length - 1
            ]
          }`
          itemImp[key].BillOfLadingFileName = fileName
          formData.append('files', itemImp[key].BillOfLadingFile, fileName)
          fileManage.push({ name: 'BillOfLadingFile', filename: fileName })
        }
        if (itemImp[key].AirWayBillFile) {
          fileName = `AirWayBillFile-${uuidv4()}-${doc}.${
            itemImp[key].AirWayBillFile.name.split('.')[
              itemImp[key].AirWayBillFile.name.split('.').length - 1
            ]
          }`
          itemImp[key].AirWayBillFileName = fileName
          formData.append('files', itemImp[key].AirWayBillFile, fileName)
          fileManage.push({ name: 'AirWayBillFile', filename: fileName })
        }
        if (itemImp[key].TaxInvoiceFile) {
          fileName = `TaxInvoiceFile-${uuidv4()}-${doc}.${
            itemImp[key].TaxInvoiceFile.name.split('.')[
              itemImp[key].TaxInvoiceFile.name.split('.').length - 1
            ]
          }`
          itemImp[key].TaxInvoiceFileName = fileName
          formData.append('files', itemImp[key].TaxInvoiceFile, fileName)
          fileManage.push({ name: 'TaxInvoiceFile', filename: fileName })
        }
        if (itemImp[key].FreightInvoiceFile) {
          fileName = `FreightInvoiceFile-${uuidv4()}-${doc}.${
            itemImp[key].FreightInvoiceFile.name.split('.')[
              itemImp[key].FreightInvoiceFile.name.split('.').length - 1
            ]
          }`
          itemImp[key].FreightInvoiceFileName = fileName
          formData.append('files', itemImp[key].FreightInvoiceFile, fileName)
          fileManage.push({ name: 'FreightInvoiceFile', filename: fileName })
        }
        if (itemImp[key].DeliveryNoticeFile) {
          fileName = `DeliveryNoticeFile-${uuidv4()}-${doc}.${
            itemImp[key].DeliveryNoticeFile.name.split('.')[
              itemImp[key].DeliveryNoticeFile.name.split('.').length - 1
            ]
          }`
          itemImp[key].DeliveryNoticeFileName = fileName
          formData.append('files', itemImp[key].DeliveryNoticeFile, fileName)
          fileManage.push({ name: 'DeliveryNoticeFile', filename: fileName })
        }
        doc++
      }
      //Data
      formData.append('DocNo', this.form.DocNo)
      formData.append('DocDate', this.form.DocDate)
      formData.append('Status', this.form.Status)
      formData.append('PoNo', this.form.PoNo.trim())
      formData.append('ProductValue', this.form.ProductValue.trim())
      formData.append('Currency', this.form.Currency.trim())
      formData.append('Buyer', this.form.Buyer.trim())
      formData.append('Supplier', this.form.Supplier.trim())
      formData.append('Details', this.form.Details.trim())
      formData.append('PaymentTerm', this.form.PaymentTerm.trim())
      formData.append('DeliveryTerm', this.form.DeliveryTerm.trim())
      formData.append('Remarks', this.form.Remarks.trim())
      formData.append('DeliveryDate', this.form.DeliveryDate)
      formData.append('InvoiceNo', this.form.InvoiceNo.trim())
      formData.append('PackingListNo', this.form.PackingListNo.trim())
      formData.append('itemPR', JSON.stringify(this.form.itemPR))
      formData.append('fileManage', JSON.stringify(fileManage))
      formData.append('itemImport', JSON.stringify(this.itemsImport))
      formData.append('updateBy', this.$store.getters.isName)
      this.$emit(this.mode, formData)
    },
    //UserForm
    submitAddUsers() {
      this.$emit('add', this.users)
    },
    //suppplier
    openSupplier() {
      //สั่ง เปิด Modal  form addSupplier
      this.$emit('openSupplier')
    },
    //payment term
    openPaymentTerm() {
      this.$emit('openPaymentTerm')
    },
    openBuyer() {
      this.$emit('openBuyer')
    },
    openDeliveryTerm() {
      this.$emit('openDeliveryTerm')
    },
    openFreightForwarder() {
      this.$emit('openFreightForwarder')
    },
  },
}
</script>