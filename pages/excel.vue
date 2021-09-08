<template>
  <div style="text-align: center">
    <h1>Export JSON to Excel</h1>
    <button @click="onExport">Export</button>
    <!-- เพิ่มปุ่ม Export -->
  </div>
</template>

<script>
import XLSX from 'xlsx' // import xlsx
import * as api from '~/utils/service'
export default {
  name: 'app',
  data() {
    return {
     data:[],
      // ข้อมูล JSON ทีต้องการ Export
      json: [
        {
          'PO No.': 'SPO2101-0034',
          'PR No.': 'SPR2101-0027',
          'Job No.': 'S1810-0123',
          SUPPLIER: 'FMC',
          __EMPTY: 'BCP',
          Items: 'Item 1',
          'Ship date': 'RECEIVED',
          AWB: '1972635206/03',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
          'แจ้งรับของ (เรา)': 'แจ้งแล้ว',
          พี่โจ้แจ้งรับ: 'แจ้งแล้ว',
          'T/T status': 'ทำจ่ายแล้ว',
          ค่าภาษี: 'ทำจ่ายแล้ว',
          'ค่า Freight': 'ทำจ่ายแล้ว',
        },
        {
          'PR No.': 'SPR2101-0028',
          'Job No.': 'S2101-0005',
          SUPPLIER: 'FMC',
          __EMPTY: 'PTTOR',
          Items: 'Item 2-6',
          'Ship date': 'RECEIVED',
          AWB: '1972635206/03',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
        },
        {
          'PR No.': 'SPR2101-0031',
          'Job No.': 'S2101-0006',
          SUPPLIER: 'FMC',
          __EMPTY: 'THAPP',
          Items: 'Item 7',
          'Ship date': 'RECEIVED',
          AWB: '1972635206/03',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
        },
        {
          'PO No.': 'SPO2101-0071',
          'PR No.': 'SPR2101-0064',
          'Job No.': 'S2101-0010',
          SUPPLIER: 'FMC',
          __EMPTY: 'PTG',
          Items: 'Item 1',
          'Ship date': 'RECEIVED',
          AWB: '4106219191/02',
          Freight: 'DHL',
          เลขใบขน: 'A015-0-6402-15158',
          'แจ้งรับของ (เรา)': 'แจ้งแล้ว',
          พี่โจ้แจ้งรับ: 'แจ้งแล้ว',
          'T/T status': 'ทำจ่ายแล้ว',
          ค่าภาษี: 'ทำจ่ายแล้ว',
          'ค่า Freight': 'ทำจ่ายแล้ว',
        },
        {
          'PR No.': 'SPR2101-0065',
          'Job No.': 'S2101-0011',
          SUPPLIER: 'FMC',
          __EMPTY: 'PSP',
          Items: 'Item 2',
          'Ship date': 'RECEIVED',
          AWB: '4106219191/02',
          Freight: 'DHL',
          เลขใบขน: 'A015-0-6402-15158',
        },
        {
          'PR No.': 'SPR2101-0067',
          'Job No.': 'S1810-0123',
          SUPPLIER: 'FMC',
          __EMPTY: 'BCP',
          Items: 'Item 3',
          'Ship date': 'RECEIVED',
          AWB: '4106219191/02',
          Freight: 'DHL',
          เลขใบขน: 'A015-0-6402-15158',
        },
        {
          'PR No.': 'SPR2101-0099',
          'Job No.': 'S21Z-STOCK',
          SUPPLIER: 'FMC',
          __EMPTY: 'FOR OR PROJ',
          Items: 'Item4,5 A4I and RTD INPUT',
          'Ship date': 'RECEIVED',
          AWB: '4106219191/02',
          Freight: 'DHL',
          เลขใบขน: 'A015-0-6402-15158',
        },
        {
          'PR No.': 'SPR2101-0101',
          'Job No.': 'S2101-0016',
          SUPPLIER: 'FMC',
          __EMPTY: 'THAPP',
          Items: 'Item 6 FLOAT',
          'Ship date': 'RECEIVED',
          AWB: '4106219191/02',
          Freight: 'DHL',
          เลขใบขน: 'A015-0-6402-15158',
        },
        {
          'PO No.': 'SPO2101-0102',
          'PR No.': 'SPR2101-0100',
          'Job No.': 'S21Z-STOCK',
          SUPPLIER: 'FMC',
          Items: 'ALIV-ST and ML',
          'Ship date': 'RECEIVED',
          AWB: '6009220346/02',
          Freight: 'DHL',
          เลขใบขน: 'A025-0-6402-08069',
          'แจ้งรับของ (เรา)': 'แจ้งแล้ว',
          พี่โจ้แจ้งรับ: 'แจ้งแล้ว',
          'T/T status': 'ทำจ่ายแล้ว',
          ค่าภาษี: 'ทำจ่ายแล้ว',
          'ค่า Freight': 'ทำจ่ายแล้ว',
        },
        {
          'PO No.': 'SPO2102-0014',
          'PR No.': 'SPR2102-0011',
          'Job No.': 'S2101-0023',
          SUPPLIER: 'FMC',
          __EMPTY: 'DEM',
          Items: 'Item 1',
          'Ship date': 'RECEIVED',
          AWB: '3037817193/02',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
          'แจ้งรับของ (เรา)': 'แจ้งแล้ว',
          พี่โจ้แจ้งรับ: 'แจ้งแล้ว',
          'T/T status': 'ทำจ่ายแล้ว',
          ค่าภาษี: 'ทำจ่ายแล้ว',
          'ค่า Freight': 'ทำจ่ายแล้ว',
        },
        {
          'PR No.': 'SPR2102-0033',
          'Job No.': 'S21Z-STOCK',
          SUPPLIER: 'FMC',
          Items: 'Item 2',
          'Ship date': 'RECEIVED',
          AWB: '3037817193/02',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
        },
        {
          'PR No.': 'SPR2102-0017',
          'Job No.': 'S2102-0024',
          SUPPLIER: 'FMC',
          __EMPTY: 'Tanarak',
          Items: 'Item 3',
          'Ship date': 'RECEIVED',
          AWB: '3037817193/02',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
        },
        {
          'PR No.': 'SPR2102-0021',
          'Job No.': 'S2102-0025',
          SUPPLIER: 'FMC',
          __EMPTY: 'THAPP',
          Items: 'Item 4-5',
          'Ship date': 'RECEIVED',
          AWB: '3037817193/02',
          Freight: 'DHL',
          เลขใบขน: 'ไม่ลงคลัง',
        },
      ],
    }
  },
  methods: {
    // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
   async onExport() {
      const result = await api.getDocumentExport()
      this.data =result.data
      const dataWS = XLSX.utils.json_to_sheet(this.data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, `${Date.now()}_work status.xlsx`)
    },
  },
}
</script>