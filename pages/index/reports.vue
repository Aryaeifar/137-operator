<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import useVuelidate from "@vuelidate/core";
import { numeric, minLength, helpers } from "@vuelidate/validators";
const {setBreadcrumbs } = useBreadcrumbs();

definePageMeta({
  layout: "with-sidebar",
});
import { restrictToNumber } from "@/helpers/utils";
const { t: $t } = useI18n();
const { $request, $flashMsg,  $localePath } = useNuxtApp();
const items = [
  {
    title: $t("خانه"),
    disabled: false,
    to: "/",
  },
  {
    title: $t(" گزارش ها"),
    disabled: true,
    to: "/reports",
  },
];
setBreadcrumbs(items)
const page = ref(1);
const results = ref(null);
const isLoading = ref(false);
const identifier = ref(false);
const admins = ref([]);
const departments = ref([]);
const showOrders = ref([
  {title:"جواب داده شده", value:"1"},
  {title:"جواب داده نشده", value:"0"},
]);
const filterOrders = ref([
  {title:"قدیمی ترین", value:"Oldest"},
  {title:"جدیدترین", value:"Newest"},
]);
const info = ref({
  title: null,
  desc: null,
  address: null,
  reporter: null,
  org_admin_id: null,
  org_section_id: null,
  order:null,
  answered:null
});
const state = ref({
  code: "",
});
const rules = ref({
  code: {
    minLength: helpers.withMessage("حداقل 8 کاراکتر باید ثبت کنید", minLength(8)),
    numeric: helpers.withMessage("کاراکترها باید بصورت عدد باشند", numeric),
  },
});
const v$ = useVuelidate(rules, state);
const handleCode = () => {
  state.value.code = restrictToNumber(state.value.code);
};
const { data: departmentList, error: departErr } = await $request.post("sections.get");
const { data: adminList, error: adminErr } = await $request.post("admins.get");
const filter = ref(null);
if (!departErr) {
  departments.value = departmentList.sections;
} else {
  $flashMsg.error({
    text: $t("مشکل در دریافت لیست دپارتمان ها"),
  });
}
if (!adminErr) {
  admins.value = adminList.admins;
} else {
  $flashMsg.error({
    text: $t("مشکل در دریافت لیست ادمین ها"),
  });
}
const onSubmit = () => {
  v$.value.code.$validate()
  if(v$.value.code.$error) {
    $flashMsg.error({
          text: "کد رهگیری نامعتبر است",
    });
  } else {
    isLoading.value = true;
    results.value = null;
    page.value = 1;
    filter.value = {
        title: info.value.title,
        desc: info.value.desc,
        address: info.value.address,
        reporter: info.value.reporter,
        org_admin_id: info.value?.org_admin_id?.id,
        org_section_id: info.value?.org_section_id?.id,
        code:state.value.code,
        order:info.value.order?.value,
        answered:info.value.answered?.value
    }

    identifier.value = !identifier.value
  }

};
// const newItems = ref([]);
const fetchInfiniteScroll = async ($state) => {
  const { data: newItem, error: err } = await $request.post(`report.get`, {
    body: {
      page_number: page.value,
      ...(!!filter.value ? {filter: filter.value} : {})
    }
  });

  if (!err) {
    if(results.value === null) {
      results.value = []
    }
    results.value.push(...newItem.result);
    if (newItem.page.last <= page.value) {
      $state.complete();
    } else {
      $state.loaded();
      page.value++;
    }
  } else {
    $flashMsg.error({
      text: $t("مشکل در دریافت لیست  گزارشات"),
    });
  }

  isLoading.value = false;
};

