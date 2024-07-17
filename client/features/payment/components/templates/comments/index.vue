<template>
  <a-comment>
    <template #avatar>
      <a-avatar :src="userAvatar" :alt="fullName" />
    </template>
    <template #content>
      <a-form-item>
        <a-textarea v-model:value="value" :rows="4" placeholder="Nhập bình luận" />
      </a-form-item>
      <a-form-item>
        <a-button
          html-type="button"
          :loading="mutationCreateInvoiceComment.isPending.value"
          :disabled="!value || mutationCreateInvoiceComment.isPending.value"
          type="primary"
          @click="handleSubmit"
        >
          Bình luận
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
  <a-list
    :footer="
      queryInvoiceComments.isLoading.value ? '' : `${metaInvoiceComments?.total || 0} bình luận`
    "
    class="comment-list"
    item-layout="horizontal"
    :data-source="dataSource"
    :loading="queryInvoiceComments.isLoading.value"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-comment
          :author="
            h(
              'span',
              {
                class: item.isMe
                  ? 'text-green-500 font-semibold'
                  : item.isAdmin
                  ? 'text-gray-500'
                  : 'text-blue-500',
              },
              item.author
            )
          "
          :avatar="h(AppAvatar, { src: item.avatar, alt: item.author })"
        >
          <template #actions>
            <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
          </template>
          <template #content>
            <p>
              {{ item.content }}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.datetime.fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>

  <div class="flex justify-end">
    <a-pagination
      v-if="!!metaInvoiceComments"
      :current="metaInvoiceComments.currentPage"
      :pageSize="metaInvoiceComments.perPage"
      :total="metaInvoiceComments.total"
      @change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import relativeTime from 'dayjs/plugin/relativeTime';

import { IMAGES_PATH } from '~/assets';
import { IMAGE_HELPER } from '~/common';
import { AppAvatar } from '~/components/atoms';
import {
  useMutationCreateInvoiceComment,
  useQueryAllInvoiceComments,
} from '~/features/payment/apis';
import type { IPayment } from '~/features/payment/models';
import { profileHandleName, useQueryProfile } from '~/features/profile';

dayjs.extend(relativeTime);

interface Props {
  payment: IPayment;
}

const props = defineProps<Props>();

const { query: queryInvoiceComments, queryParams: queryInvoiceCommentsParams } =
  useQueryAllInvoiceComments();
const mutationCreateInvoiceComment = useMutationCreateInvoiceComment();
const { data: dataQueryProfile } = useQueryProfile();
const userAvatar = computed(() => IMAGE_HELPER.getUrlImageLow(dataQueryProfile.value?.data.avatar));
const fullName = computed(() =>
  profileHandleName(dataQueryProfile.value?.data.firstname, dataQueryProfile.value?.data.lastname)
);

const value = ref('');

const onPaginationChange = (current: number, pageSize: number) => {
  const cloneQueryInvoiceCommentsParams = cloneDeep(queryInvoiceCommentsParams.value);

  cloneQueryInvoiceCommentsParams.paginate = {
    ...cloneQueryInvoiceCommentsParams.paginate,
    page: current,
    perPage: pageSize,
  };

  queryInvoiceCommentsParams.value = cloneQueryInvoiceCommentsParams;
};

const handleSubmit = () => {
  if (!value.value.trim()) {
    return;
  }

  mutationCreateInvoiceComment.mutate(
    {
      body: {
        comment: value.value.trim(),
        invoiceId: props.payment.id,
      },
    },
    {
      onSuccess: async () => {
        value.value = '';
        const cloneQueryInvoiceCommentsParams = cloneDeep(queryInvoiceCommentsParams.value);

        cloneQueryInvoiceCommentsParams.paginate = {
          ...cloneQueryInvoiceCommentsParams.paginate,
          page: 1,
        };

        onPaginationChange(1, cloneQueryInvoiceCommentsParams.paginate.perPage || 5);

        await queryInvoiceComments.refetch();
      },
    }
  );
};

const listComments = computed(() => {
  return queryInvoiceComments.data.value?.data.data || [];
});

const metaInvoiceComments = computed(() => {
  return queryInvoiceComments.data.value?.data.meta;
});

onMounted(() => {
  const cloneQueryInvoiceCommentsParams = cloneDeep(queryInvoiceCommentsParams.value);

  cloneQueryInvoiceCommentsParams.filter = {
    ...cloneQueryInvoiceCommentsParams.filter,
    invoiceId: props.payment.id,
  };

  queryInvoiceCommentsParams.value = cloneQueryInvoiceCommentsParams;
});

const dataSource = computed(() => {
  return [...listComments.value].map((item) => {
    const isAdmin = item?.user?.role === 'ADMIN';

    const getAuthor = () => {
      const name = profileHandleName(item.user.firstname, item.user.lastname);
      if (isAdmin) {
        return `${name} - (Admin)`;
      }

      return `${name} - (Người mẫu)`;
    };

    const getAvatar = () => {
      if (isAdmin && !item?.user?.avatar) {
        return IMAGES_PATH.LOGO_PINK;
      }

      return IMAGE_HELPER.getUrlImageLow(item?.user?.avatar || '');
    };

    const isMe = item.user.id === dataQueryProfile.value?.data.id;

    return {
      actions: null,
      author: getAuthor().trim(),
      avatar: getAvatar(),
      content: item.comment || '',
      datetime: dayjs(item.createdAt),
      isAdmin,
      isMe,
    };
  });
});

watch(dataSource, () => {
  console.log('dataSource', dataSource.value);
});
</script>
