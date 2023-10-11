<template>
  <div class="header grid">
    <h1 class="flex col-12 justify-content-center align-items-center mb-0">Unfair Spin Wheel</h1>
    <p class="flex col-12 justify-content-center align-items-center mt-0">
      The world is unfair, and so is our spin wheel.
    </p>
  </div>
  <div class="container mx-auto grid justify-content-center align-items-start mt-3">
    <div class="spin-container flex md:col-6 sm:col-12">
      <SpinWheel v-model:items="items" v-model:change="$change"></SpinWheel>
    </div>
    <div class="grid md:col-6 sm:col-12">
      <ItemInputGroup
        :class="['col-12']"
        v-for="(item, index) in items"
        :key="index"
        :modelValue="item"
        @update:label="updateItem({ label: $event, weight: item.weight }, index)"
        @update:weight="updateItem({ label: item.label, weight: $event }, index)"
      ></ItemInputGroup>
      <div class="p-inputgroup col-12">
        <Button
          ref="addButton"
          class="w-full"
          icon="pi pi-plus"
          aria-label="Add item"
          @click="addItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemInputGroup from '@/components/ItemInputGroup.vue';
import { Subject } from 'rxjs';
import type { IItem } from '@/models/Item';
import { ref, type Ref } from 'vue';

const items: Ref<IItem[]> = ref([
  {
    label: 'Jim',
    weight: 5
  },
  {
    label: 'John',
    weight: 1
  },
  {
    label: 'Will',
    weight: 10
  },
  {
    label: 'Mark',
    weight: 1
  },
  {
    label: 'Emily',
    weight: 7
  },
  {
    label: 'Sarah',
    weight: 3
  },
  {
    label: 'David',
    weight: 2
  },
  {
    label: 'Michael',
    weight: 1
  },
  {
    label: 'Jessica',
    weight: 3
  }
]);

const $change = new Subject<IItem>();
const addButton = ref();

function updateItem(item: IItem, index: number) {
  items.value[index].label = item.label;
  items.value[index].weight = item.weight;
  $change.next(items.value[index]);
}

function addItem() {
  items.value.push({
    label: 'New Item',
    weight: 1
  });
  $change.next(items.value[items.value.length - 1]);
  setTimeout(() => {
    addButton.value.$el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}
</script>

<style>
.container {
  max-width: 80vw;
}
.spin-container {
  min-height: 75vh;
}
</style>
