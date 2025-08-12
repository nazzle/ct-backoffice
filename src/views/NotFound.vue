<script setup>
import logo from '@/assets/logo.png'
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="bg-zinc-900 rounded-full p-3 mb-4">
        <!-- Logo Placeholder -->
        <img class="w-30 h-30 mr-2" :src="logo" alt="logo">
      </div>
      <h1 class="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2 text-center">Oops! Page not found</h2>
      <p class="text-gray-500 mb-8 text-center max-w-md">Sorry, the page you are looking for doesn't exist or has been moved. Let's get you back on track!</p>
      <a href="/" class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200">Go Home</a>
    </div>
  </div>
</template>

<style scoped>

</style>