</script>
<template>
  <div class="report-page">
    <div class="search-section">
      <div class="bg-white pa-3 rounded-lg mb-3">
        <div class="search-section">
          <h3 class="mb-3">
            <v-icon color="pri" icon="fas fa-circle-info"></v-icon>
            {{ $t("مشخصات") }}
          </h3>
          <v-form class="w-100" @submit.prevent>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field class="mb-3" v-model="info.title" clearable :label="$t('عنوان')"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  class="mb-3"
                  :error-messages="v$.code.$errors.map((e) => e.$message)"
                  hide-details="auto"
                  v-model="state.code"
                  @input="handleCode"
                  maxlength="8"
                  clearable
                  :label="$t('کد رهگیری')">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="mb-3" v-model="info.desc" clearable :label="$t('متن')"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="mb-3" v-model="info.address" clearable :label="$t('نشانی')"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="mb-3" v-model="info.reporter" clearable :label="$t('گزارش دهنده')"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-locale-provider rtl>
                  <v-select
                    v-model="info.org_admin_id"
                    :label="$t('ادمین ها')"
                    class="mb-3"
                    :items="admins"
                    item-title="firstname"
                    item-value="id"
                    return-object
                    clearable
                    transition="scale-transition">
                  </v-select>
                </v-locale-provider>
              </v-col>
              <v-col cols="12" md="3">
                <v-locale-provider rtl>
                  <v-select
                    v-model="info.org_section_id"
                    :label="$t('دپارتمان')"
                    class="mb-3"
                    :items="departments"
                    item-title="name"
                    item-value="id"
                    return-object
                    clearable
                    transition="scale-transition">
                  </v-select>
                </v-locale-provider>
              </v-col>
              <v-col cols="12" md="3">
                <v-locale-provider rtl>
                  <v-select
                    v-model="info.answered"
                    :label="$t('نمایش')"
                    class="mb-3"
                    :items="showOrders"
                    item-title="title"
                    item-value="value"
                    return-object
                    clearable
                    transition="scale-transition">
                  </v-select>
                </v-locale-provider>
              </v-col>
              <v-col cols="12" md="3">
                <v-locale-provider rtl>
                  <v-select
                    v-model="info.order"
                    :label="$t('فیلتر')"
                    class="mb-3"
                    :items="filterOrders"
                    item-title="title"
                    item-value="value"
                    return-object
                    clearable
                    transition="scale-transition">
                  </v-select>
                </v-locale-provider>
              </v-col>
            </v-row>
            <v-btn block color="pri" variant="flat" size="large" :loading="isLoading || results === null" @click="onSubmit">
              {{ $t("جستجو") }}
            </v-btn>
          </v-form>
        </div>
      </div>
    </div>
    <div class="bg-white pa-3 rounded-lg mb-3">
      <div class="bg-neu rounded d-flex align-center justify-center" style="height: 30rem" v-if="results !== null && !results.length">
        <img src="@/assets/images/logo-muted.svg" alt="" />
      </div>
      <div v-else>
        <h3 class="mb-3">
          <v-icon color="pri" icon="fas fa-filter"></v-icon>
          {{ $t("نتایج") }}
        </h3>
        <v-row>
          <v-col cols="12" md="2">
            <div class="overflow-auto pe-1" style="max-height: 35rem">
              <nuxt-link :to="'/reports/' + item.id" v-for="(item, i) in results" :key="i">
                <div
                  :class="['base-border pa-3 rounded mb-3', $route.params.report_id == item.id ? 'bg-neu' : '']"
                  role="button">
                  <div class="bg-pri text-center pa-1 rounded mb-3">
                    {{ item.address }}
                  </div>
                  <div class="mb-3">
                    {{ item.title }}
                  </div>

                  <div class="truncation-clamp clamp-1 text-muted">
                    {{ item.desc }}
                  </div>
                </div>
              </nuxt-link>

              <InfiniteLoading @infinite="fetchInfiniteScroll" class="infinite-scroll" :identifier="identifier">
                <template #complete>
                  {{ results.length ? ' همه اطلاعات یافت شده' : ' نتیجه ای یافت نشد' }}
                 
                 
                </template>
              </InfiniteLoading>
            </div>
          </v-col>
          <v-col cols="12" md="10">
            <NuxtPage />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
