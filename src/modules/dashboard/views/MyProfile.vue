<script setup>

</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-8 w-full">

    <div class="flex flex-col items-center mb-6">
      <div class="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-blue-500">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop" alt="Profile Picture" class="object-cover w-full h-full">
        <div class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      <h1 class="text-3xl font-bold text-gray-800">John Doe</h1>
      <p class="text-gray-500 mt-1">Senior Product Designer</p>
    </div>

    <hr class="my-6 border-gray-200">

    <div class="grid md:grid-cols-2 gap-6 text-gray-600">
      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Employee Information</h2>
        <ul class="space-y-2">
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <a href="mailto:john.doe@example.com" class="hover:text-blue-500 transition-colors">john.doe@example.com</a>
          </li>
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2.162-2.162a1.5 1.5 0 012.126 2.126L18 10.126M10 8l2.162-2.162a1.5 1.5 0 012.126 2.126L12 10.126M13.5 15H17a1.5 1.5 0 001.5-1.5v-2a1.5 1.5 0 00-1.5-1.5h-2a1.5 1.5 0 00-1.5 1.5V13.5zM7.5 15H11a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 0011 11.5H9.5a1.5 1.5 0 00-1.5 1.5V13.5zM12 16.5H7.5a1.5 1.5 0 01-1.5-1.5V11a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5z" /></svg>
            <span>(555) 123-4567</span>
          </li>
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>New York, NY</span>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">User Information</h2>
        <ul class="space-y-2">
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <a href="mailto:john.doe@example.com" class="hover:text-blue-500 transition-colors">john.doe@example.com</a>
          </li>
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2.162-2.162a1.5 1.5 0 012.126 2.126L18 10.126M10 8l2.162-2.162a1.5 1.5 0 012.126 2.126L12 10.126M13.5 15H17a1.5 1.5 0 001.5-1.5v-2a1.5 1.5 0 00-1.5-1.5h-2a1.5 1.5 0 00-1.5 1.5V13.5zM7.5 15H11a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 0011 11.5H9.5a1.5 1.5 0 00-1.5 1.5V13.5zM12 16.5H7.5a1.5 1.5 0 01-1.5-1.5V11a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5z" /></svg>
            <span>(555) 123-4567</span>
          </li>
          <li class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>New York, NY</span>
          </li>
        </ul>
      </div>
    </div>

    <hr class="my-6 border-gray-200">

    <div>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Social Profiles</h2>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.847 4.544a.8.8 0 0 0-.8-.8H6.942a.8.8 0 0 0-.8.8v15.06a.8.8 0 0 0 .8.8h11.105a.8.8 0 0 0 .8-.8v-15.06zM7.342 4.144h10.305a.4.4 0 0 1 .4.4v15.06a.4.4 0 0 1-.4.4H7.342a.4.4 0 0 1-.4-.4v-15.06a.4.4 0 0 1 .4-.4z"/><path d="M12.445 16.963a.8.8 0 0 0-1.6 0 .4.4 0 0 1-.4.4h-.057a.8.8 0 0 0-.8.8.8.8 0 0 0 .8.8h1.257a.8.8 0 0 0 .8-.8.8.8 0 0 0-.8-.8h-.057a.4.4 0 0 1-.4-.4zM12.42 6.544a.8.8 0 0 0-.8-.8h-1.22a.8.8 0 0 0 0 1.6h1.22a.8.8 0 0 0 .8-.8z"/></svg>
        </a>
        <a href="#" class="text-gray-500 hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-3 18h-2c-1.66 0-2-1.34-2-2v-4h-2V9h2V7c0-2.21 1.79-4 4-4h2v4h-2c-.55 0-1 .45-1 1v1h3l-.43 3H16v6z"/></svg>
        </a>
        <a href="#" class="text-gray-500 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 16.732c-1.401 0-2.548-1.147-2.548-2.548s1.147-2.548 2.548-2.548 2.548 1.147 2.548 2.548-1.147 2.548-2.548 2.548zm-1.5-5.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm8.5 5.5c-1.401 0-2.548-1.147-2.548-2.548s1.147-2.548 2.548-2.548 2.548 1.147 2.548 2.548-1.147 2.548-2.548 2.548zm-1.5-5.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm1.5-2.5c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm-8.5 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"/></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
