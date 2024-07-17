<template>
  <a-spin :spinning="isLoading">
    <ShDashboardFormView>
      <template #main>
        <a-card title="Đánh giá">
          <div class="flex justify-between">
            <a-input-search
              class="w-[300px]"
              placeholder="Tìm kiếm đánh giá"
              :allow-clear="true"
              @change="
                (e) => {
                  const value = e.target.value || '';
                  onChangeDebounce(value || '', () => handleChangePage(1));
                }
              "
            ></a-input-search>
            <a-button type="primary" @click="handleAddReview">Thêm đánh giá</a-button>
          </div>
          <template v-if="reviews.length > 0">
            <div class="flex flex-col space-y-3 mt-4">
              <a-row v-for="review in reviews" :key="review.id" :gutter="15">
                <a-col :span="1"><AppAvatar /> </a-col>
                <a-col :span="23">
                  <div class="flex flex-col ml-4">
                    <div class="flex justify-between">
                      <a-typography-paragraph>{{
                        profileHandleName(
                          review.model?.user?.firstname,
                          review.model?.user?.lastname
                        )
                      }}</a-typography-paragraph>
                      <a-popover :key="review.id" trigger="click">
                        <more-outlined class="text-lg" />
                        <template #content>
                          <a @click="updateReview(review.id)">Cập nhật</a>
                        </template>
                      </a-popover>
                    </div>
                    <a-rate :value="review.rate" :disabled="true"></a-rate>
                    <a-typography-text>{{ review.comment }} </a-typography-text>
                    <a-typography-text class="text-xs"
                      >{{
                        TIME_HELPER.formatDate({
                          date: dayjs(review.createdAt),
                          format: 'DD-MM-YYYY HH:mm:ss',
                        })
                      }}
                    </a-typography-text>
                  </div>
                </a-col>
              </a-row>
              <div class="flex justify-end">
                <a-pagination
                  v-if="!!meta && meta.total > 0"
                  v-model:current="meta.currentPage"
                  v-model:page-size="meta.perPage"
                  :show-less-items="true"
                  :total="meta.total"
                  size="small"
                  @change="handleChangePage"
                />
              </div>
            </div>
          </template>

          <template v-else-if="meta?.total === 0">
            <a-empty description="No reviews" />
          </template>

          <a-alert
            v-else-if="isError"
            message="Error"
            description="Cannot get review data."
            type="error"
            show-icon
          >
            <template #icon><smile-outlined /></template>
          </a-alert>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-spin>
  <a-spin :spinning="isFetchingUpdate">
    <a-modal
      title="Form review"
      :visible="openModal"
      :centered="true"
      :confirm-loading="
        updateMutation.mutation.isPending.value || createReviewMutation.isPending.value
      "
      @cancel="setFalse"
      @ok="handleOk"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item :required="true" label="Model" v-bind="modelId">
          <a-select
            v-bind="modelId"
            show-search
            placeholder="Chọn người mẫu"
            :options="listModels"
          ></a-select>
        </a-form-item>
        <a-form-item :required="true" label="Sao" v-bind="rate">
          <a-rate v-bind="rate" />
        </a-form-item>
        <a-form-item :required="true" label="Bình luận" v-bind="comment">
          <a-textarea :rows="3" v-bind="comment" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-spin>
</template>

<script setup lang="ts">
import { z } from 'zod';
import dayjs from 'dayjs';
import { AppAvatar } from '@/components/atoms';
import { ANDT_FORM_HELPER, TIME_HELPER, useBoolean } from '~/common';
import { useFormZodSchema } from '~/common/form';
import {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useMutationUpdateReview,
} from '~/features/campaign/apis/review';
import { useRouteQuery } from '~/common/hooks/route-query';
import { SelectUser } from '~/features/user/widgets';
import { ShDashboardFormView } from '~/components';
import { profileHandleName } from '~/features/profile';
import { useGetDetailReviewQuery } from '~/features/campaign/apis/review/detail';
import type { IReviewCampaign } from '~/features/campaign/models';
import { useGetAllRegisterCampaignsQuery } from '~/features/campaign/apis';

const campaignId = useRouteQuery('id');

const queryGetAllRegisterCampaignsQuery = useGetAllRegisterCampaignsQuery();

onMounted(() => {
  queryGetAllRegisterCampaignsQuery.campaignId.value = Number(campaignId.value);
});

