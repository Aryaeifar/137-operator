<script setup>
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import useVuelidate from "@vuelidate/core";
import { required, helpers, maxLength} from "@vuelidate/validators";
const {setBreadcrumbs } = useBreadcrumbs();

definePageMeta({
  middleware: ['auth'],
  layout: "with-sidebar"
});
const { t: $t } = useI18n();
const { $request, $flashMsg } = useNuxtApp();
const mapAccessToken = "pk.eyJ1IjoiYXJmaCIsImEiOiJjbDF4NXI1a3cxd2t2M2tvZm5mN2UxNTFvIn0.HZzAuJhDmy3pwSilSaVFeg";
const state = ref({
  desc: "",
  address: "",
  type: "",
  department: "",
});
const rules = ref({
  desc: {
    required: helpers.withMessage($t("لطفا بخش گزارش  را پر کنید"), required),
    maxLength: helpers.withMessage($t("حداکثر 1000 کاراکتر میتوانید ثبت کنید"), maxLength(1000)),
  },
  address: {
    required: helpers.withMessage($t("لطفا آدرس محل مورد نظر را پر کنید"), required),
    maxLength: helpers.withMessage($t("حداکثر 150 کاراکتر میتوانید ثبت کنید"), maxLength(150)),
  },
  type: {
    required: helpers.withMessage($t("لطفا  نوع درخواست  مورد نظر را پر کنید"), required),
  },
  department: {
    required: helpers.withMessage($t("لطفا  نوع درخواست  مورد نظر را پر کنید"), required),
  },
});
const v$ = useVuelidate(rules, state);
const items = [
  {
    title: "خانه",
    disabled: false,
    to: "/",
  },
  {
    title: "ثبت گزارش",
    disabled: true,
    to: "/submit-report",
  },
]
setBreadcrumbs(items)
const infoOperatorReport = ref({
  type: null,
  org_section_id: null,
  title: null,
  desc: null,
  address: null,
  geo: null,
  first_name: null,
  last_name: null,
  mobile: null,
  email: null,
});
const mapboxRtlSupport = ref(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
);
const isLoading = ref(false);
const dialog = ref(false);
const activeType = ref(null);
const geoLng = ref(null);
const geoLat = ref(null);
const trackingCode = ref(null);
const reqType = ref([
  { label: $t("پیشنهاد"), value: "Suggest", color: "#F2A222" },
  { label: $t("مشکل"), value: "Problem", color: "#F2A222" },
]);
const activeDepartmentId = ref(null);
const orgId = ref([]);
const { data: polygonCoordinates, error: confErr } = await $request.post("config.getPolygon");
const { data: section, error: secErr } = await $request.post("sections.get");
if (!secErr) {
  orgId.value = section.sections;
 
} else if (secErr) {
  $flashMsg.error({
    text: $t("مشکل در دریافت حوزه گزارش"),
  });
}
if (confErr) {
  $flashMsg.error({
    text: $t("مشکل در دریافت مشخصات نقشه"),
  });
}

