<script setup>
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
