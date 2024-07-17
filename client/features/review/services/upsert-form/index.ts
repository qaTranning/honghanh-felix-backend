import { z } from 'zod';
import type { LabeledValue } from 'ant-design-vue/lib/select';
import { useMutationCreateReview, useMutationUpdateReview, useQueryDetailReview } from '../../apis';
import type { IReview } from '../../models';
import { useFormZodSchema } from '~/common/form';
import { ANDT_FORM_HELPER, FORM_HELPER } from '~/common';
import { renderOptionUserLabel } from '~/features/user/utils';

const schema = z.object({
  campaign: z.array(z.custom<LabeledValue>()).length(1, 'Vui lòng chọn chiến dịch'),
  model: z.array(z.custom<LabeledValue>()).length(1, 'Vui lòng chọn người mẫu'),
  rate: z
    .number({
      required_error: 'Số sao là bắt buộc',
      invalid_type_error: 'Số sao là bắt buộc',
    })
    .min(0.5, 'Số sao tối thiểu là 1')
    .max(5, 'Số sao tối đa là 5'),
  comment: z
    .string({
      required_error: 'Bình luận là bắt buộc',
      invalid_type_error: 'Bình luận là bắt buộc',
    })
    .trim(),
  status: z.string().trim().optional(),
});

type SchemaType = z.infer<typeof schema>;

export function useUpsertFormReview() {
  const { data, currentReviewId, ...query } = useQueryDetailReview();
  const { mutate: createMutate } = useMutationCreateReview();

  const { mutate: updateMutate } = useMutationUpdateReview({});

  const initialValues = computed(() => handleInitialValues(data.value?.data));
  const form = useFormZodSchema({
    schema,
    options: {
      initialValues,
    },
  });

  const { handleSubmit, resetForm, isFieldDirty } = form;
  watch(data, () => {
    const review = data.value?.data;

    if (!review) return;
    resetForm({
      values: handleInitialValues(review),
    });
  });
  const onSubmit = handleSubmit((values) => {
    // create
    if (!currentReviewId.value) {
      const { create: campaignId } = ANDT_FORM_HELPER.handleSelectForApi({
        values: values.campaign,
      });
      const { create: modelId } = ANDT_FORM_HELPER.handleSelectForApi({
        values: values.model,
      });
      return createMutate({
        body: {
          campaignId: Number(campaignId),
          modelId: Number(modelId),
          comment: values.comment,
          rate: values.rate,
          status: values.status,
        },
      });
    }

    // update
    if (currentReviewId.value) {
      const { create: campaignId } = ANDT_FORM_HELPER.handleSelectForApi({
        defaultValues: initialValues.value.campaign,
        values: values.campaign,
      });

      const { create: modelId } = ANDT_FORM_HELPER.handleSelectForApi({
        defaultValues: initialValues.value.model,
        values: values.model,
      });

      FORM_HELPER.handlePayloadUpdateForm(values, isFieldDirty, (payload) => {
        const { model, campaign, ...tPayload } = payload;
        return updateMutate({
          body: {
            campaignId: Number(campaignId) || undefined,
            modelId: Number(modelId) || undefined,
            ...tPayload,
          },
          params: { id: currentReviewId.value || 0 },
        });
      });
    }
  });

  return { currentReviewId, onSubmit, ...form, ...query };
}

const DEFAULT_VALUE: SchemaType = {
  campaign: [],
  model: [],
  rate: 0,
  comment: '',
  status: 'INACTIVE',
};

function handleInitialValues(value?: IReview): SchemaType {
  if (!value) {
    return { ...DEFAULT_VALUE };
  }

  const { campaign, model, rate, comment, status } = value;

  return {
    rate,
    comment,
    status,
    campaign: ANDT_FORM_HELPER.handleInitialSelect(campaign),
    model: ANDT_FORM_HELPER.handleInitialSelect(model, {
      renderLabel: (d) => renderOptionUserLabel(d.user),
      renderValue: (d) => d.user.id,
    }),
  };
}

export type UseUpsertFormReviewType = ReturnType<typeof useUpsertFormReview>;
