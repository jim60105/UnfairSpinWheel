<template>
  <ConfirmPopup></ConfirmPopup>
  <ScrollPanel class="h-screen">
    <div class="">
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
      <div class="flex flex-wrap justify-content-center">
        <SpinWheel></SpinWheel>
      </div>
    </div>
  </ScrollPanel>

  <SidebarPanel></SidebarPanel>
  <DynamicDialog />
</template>

<script setup lang="ts"></script>

<style lang="scss">
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
</style>
