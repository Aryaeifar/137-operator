<script setup>
import useVuelidate from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
const { $request, $flashMsg } = useNuxtApp();
const emit = defineEmits(['update:status'])
const { t: $t } = useI18n();
const props = defineProps({
  value: {
    type: Boolean,
  },
  report: {
    type: Object,
  },
  status: {
    type: Object,
  },
});
const state = ref({
  status: props.report.status,
});
const rules = ref({
  status: {
    required: helpers.withMessage($t("لطفا  ابتدا وضعیت  گزارش مورد نظر را انتخاب کنید"), required),
  },
});
const v$ = useVuelidate(rules, state);
const statusList = computed(() => Object.keys(props.status).map((key) => ({
    status: key, text: props.status[key]
})));
const sendStatus = () => {
  v$.value.status.$validate()
    .then((isValid) => {
      if (isValid) {
        $request
          .post("report.setStatus", {
            body: {
              id: props.report.id,
              status: state.value.status,
            },
          })
          .then(({ data, error }) => {
            if (!error) {
              $flashMsg.success({
                text: $t("وضعیت گزارش با موفقیت ارسال شد"),
              });
              emit('update:status', state.value.status)
              emit('update:modelValue', false)
            } else {
              $flashMsg.error({
                text: $t("خطا در ارسال وضعیت"),
              });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card class="pa-4 rounded-lg">
      <div class="bg-white rounded-lg">
        <div class="info-section">
          <h3 class="mb-3">
            {{ $t(" وضعیت") }}
          </h3>
          <v-radio-group
            class="form_input"
            :error="v$.status.$error"
            v-model="state.status"
            :error-messages="v$.status.$errors.map((e) => e.$message)"
            >
            <v-radio
              :label="item.text"
              :value="item.status"
              color="#F2A222"
              @change="activeStatus = item.status"
              class="info-section_item"
              v-for="(item, i) in statusList"
              :key="i"></v-radio>
          </v-radio-group>
        </div>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="$emit('update:modelValue',false)"> بازگشت </v-btn>
        <v-btn color="pri" variant="text" @click="sendStatus"> ارسال وضعیت </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
