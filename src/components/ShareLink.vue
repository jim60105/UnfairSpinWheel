<template>
  <div
    class="shareon"
    :data-url="`${origin}?group=${encodeURIComponent(GroupLabel ?? '')}&data=${getCompressedCSV}`"
    data-hashtags="UnfairSpinWheel"
    data-text="Hey there! I just found this fun spin wheel and thought you might enjoy it too. Check it out here!"
    v-tooltip.bottom="{
      value: `Share your spin wheel with your friends!`,
      class: 'text-sm',
      escape: true
    }"
  >
    <a class="mastodon"></a>
    <a class="twitter"></a>
    <a class="facebook"></a>
    <!-- <a class="linkedin"></a> -->
    <!-- FB App ID is required for the Messenger button to function -->
    <!-- <a class="messenger" data-fb-app-id="0123456789012345"></a> -->
    <!-- <a class="odnoklassniki"></a> -->
    <!-- <a class="pinterest"></a> -->
    <a class="pocket"></a>
    <a class="reddit"></a>
    <a class="teams"></a>
    <a class="telegram"></a>
    <!-- <a class="tumblr"></a>
    <a class="viber"></a> -->
    <!-- <a class="vkontakte"></a> -->
    <!-- <a class="whatsapp"></a> -->
    <a class="copy-url"></a>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { init } from 'shareon';
import { GroupLabel, Items } from '@/services/ItemService';
import { StringHelper } from '@/helpers/StringHelper';
import type { IItem } from '@/interface/IItem';

const origin = window.location.origin;

const getCompressedCSV = ref('');

const updateShareLink = (newItems: PouchDB.Core.ExistingDocument<IItem>[] | undefined) => {
  getCompressedCSV.value = StringHelper.compress(StringHelper.csvStringify(newItems));
};

onMounted(async () => {
  watch(getCompressedCSV, init, {
    // Trigger after the DOM is updated
    // Shareon get values from data-url attribute
    flush: 'post'
  });
  watch(Items, updateShareLink);

  updateShareLink(Items.value);

  await nextTick();
  init();
});
</script>

<style scoped></style>