const parsePolygonPaths = (data) => {
  const array = [];
  let str = data.replace("POLYGON", "");
  str = str.replace("((", "");
  str = str.replace("))");
  const splittedArray = str.split("),(");
  splittedArray.map((ringStr) => {
    const ringArray = ringStr.split(",");
    array.push([]);
    return ringArray.map((splittedComma) => {
      const coordinate = splittedComma.split(" ");
      return array[array.length - 1].push([parseFloat(coordinate[0]), parseFloat(coordinate[1])]);
    });
  });
  return array;
};
const getPolygonCenter = (coordinates) => {
  // put all latitudes and longitudes in arrays
  const longitudes = coordinates.map((p, i) => p[1]);
  const latitudes = coordinates.map((p, i) => p[0]);

  latitudes.sort();
  longitudes.sort();
  // get the min and max of each
  const lowX = latitudes[0];
  const highX = latitudes[latitudes.length - 1];
  const lowy = longitudes[0];
  const highy = longitudes[longitudes.length - 1];

  // center of the polygon is the starting point plus the midpoint
  const centerX = lowX + (highX - lowX) / 2;
  const centerY = lowy + (highy - lowy) / 2;
  return [centerX, centerY];
};
function map() {
  const polygon = parsePolygonPaths(polygonCoordinates.polygon);
  mapboxgl.accessToken = mapAccessToken;
  if (mapboxgl.getRTLTextPluginStatus() !== "loaded") {
    {
      mapboxgl.setRTLTextPlugin(mapboxRtlSupport.value, null, true);
    }
  }
  const coordinates = document.getElementById("coordinates");
  const center = getPolygonCenter(polygon[0]);
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: center, // starting position
    zoom: 12, // starting zoom
    attributionControl: false,
  });

  map.on("load", () => {
    // Add a data source containing GeoJSON data.
    for (let i = 0; i < polygon.length; i++) {
      map.addSource("maine" + (i + 1).toString(), {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [polygon[i]],
          },
        },
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        id: "maine" + (i + 1).toString(),
        type: "fill",
        source: "maine" + (i + 1).toString(), // reference the data source
        layout: {},
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });

      // Add a black outline around the polygon.
      map.addLayer({
        id: "outline" + (i + 1).toString(),
        type: "line",
        source: "maine" + (i + 1).toString(),
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
      });
      map.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        })
      );

      
    }
  });

  const marker = new mapboxgl.Marker({
    // color: "#FFFFFF",
    draggable: true,
  })
    .setLngLat(center)
    .addTo(map);

  const LngLatChecker = (lngLat) => {
    const point = [];
    point.push(lngLat.lng, lngLat.lat);
    let checkPoint = true;
    for (let i = 0; i < polygon.length; i++) {
      // here first is lng and then lat
      let polygon2 = turf.polygon([polygon[i]]);
      // here first is lng and then lat
      checkPoint = turf.inside(point, polygon2);
      if (checkPoint) {
        break;
      }
    }
    if (!checkPoint) {
      map.flyTo({
        center: center,
      });

      marker.setLngLat(center);

      lngLat = {
        lng: center[0],
        lat: center[1],
      };
    }
    geoLng.value = lngLat.lng;
    geoLat.value = lngLat.lat;
    coordinates.style.display = "block";
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    infoOperatorReport.value.geo = {
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    };
  };

  map.on("click", (e) => {
    let lngLat = e.lngLat;
    marker.setLngLat(lngLat);
    LngLatChecker(lngLat);
  });
  


  marker.on("dragend", () => {
    let lngLat = marker.getLngLat();
    LngLatChecker(lngLat);
  });
}

onMounted(() => {
  setTimeout(() => {
    map();
  }, 500);
});
const errorMsg = {
  MOBILE_NUMBER_INVALID:"لطفا یک شماره موبایل معتبر وارد کنید",
  EMAIL_INVALID:"لطفا یک ایمیل  معتبر وارد کنید",
  TYPE_INVALID:"لطفا نوع درخواست خود را مشخص کنید",
  SECTION_ID_INVALID:"لطفا حوزه گزارش را مشخص کنید",
  DESCRIPTION_INVALID:"لطفا گزارش درخواست را پر کنید",
  ADDRESS_INVALID:"لطفا آدرس درخواست را پر کنید",
  GEO_POINT_INVALID:"لطفا آدرس دقیق را روی نقشه مشخص کنید"
}
const submitReport = async () => {
  isLoading.value = true;
    v$.value.$validate()
    .then((isValid ) => {
      if (isValid && geoLng.value) {
        $request
          .post("report.add", {
            body: {
              type: state.value.type,
              org_section_id: state.value.department,
              title: infoOperatorReport.value.title,
              desc: state.value.desc,
              address: state.value.address,
              geo: {
                longitude: geoLng.value,
                latitude: geoLat.value,
              },
              first_name: infoOperatorReport.value.first_name,
              last_name: infoOperatorReport.value.last_name,
              mobile: infoOperatorReport.value.mobile,
              email: infoOperatorReport.value.email,
            },
          })
          .then(({ data, error }) => {
            isLoading.value = false;
            if (!error) {
              isLoading.value = false;
              $flashMsg.success({
                text: $t("گزارش شما با موفقیت ثبت شد"),
              });
              dialog.value = true;
              trackingCode.value = data.code;
            } else if (error.status_code == "METHOD_INVALID") {
              $flashMsg.error({
                text: error.status_message,
              });
            } else if(error.status_code) {
              $flashMsg.error({
                text: errorMsg[error.status_code],
              });
            }
          });
      } else {
        isLoading.value = false;
        $flashMsg.error({
          text: $t("لطفا  تمام فیلد های الزامی را پر کنید"),
        });
      }
    })
    .catch((err) => {
      isLoading.value = false;
    });
  
};

</script>

