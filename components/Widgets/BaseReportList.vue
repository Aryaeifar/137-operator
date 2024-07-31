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
const status = ref({});
const reportStatus = ref([]);
const { data: statusGet, error: statusErr } = await $request.post("report.getStatus");
if (!statusErr) {
  status.value = statusGet.report_status;
  reportStatus.value.push(status.value);
} else if (statusErr) {
  $flashMsg.error({
    text: $t("مشکل در دریافت لیست وضعیت"),
  });
}
const isLoading = ref(false);
const problemsContent = ref(null);
const problemType = {
  Suggest: $t("پیشنهاد"),
  Problem: $t("مشکل"),
};
const sendAnswer = ref({
  answer: null,
  org_report_id: null,
});
const sendAdminAnswer = () => {
  sendAnswer.value.org_report_id = problemsContent.value.id;
  emit("sendReport", sendAnswer.value);
};
const propsPageNumber = ref(1);
const newItems = ref([]);

watch(() => props.items, (oldVal, newVal) => {
  newItems.value = props.items
})

const fetchInfiniteScroll = async ($state) => {
  const { data: newItem, error: err } = await $request.post(`report.get?page_number=${propsPageNumber.value}`);
  if (!err) {
    newItems.value.push(...newItem.result);

    if (newItem.result.length < 15) {
      $state.complete();
    } else {
      $state.loaded();
    }
    propsPageNumber.value++;
  }
};
</script>
<template>
  <div class="bg-white pa-3 rounded-lg mb-3">
    <div class="bg-neu rounded d-flex align-center justify-center" style="height: 25rem" v-if="!items.length">
      <img src="@/assets/images/logo-muted.svg" alt="" />
    </div>
    <div class="search-section" v-else>
      <h3 class="mb-3">
        <v-icon color="pri" icon="fas fa-filter"></v-icon>
        {{ $t("نتایج") }}
      </h3>
      <v-row>
        <v-col cols="12" md="2">
          <div class="overflow-auto pe-3" style="max-height: 35rem">
            <div
              :class="['base-border pa-3 rounded mb-3', problemsContent == item ? 'bg-neu ' : '']"
              role="button"
              v-for="(item, i) in newItems"
              :key="i + 1"
              @click="problemsContent = item">
              <div class="mb-3">
                {{ item.title }}
              </div>

              <div class="truncation-clamp clamp-1 text-muted">
                {{ item.desc }}
              </div>
            </div>
            <InfiniteLoading @infinite="fetchInfiniteScroll" class="infinite-scroll">
              <template #complete >
                {{ $t('نتیجه ای یافت نشد') }}
              </template>
            </InfiniteLoading>
          </div>
        </v-col>
        <v-col cols="12" md="10">
          <div class="bg-neu rounded d-flex align-center justify-center" style="height: 35rem" v-if="!problemsContent">
            <img src="@/assets/images/logo-muted.svg" alt="" />
          </div>
          <div class="bg-neu rounded h-100 pa-4 pa-lg-10" v-else>
            <h3 class="fw-light mb-5">
              {{ problemsContent.title }}
              <span class="base-border rounded-pill px-6 text-aux">{{ problemType[problemsContent.type] }}</span>
            </h3>
            <div class="text-pri mb-5">
              <v-icon color="pri" icon="fas fa-location-dot"></v-icon>
              {{ problemsContent.address }}
            </div>
            <div class="bg-white rounded pa-6 mb-3">
              <p class="" style="font-size: 14px; font-family: 'iransansNum-regular'">{{ problemsContent.desc }}</p>
            </div>
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                {{ $t("ارجاع شده به") }}
                <span class="text-comm"
                  >{{ problemsContent.admin.firstname }} {{ problemsContent.admin.lastname }}</span
                >
              </div>
              <div>
                {{ $t("وضعیت") }}: <span class="text-comm">{{ status[problemsContent.status] }}</span>
              </div>
            </div>
            <h3 class="mb-3 d-flex align-center">
              <v-icon class="me-3" color="pri" icon="fas fa-user-tie"></v-icon>
              {{ $t("شرح مسئول") }}
            </h3>
            {{ problemsContent.answers }}
            <v-textarea
              class="base-select-box mb-3"
              :label="$t('شرح مسئول')"
              variant="solo-filled"
              v-model="sendAnswer.answer"></v-textarea>
            <v-btn block color="pri" variant="flat" class="pa-6" :loading="isLoading" @click="sendAdminAnswer">
              {{ $t("ارسال") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
