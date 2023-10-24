<template>
  <ConfirmPopup></ConfirmPopup>
  <DynamicDialog />
  <ScrollPanel class="h-screen">
    <div class="header grid">
      <h1 class="flex col-12 justify-content-center align-items-center mb-0">Unfair Spin Wheel</h1>
      <p class="flex col-12 justify-content-center align-items-center my-0 py-0">
        The world is unfair, and so is our spin wheel.
      </p>
    </div>
    <div class="flex flex-wrap justify-content-center align-items-start">
      <SpinWheel></SpinWheel>
    </div>
  </ScrollPanel>

  <SidebarPanel></SidebarPanel>
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