<template>
  <div class="submit-report-page">
    <v-form class="w-100" @submit.prevent>
      <div class="bg-white pa-3 rounded-lg mb-3">
        <div class="report-section">
          <h3 class="mb-3">
            <v-icon color="pri" icon="fas fa-file-lines"></v-icon>
            {{ $t("گزارش") }} <span class="text-red">*</span>
          </h3>
          <v-textarea
            clear-icon="mdi-close-circle"
            v-model="state.desc"
            :error-messages="v$.desc.$errors.map((e) => e.$message)"
            hide-details="auto"
            class="form_input"
            :label="$t('گزارش')"
            maxlength="1000"
            >
          </v-textarea>
        </div>
      </div>
      <div class="bg-white pa-3 rounded-lg mb-3">
        <div class="address-section">
          <h3 class="mb-3">
            <v-icon color="pri" icon="fas fa-location-dot"></v-icon>
            {{ $t("نشانی") }} <span class="text-red">*</span>
          </h3>
          <v-text-field
            v-model="state.address"
            :error-messages="v$.address.$errors.map((e) => e.$message)"
            class="mb-3 form_input"
            clearable
            :label="$t('آدرس')"
            maxlength="150"
            ></v-text-field>
          <div>
            <div :class="['mb-3 ', geoLng ? ' text-dark' : 'text-red']" > لطفا آدرس را روی نقشه ثبت کنید</div>

            <div id="map" style="height: 400px"></div>
             <pre id="coordinates" class="coordinates text-left mt-6"></pre>
            <div id="address"></div>
          </div>
        </div>
      </div>
      <div class="bg-white pa-3 rounded-lg mb-3">
        <div class="info-section">
          <h3 class="mb-3">
            <v-icon color="pri" icon="fas fa-circle-info"></v-icon>
            {{ $t("مشخصات") }}
          </h3>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                class="mb-3"
                v-model="infoOperatorReport.first_name"
                clearable
                :label="$t('نام')"
                maxlength="70"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                class="mb-3"
                v-model="infoOperatorReport.last_name"
                clearable
                :label="$t('نام خانوادگی')"
                maxlength="70"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                class="mb-3"
                v-model="infoOperatorReport.mobile"
                clearable
                :label="$t('تلفن همراه')"
                maxlength="11"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                class="mb-3"
                v-model="infoOperatorReport.email"
                clearable
                :label="$t('ایمیل')"
                maxlength="150"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                class="mb-3"
                v-model="infoOperatorReport.title"
                clearable
                :label="$t('عنوان گزارش')"
                maxlength="150"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <div class="submit-report__request-type">
                <v-radio-group
                  :error="v$.type.$error"
                  v-model="state.type"
                  class="form_input"
                  :error-messages="v$.type.$errors.map((e) => e.$message)"
                  inline>
                  <template v-slot:label>
                    <div>{{ $t("نوع درخواست") }}:  <span  style="color: #f10;">*</span> </div>
                  </template>
                  <v-radio
                    :label="item.label"
                    :value="item.value"
                    :color="item.color"
                    @change="activeType = item.value"
                    v-for="(item, i) in reqType"
                    :key="i"></v-radio>
                </v-radio-group>
                <div class="text-red" v-if="v$.type.$error">لطفا نوع درخواست را مشخص کنید</div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="bg-white pa-3 rounded-lg mb-3">
        <div class="info-section">
          <v-row>
            <v-col cols="12">
              <h3 class="mb-3">
                <v-icon color="pri" icon="fas fa-building"></v-icon>
                {{ $t("حوزه گزارش") }} <span class="text-red">*</span>
              </h3>
              <v-radio-group
                :error="v$.department.$error"
                v-model="state.department"
                class="form_input"
                :error-messages="v$.department.$errors.map((e) => e.$message)"
                inline>
                <v-radio
                  :label="item.name"
                  :value="item.id"
                  color="#F2A222"
                  @change="activeDepartmentId = item.id"
                  class="info-section_item"
                  v-for="(item, i) in orgId"
                  :key="i"></v-radio>
              </v-radio-group>
              <div class="text-red" v-if="v$.department.$error">لطفا یکی از حوزه های مشخص شده را انتخاب کنید</div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-btn block color="pri" variant="flat" class="pa-6" :loading="isLoading" @click="submitReport()">
        {{ $t("ثبت گزارش") }}
      </v-btn>
    </v-form>

    <ModalBaseModal v-model="dialog" :isTrackingCode="true" :trackingCode="trackingCode" />
  </div>
</template>
