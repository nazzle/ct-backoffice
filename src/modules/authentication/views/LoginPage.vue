<script setup>
// #------------- Imports Here -------------#
import logo from '@/assets/logo.png'
import useLogin from '@/composables/useLogin.js'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'


// #------------- Props / Emits -------------#

// #------------- Reactive & Refs State -------------#
const loginForm = ref(null)
const {
  loginFormObject, loading, error, submit, success, getActiveLocationsList, activeLocations
} = useLogin()


// #------------- Computed Properties -------------#

// #------------- Watchers -------------#
onMounted(() => {
  getActiveLocationsList()
})

// #------------- Functions/Methods -------------#
const submitLogin = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      submit()
      if (!success) {
        ElMessage.error(error.value)
      }
    } else {
      ElMessage.error('Username, Password and Location are required!')
    }
  })
}
</script>

<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="flex flex-col items-center mb-6">
            <div class="bg-zinc-900 rounded-full p-3 mb-4">
              <!-- Logo Placeholder -->
              <img class="w-30 h-30 mr-2" :src="logo" alt="logo">
            </div>
            <h1 class="text-2xl font-bold text-pink-500 mb-1 pt-2">Welcome to ChekiiToto - POS</h1>
            <p class="text-blue-900 text-center text-sm">Provide your credentials and sign in to continue</p>
          </div>
          <el-row :gutter="20" class="pt-5">
            <el-col :span="24">
              <el-form :model="loginFormObject" ref="loginForm" label-position="top">
                <el-form-item class="mb-6" label="Username" prop="username" required>
                  <el-input v-model="loginFormObject.username" clearable placeholder="Username" />
                </el-form-item>
                <el-form-item class="mb-6" label="Password" prop="password" required>
                  <el-input v-model="loginFormObject.password" type="password" clearable placeholder="Password" />
                </el-form-item>
                <el-form-item class="mb-6" label="Location" prop="location_id" :rules="[{ required: true, message: 'Location is required', trigger: 'blur' }]" required>
                  <el-select v-model="loginFormObject.location_id" clearable filterable placeholder="Select Location">
                    <el-option
                    v-for="(item, i) in activeLocations" :key="i" :label="item.name" :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <div v-if="error" class="text-red-600 text-center">
                  <span><small>{{error}}</small></span>
                </div>
                <el-form-item>
                  <el-button :loading="loading" :disabled="loading" type="primary" style="width: 100%" @click="submitLogin">Login</el-button>
                </el-form-item>
              </el-form>
              <el-divider />
              <p>
<!--                <small>Forgot Password?</small> <a href="#">Click here to reset</a>-->
              </p>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
