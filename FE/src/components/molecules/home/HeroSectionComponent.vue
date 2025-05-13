<template>
  <section class="flex items-center justify-between px-24 py-20 bg-gradient-to-r from-neutral-100 to-neutral-200">
    <div class="flex-1 flex items-center justify-center">
      <div class="max-w-xl space-y-6">
        <span class="inline-block bg-white text-neutral-600 text-sm font-semibold px-4 py-1 rounded-full shadow">
          Summer Sale
        </span>
        <h1 class="text-5xl font-extrabold text-neutral-900 leading-tight">
          Save up to 70% <br /> on all products
        </h1>
        <p class="text-neutral-600 text-lg">
          Discover our latest collection with exclusive deals available only this month.
        </p>
        <div class="flex space-x-4 pt-2">
          <SubmitButton text="Shop Now" />
          <button
            class="text-neutral-800 font-semibold border border-neutral-300 px-6 py-3 rounded-lg hover:bg-neutral-300 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>

    <ImageDisplay :src="'src/assets/banner.png'" :minWidth="'70rem'" :height="'40rem'" />
  </section>
</template>

<script setup>
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import ImageDisplay from '@/components/atoms/ImageDisplayComponent.vue'
</script>
