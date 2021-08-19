<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogFile"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
          <v-card-title>ปิดหน้าต่าง
            <v-btn icon dark @click="dialogFile = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        <div style="width: 100%; height: 100vh">
          <embed
            :src="file"
            width="100%"
            height="100%"
          />
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      dialogFile: false,
      notifications: false,
      sound: true,
      widgets: false,
      file:''
    }
  },
  methods: {
    open(file) {
      this.dialogFile = true
      this.file=file
    },
  },
}
</script>
