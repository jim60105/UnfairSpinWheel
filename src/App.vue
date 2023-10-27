<template>
  <ConfirmPopup></ConfirmPopup>
  <ScrollPanel class="h-screen">
    <div class="max-w-screen overflow-x-hidden overflow-y-hidden">
      <div class="grid header text-center">
        <h1 class="col-12 mb-0 text-4xl sm:text-5xl md:text-6xl">
          Unfair <span class="white-space-nowrap">Spin Wheel</span>
        </h1>
        <p class="col-12 my-0 py-0 text-base sm:text-lg md:text-2xl">
          <span class="white-space-nowrap">The world is unfair,</span>
          &nbsp;
          <span class="white-space-nowrap">and so is our spin wheel.</span>
        </p>
      </div>
      <div class="flex flex-wrap justify-content-center mb-4">
        <SpinWheel></SpinWheel>
      </div>
    </div>
    <Footer></Footer>
  </ScrollPanel>

  <SidebarPanel></SidebarPanel>
  <Button
    severity="info"
    text
    rounded
    icon="pi pi-angle-double-left"
    aria-label="Open sidebar"
    class="overflow-visible"
    @click="sidebarService?.openSidebar"
    :pt="{
      icon: { style: { fontSize: 'xx-large' } }
    }"
  />
  <DynamicDialog />
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { SidebarService } from '@/services/SidebarService';
const sidebarService = inject<SidebarService>('SidebarService');
</script>

<style lang="scss" scoped>
.header {
  font-family: 'Rock Salt';
  -webkit-text-shadow: 9px 7px 20px #000000;
  text-shadow: 9px 7px 20px #000000;

  h1 {
    font-size: xxx-large;
  }
  p {
    font-size: large;
  }
}

@mixin afterBg {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 50%;
}

button {
  position: fixed;
  top: calc(50% - 25px);
  right: 1rem;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  z-index: 999;

  animation: shockwaveJump 2s ease-out infinite;

  &:after {
    @include afterBg;
    animation: shockwave 2s 0.65s ease-out infinite;
  }

  &:before {
    @include afterBg;
    animation: shockwave 2s 0.5s ease-out infinite;
  }
}

@keyframes shockwaveJump {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  50% {
    transform: scale(0.98);
  }
  55% {
    transform: scale(1.02);
  }
  60% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shockwave {
  0% {
    transform: scale(1);
    box-shadow:
      0 0 2px rgba(255, 255, 255, 0.15),
      inset 0 0 1px rgba(255, 255, 255, 0.15);
  }
  95% {
    box-shadow:
      0 0 50px rgba(255, 255, 255, 0),
      inset 0 0 30px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(2.25);
  }
}
</style>