const listModels = computed(() => {
  const data = queryGetAllRegisterCampaignsQuery.query.data.value?.data?.data || [];

  return data.map((item) => ({
    label: profileHandleName(item.model?.user?.firstname, item.model?.user?.lastname),
    value: item.modelId,
  }));
});

const {
  query: { isLoading, data, isError, refetch },
  page,
  pageSize,
  onChangeDebounce,
} = useGetAllReviewsQuery({
  defaultParams: { filter: { campaignId: Number(campaignId.value) } },
});

const visible = ref<boolean>(false);
const isFetchingUpdate = ref(false);
const { currentReviewId, query } = useGetDetailReviewQuery();
const updateMutation = useMutationUpdateReview({});

const [openModal, { setFalse, setTrue }] = useBoolean();

const handleAddReview = () => {
  currentReviewId.value = null;
  setTrue();
  resetForm({
    values: {
      modelId: {
        label: undefined,
        value: undefined,
      },
      rate: undefined,
      comment: '',
    },
  });

  isFetchingUpdate.value = false;
};

const reviewSchema = z.object({
  rate: z
    .number({
      required_error: 'Số sao là bắt buộc',
      invalid_type_error: 'Số sao là bắt buộc',
    })
    .min(1)
    .max(5),
  comment: z
    .string({
      required_error: 'Bình luận là bắt buộc',
      invalid_type_error: 'Bình luận phải là một chuỗi',
    })
    .trim()
    .min(1, 'Bình luận tối thiểu 1 ký tự'),
  modelId: z
    .object({
      label: z.string(),
      value: z
        .number({
          required_error: 'Người mẫu là bắt buộc',
          invalid_type_error: 'Người mẫu là bắt buộc',
        })
        .int()
        .positive(),
    })
    .or(z.number()),
});

type ReviewFormValuesType = z.infer<typeof reviewSchema>;

const DEFAULT_VALUE = {
  comment: '',
  rate: undefined,
  modelId: undefined,
};

const { data: reviewDetail } = query;

watch(reviewDetail, (value) => {
  const result = value?.data;

  if (!result) return;

  resetForm({
    values: convertInitial(result),
  });
  isFetchingUpdate.value = false;
});

watch(openModal, (value) => {
  if (!value) {
    currentReviewId.value = null;
    resetForm({ values: { ...DEFAULT_VALUE } });
  }
});

const initialValues = computed(() =>
  reviewDetail.value?.data ? convertInitial(reviewDetail.value?.data) : { ...DEFAULT_VALUE }
);

const form = useFormZodSchema({
  schema: reviewSchema,
  options: {
    initialValues: initialValues.value,
  },
});

const { defineComponentBinds, handleReset, handleSubmit, resetForm } = form;

const createReviewMutation = useCreateReviewMutation();

const rate = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'rate');
const comment = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'comment');
const modelId = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'modelId');

function handleChangePage(newPage: number, newPageSize?: number) {
  page.value = newPage;
  if (newPageSize) {
    pageSize.value = newPageSize;
  }
}

async function handleOk() {
  await handleSubmit(async (values) => {
    const body = handleConvertBody(values);
    if (currentReviewId.value) {
      updateMutation.mutation.mutate(
        {
          params: { id: currentReviewId.value },
          body,
        },
        {
          onSuccess() {
            refetch();
            setFalse();
            handleReset();
          },
        }
      );

      return;
    }

    createReviewMutation.mutate(
      { body },
      {
        onSuccess() {
          setFalse();
          handleReset();
        },
      }
    );
  })();
}

function handleConvertBody(body: ReviewFormValuesType) {
  const { modelId, ...rest } = body;
  const _modelId: any = modelId;

  return {
    ...rest,
    campaignId: Number(campaignId.value),
    modelId: _modelId?.value || _modelId,
  };
}

function convertInitial(data: IReviewCampaign): Partial<ReviewFormValuesType> {
  const { modelId, rate, comment } = data;

  return {
    modelId,
    rate,
    comment,
  };
}

const reviews = computed(() => data.value?.data?.data || []);
const meta = computed(() => data.value?.data?.meta);

function updateReview(id: number) {
  visible.value = false;
  isFetchingUpdate.value = true;
  currentReviewId.value = id;
  setTrue();
}
</script>
