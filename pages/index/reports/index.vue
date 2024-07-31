<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
const { t: $t } = useI18n();
const { $request, $flashMsg } = useNuxtApp();
const emit = defineEmits(["sendReport", "onSaved"]);
const props = defineProps({
  items: {
    type: [Array, Object],
  },
  pageNumber: {
    type: Number,
  },
});
</script>

<template>
    <div class="d-flex align-center justify-center border rounded" style="min-height: 35rem;">
      <h2 class="text-pri">{{ $t('یک گزارش را انتخاب کنید') }}</h2>
    </div>
</template>
