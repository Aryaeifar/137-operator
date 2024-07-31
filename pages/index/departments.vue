<script setup>
const {setBreadcrumbs } = useBreadcrumbs();
definePageMeta({
  layout: "with-sidebar"
});
const { getSiteinfo } = useSiteinfo();
const siteInfo = ref({
  name: getSiteinfo().name,
  section_limit:getSiteinfo().section_limit
});
const { t: $t } = useI18n();
const { $request, $flashMsg} = useNuxtApp();
const items = [
  {
    title: "خانه",
    disabled: false,
    to: "/",
  },
  {
    title: "مدیریت بخش ها",
    disabled: true,
    to: "/departments",
  },
];
setBreadcrumbs(items)

const departments = ref(null)
const currentPage = ref(1)
const pageInfo = ref({
  current: null,
  last: null,
  total: null,
  limit: null,
});
const onPaginationChange = async (page) => {
  const { data: departmentList, error: departErr } = await $request.post(`sections.get`, {
    body:{
      page_number: page 
    }
  });
  if(!departErr) {
    departments.value = departmentList.sections
    console.log(departments.value)
    pageInfo.value = departmentList.page
  } else {
    $flashMsg.error({
          text: "مشکل در دریافت لیست بخش ها.",
    });
  }
  
}
onPaginationChange(1)
const addDepartment = () => {
const newDiv = { name: '', editMode: true, inputVal: '', id:'' };
  departments.value.push(newDiv); 
  
  if(departments.value.length > getSiteinfo().section_limit) {
    $flashMsg.error({
          text: `بیشتر از ${getSiteinfo().section_limit} بخش نمیتوانید اضافه کنید.`,
    });
    
  } 
};
const editDepartment = index => {
  departments.value[index].editMode = true;
  departments.value[index].inputVal = departments.value[index].name;
};
const sendDepartment = (index) => {
    departments.value[index].name = departments.value[index].inputVal;
    departments.value[index].editMode = false;
    $request.post('section.add', {
      body:{
        name:departments.value[index].name
      }
    })
    .then(({data, error}) => {
      if(!error) {
         departments.value[index].name = data.section.name
         departments.value[index].id = data.section.id
          $flashMsg.success({
          text: 'بخش جدید با موفقیت اضافه شد ',
          });
    } else if (error.status_code == 'ALREADY_EXISTS_SECTION') {
          $flashMsg.error({
            text: "این بخش قبلا ثبت شده است",
          });
    } else if (error.status_code == 'NAME_OCCUPIED') {
        $flashMsg.error({
          text: "این بخش قبلا ساخته شده است.",
        });
    }
    else if (error.status_code == 'SECTION_LIMITATION') {
        $flashMsg.error({
          text: "بیشتر از 7 بخش نمیتوانید اضافه کنید.",
        });
    }
    })
}
const updateDepartment = (index) => {
  departments.value[index].name = departments.value[index].inputVal;
  departments.value[index].editMode = false;
  $request.post('section.update', {
    body:{
      name: departments.value[index].name,
      id: departments.value[index].id,
    }
  })
  
  .then(({data, error}) => {
    if(!error) {
       departments.value[index].name = data.section.name        
    } else if (error.status_code == 'ALREADY_EXISTS_SECTION') {
          $flashMsg.error({
            text: "این بخش قبلا ثبت شده است",
          });
    } else if (error.status_code == 'NAME_OCCUPIED') {
        $flashMsg.error({
          text: "این بخش قبلا ساخته شده است.",
        });
    }
  })
}
const deleteDepartment = (index) => {
  if(departments.value[index].id) {
    $request.post('section.delete', {
    body:{
      id: departments.value[index].id,
      }
    })
    .then(({data, error}) => {
      if(!error) {
        departments.value.splice(index, 1);
      } else if(error.status_code == 'ID_INVALID') {
        $flashMsg.error({
          text: " آیدی غیرمجاز است.",
        });
      } else if(error.status_code == 'ID_INCORRECT') {
        $flashMsg.error({
          text: "آیدی اشتباه است",
        });
      } else if(error.status_code == 'ALREADY_DELETED') {
        $flashMsg.error({
          text: "بخش مورد نظر از قبل حذف شده است.",
        });
      }
    })
  } else {
    departments.value.splice(index, 1);
  }
};
const dialog = ref(false)
</script>

<template>
    <div class="departments-page">
      <div class="manage-departments">
          <h3 class="mb-3">
            <v-icon color="pri" icon="fas fa-building"></v-icon>
            {{ $t("مدیریت بخش ها") }}
          </h3>
          <div class="bg-white rounded pa-3 d-flex flex-column "  style="height: 45rem; overflow-y: hidden;">
            <div class="h-100" style="">
              <div class="d-flex justify-end">
                <v-btn append-icon="fas fa-plus"  variant="flat" class="text-pri" @click="addDepartment" >
                  اضافه کردن بخش
                </v-btn>
              </div>
              <v-row v-if="departments === null">
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-skeleton-loader type="heading"></v-skeleton-loader>
                </v-col>
              </v-row>
              <div class="d-flex flex-column justify-space-between h-100" style="overflow-y: auto;" v-else-if="departments.length > 0">
                <div class="mt-3" >
                  <v-row>
                    <v-col cols="12" md="4" v-for="(item, index) in departments.slice(0,siteInfo.section_limit)" :key="index">
                      <!-- <v-col cols="12" md="4" v-for="(item, index) in departments" :key="index"> -->
                      <v-card class="pa-3 border " variant="flat">
                        <div class="d-flex justify-space-between" v-if="!item.editMode">
                          {{ item.name }}
                          <div>
                            <v-icon icon="fas fa-pen text-sec"  class="px-4" role="button" @click="editDepartment(index)"></v-icon> 
                          </div>
                        </div>
                        <div class="d-flex justify-space-between" v-else>
                          <input type="text" placeholder="نام بخش را وارد کنید" v-model="item.inputVal" @keyup.enter="sendDepartment(index)">
                          <div>
                            <v-icon icon="fas fa-trash-can text-red" class="px-4"  role="button" @click="dialog = true"></v-icon>
                            <v-icon icon="fas fa-check text-success" class="px-4"  role="button" v-if="!item.id"  @click="sendDepartment(index)"></v-icon>
                            <v-icon icon="fas fa-pen-to-square text-info" class="px-4"  role="button" v-else @click="updateDepartment(index)"></v-icon>
                            <div class="text-center">
                              <v-dialog
                                v-model="dialog"
                                width="auto"
                              >
                                <v-card>
                                  <v-card-text>
                                    آیا مطمئنید که میخواهید بخش مورد نظر را حذف کنید؟
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-btn color="sec" @click="dialog = false">بستن</v-btn>
                                    <v-btn color="neg-acc" @click="deleteDepartment(index)">حذف</v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </div>
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-6">
                  <v-locale-provider rtl >
                      <v-pagination
                        v-model="currentPage"
                        class="my-4"
                        :length="pageInfo.last"
                        @click="onPaginationChange(currentPage)"
                        rounded="circle"
                      ></v-pagination>
                </v-locale-provider>
                </div>
              </div>
              
              <div class="text-sec text-center h-100 d-flex align-center justify-center" v-else-if="departments.length == 0 ">
                  <h2>
                    شما هنوز هیچ بخشی اضافه نکردید
                  </h2>
              </div>
             
              
           </div>
              
            
          </div>
      </div>
    </div>
</template>
