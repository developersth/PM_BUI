<template>
   <v-dialog v-model="dialog" persistent transition="dialog-top-transition" max-width="600px">
      <v-card>
         <v-card-title>
            <span class="headline">เพิ่มข้อมูลผู้ใช้งาน</span>
         </v-card-title>
         <v-card-text>
            <v-container>
               <v-row>
                  <v-col cols="6">
                     <v-text-field
                        v-model="users.username"
                        label="ชื่อผู้ใช้งาน*"
                        required
                        />
                  </v-col>
                  <v-col cols="6">
                     <v-text-field
                        v-model="users.name"
                        label="ชื่อ-สกุล*"
                        required
                        />
                  </v-col>
               </v-row>
               <v-row>
                  <v-col cols="6">
                     <v-text-field
                        v-model="users.email"
                        label="อีเมล์*"
                        required
                        />
                  </v-col>
                  <v-col cols="6">
                     <v-text-field
                        v-model="users.mobile"
                        label="เบอร์โทร*"
                        type="number"
                        required
                        />
                  </v-col>
               </v-row>
               <small>*indicates required field</small>
            </v-container>
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn text @click="dialog = false">
               CLOSE
            </v-btn>
            <v-btn
               class="ma-2"
               :loading="loading"
               :disabled="loading"
               color="primary"
               @click="save()"
               >
               SAVE
               <v-icon
                  right
                  dark         
                  >
                  mdi-cloud-upload
               </v-icon>
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>
<script>
   export default {
     data () {
       return {
         loading: false,
         dialog: false,
         mode: '',
         users: {
           username: '',
           name: '',
           email: '',
           mobile: ''
         }
       }
     },
      watch: {
         loader () {
           const l = this.loader
           this[l] = !this[l]
   
           setTimeout(() => (this[l] = false), 3000)
   
           this.loader = null
         },
       },
     methods: {
       open (mode, data) {
         this.dialog = true
         this.mode = mode
         if (data) {
           this.users = { ...data }
         }
       },
       close () {
         this.dialog = false
         this.clearData()
       },
       clearData () {
         this.users = {
          username: '',
           name: '',
           email: '',
           mobile: ''
         }
       },
       save () {
         this.$emit(this.mode, this.users)
       }
     }
   }
</script>