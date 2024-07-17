<!-- eslint-disable camelcase -->
<!-- eslint-disable camelcase -->
<template>
  <ShDashboardFormView>
    <template #header>
      <div class="flex justify-end"><a-button type="primary" @click="onSubmit">SAVE</a-button></div>
    </template>
    <template #main>
      <a-form layout="vertical">
        <a-card :title="t('common.bannerConfig')" :loading="query.isLoading.value">
          <a-form-item label="Banner 1" v-bind="banner_1">
            <a-input addon-before="Http://" v-bind="banner_1">
              <template #addonAfter>
                <a-button type="text" @click="() => onShowBanner(values.banner_1, 'Banner 1')">
                  <template #icon><EyeOutlined /></template>
                </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="Banner 2" v-bind="banner_2">
            <a-input v-bind="banner_2" addon-before="Http://">
              <template #addonAfter>
                <a-button type="text" @click="() => onShowBanner(values.banner_2, 'Banner 2')">
                  <template #icon><EyeOutlined /></template>
                </a-button> </template
            ></a-input>
          </a-form-item>
          <a-form-item label="Banner 3" v-bind="banner_3">
            <a-input v-bind="banner_3" addon-before="Http://">
              <template #addonAfter>
                <a-button type="text" @click="() => onShowBanner(values.banner_3, 'Banner 3')">
                  <template #icon><EyeOutlined /></template>
                </a-button> </template
            ></a-input>
          </a-form-item>
          <a-form-item label="Banner 4" v-bind="banner_4">
            <a-input v-bind="banner_4" addon-before="Http://">
              <template #addonAfter>
                <a-button type="text" @click="() => onShowBanner(values.banner_4, 'Banner 4')">
                  <template #icon><EyeOutlined /></template>
                </a-button> </template
            ></a-input>
          </a-form-item>
          <a-form-item label="Banner 5" v-bind="banner_5">
            <a-input v-bind="banner_5" addon-before="Http://">
              <template #addonAfter>
                <a-button type="text" @click="() => onShowBanner(values.banner_5, 'Banner 5')">
                  <template #icon><EyeOutlined /></template>
                </a-button> </template
            ></a-input>
          </a-form-item>
        </a-card>
      </a-form>
    </template>

    <template #side>
      <a-card v-if="showBannerUrl && showBannerName" :title="showBannerName">
        <a-image :src="showBannerUrl"></a-image>

        <template #extra>
          <a-button type="text" @click="onCloseShowBanner">
            <template #icon>
              <CloseCircleFilled />
            </template>
          </a-button>
        </template>
      </a-card>
      <a-card title="Tìm kiếm ảnh">
        <SearchLinkGallery />
      </a-card>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import { CloseCircleFilled, EyeOutlined } from '@ant-design/icons-vue';
import { useString } from '~/common';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { ShDashboardFormView } from '~/components/organisms';
import type { UseUpdateBannerFormType } from '~/features/banner/services';
import { SearchLinkGallery } from '~/features/gallery';

const { t } = useI18n();
const { form } = defineProps<{ form: UseUpdateBannerFormType }>();
const { defineComponentBinds, onSubmit, values, query } = form;

const [showBannerUrl] = useString();
const [showBannerName] = useString();

function onCloseShowBanner() {
  showBannerName.value = '';
  showBannerUrl.value = '';
}

function onShowBanner(link?: string, bannerName?: string) {
  if (link) {
    showBannerUrl.value = link;
  }
  if (bannerName) {
    showBannerName.value = bannerName;
  }
}

// eslint-disable-next-line camelcase
const banner_1 = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'banner_1');

// eslint-disable-next-line camelcase
const banner_2 = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'banner_2');

// eslint-disable-next-line camelcase
const banner_3 = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'banner_3');

// eslint-disable-next-line camelcase
const banner_4 = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'banner_4');

// eslint-disable-next-line camelcase
const banner_5 = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'banner_5');
</script>
