<script setup>
import { onMounted, ref } from 'vue'
  import { useUser } from '@/modules/hr/composables/useUser.js'
import PageTitle from '@/components/globals/PageTitle.vue'

  // #------------- Reactive & Refs State -------------#
  const { getUserProfile, myProfile } = useUser()
  const userProfile = ref(null)

  // #------------- Watchers -------------#
  onMounted(() => {
    const userData = {
      user: localStorage.getItem('user')
    }
    userProfile.value = getUserProfile(userData)
  })
</script>

<template>
  <div class="page-container">
    <PageTitle title="My Profile" />
    <div class="grid grid-cols-3 gap-4">
      <div class="">
        <div class="w-100 h-100 border rounded-md"></div>
      </div>
      <div class="col-span-2">
        <div class="flex items-center gap-5 rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
          <div class="grid grid-cols-1 grid-rows-1">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
          </div>
          <div class="w-0 flex-1 text-sm text-gray-950 dark:text-white">
            <p class="font-medium">Username: {{myProfile?.username}}</p>
            <p class="mt-1 text-gray-500 dark:text-gray-400">Role: {{myProfile?.roles[0]?.name}}</p>
          </div>
        </div>

        <div class="p-2">
          <el-descriptions
            title="More Details"
            direction="horizontal"
            :column="1"
            size="small"
            border
          >
            <el-descriptions-item label="Employee Name">
              {{myProfile?.employee?.firstName}}
              {{myProfile?.employee?.middleName}}
              {{myProfile?.employee?.lastName}}
            </el-descriptions-item>
            <el-descriptions-item label="Phone">{{myProfile?.employee?.phone}}</el-descriptions-item>
            <el-descriptions-item label="Gender">{{myProfile?.employee?.gender}}</el-descriptions-item>
            <el-descriptions-item label="User Email">{{myProfile?.employee?.email}}</el-descriptions-item>
            <el-descriptions-item label="Employee Email">{{myProfile?.email}}</el-descriptions-item>
            <el-descriptions-item label="User Status">
              <el-tag
                :type=" myProfile?.active ? 'primary' : 'danger' " size="small">
                {{myProfile?.active ? 'Active' : 'Not Active'}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Employee Status">
              <el-tag
                :type=" myProfile?.employee?.active ? 'primary' : 'danger' " size="small">
                {{myProfile?.active ? 'Active' : 'Not Active'}}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Address">
              {{myProfile?.employee?.address}}
            </el-descriptions-item>
          </el-descriptions>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
