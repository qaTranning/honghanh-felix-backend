import dayjs, { Dayjs } from 'dayjs';
import {
  useCreateCampaignMutation,
  useGetDetailCampaignQuery,
  useUpdateCampaignMutation,
} from '../../apis';
import type { ICampaign } from '../../models';
import { campaignSchemaValidation, type CampaignSchemaValidationType } from './validations';
import { useFormZodSchema } from '~/common/form';
import { ANDT_FORM_HELPER, TIME_HELPER } from '~/common';

export function useUpsertFormCampaign() {
  const updateCampaignMutation = useUpdateCampaignMutation();

  const createCampaignMutation = useCreateCampaignMutation();

  const { query, currentCampaignId } = useGetDetailCampaignQuery();

  const { data } = query;

  const form = useFormZodSchema({
    schema: campaignSchemaValidation,
    options: {
      initialValues: handleConvertInitialValues(undefined),
    },
  });

  const { handleSubmit, resetForm, handleReset } = form;

  watch(data, () => {
    const campaign = data?.value?.data;

    if (!campaign) return;
    const values = handleConvertInitialValues(campaign);
    resetForm({
      values,
    });
  });

  function handleConvertBody(values: CampaignSchemaValidationType) {
    const {
      categoryIds,
      thumbnail,
      brand,
      castingTime,
      fitingTime,
      workingTime,
      workHours,
      brandName,
      ...rest
    } = values;

    const { uploadImage: uploadThumbnail, deleteImage: deleteThumbnail } =
      ANDT_FORM_HELPER.handleImageForApi({
        listImageForm: thumbnail || [],
        defaultValue: data?.value?.data?.thumbnail || undefined,
      });

    const oldCategoryIds = data?.value?.data?.categories || [];

    const createCategoryIds = categoryIds
      .filter((cate) => oldCategoryIds.every((oldCate) => oldCate.category.id !== cate.value))
      .map((v) => v.value);

    const deleteCategoryIds = oldCategoryIds
      .filter((oldCate) => categoryIds.every((cate) => cate.value !== oldCate.category.id))
      .map((v) => v.categoryId);

    const valuesCategoryIds = currentCampaignId.value
      ? {
          createCategoryIds,
          deleteCategoryIds,
        }
      : {
          categoryIds: categoryIds.map((v) => v.value),
        };

    const { create, remove } = ANDT_FORM_HELPER.handleSelectForApi({
      values: brand,
      defaultValues: handleConvertInitialValues(data?.value?.data).brand,
    });

    const body = {
      ...rest,
      brandId: create ? Number(create) : undefined,
      thumbnail: uploadThumbnail || undefined,
      startDate: castingTime.toDate(),
      // startFittingDate: fitingTime[0].toDate(),
      // endFittingDate: fitingTime[1].toDate(),
      startWorkingDate: workingTime[0].toDate(),
      endWorkingDate: workingTime[1].toDate(),
      workHours,
      deleteThumbnail,
      status: undefined,
      removeBrand: remove ? true : undefined,
      ...valuesCategoryIds,
      brandName: brandName || undefined,
    };

    return body;
  }

  const onSubmit = handleSubmit((values) => {
    const campaignId = currentCampaignId.value;

    const body = handleConvertBody(values);

    // update
    if (campaignId) {
      updateCampaignMutation.mutate(
        {
          campaignId: +campaignId,
          body,
        },

        {
          async onSuccess() {
            // await navigateTo({
            //   name: 'data-campaign',
            // });
          },
        }
      );

      return;
    }

    // create
    createCampaignMutation.mutate(
      {
        body,
      },
      {
        async onSuccess(res) {
          await navigateTo({
            name: 'data-campaign-detail',
            query: {
              id: res.data?.id,
            },
          });
        },
      }
    );
  });

  async function handleCancel() {
    handleReset();
    await navigateTo({ name: 'data-campaign' });
  }

  return {
    currentCampaignId,
    query,
    handleCancel,
    ...form,
    onSubmit,
  };
}

const DEFAULT_VALUES: Partial<CampaignSchemaValidationType> = {
  name: '',
  description: '',
  budget: 0,
  location: '',
  exclusiveTime: undefined,
  status: 'PENDING',
  exclusive: false,
  brandName: undefined,
};

function handleConvertInitialValues(
  data: ICampaign | undefined
): Partial<CampaignSchemaValidationType> {
  if (!data) return DEFAULT_VALUES;

  const categoryIds =
    data?.categories.map((item) => ({
      value: item.category.id,
      label: item.category.name,
    })) || [];

  const brand = data?.brand ? [{ label: data?.brand.title, value: data?.brand.id }] : [];

  const workingTime = [dayjs(data?.startWorkingDate), dayjs(data?.endWorkingDate)];
  // const fitingTime = [dayjs(data?.startFittingDate), dayjs(data?.endFittingDate)];

  return {
    name: data?.name || '',
    description: data?.description || '',
    budget: data?.budget || '',
    location: data?.location || '',
    exclusiveTime: data?.exclusiveTime || '',
    status: data?.status,
    thumbnail: ANDT_FORM_HELPER.handleImageForm(data?.thumbnail),

    categoryIds,
    exclusive: data?.exclusive || false,
    brand,
    // workHours: data?.workHours?.toString() || '',
    castingTime: dayjs(data?.startDate?.toString() || ''),
    // fitingTime,
    workingTime,
    brandName: data?.brandName || '',
  };
}

function combineToDate(date: Dayjs, time: Dayjs) {
  return dayjs(
    TIME_HELPER.formatDate({
      date,
      format: 'YYYY-MM-DD',
    }) +
      ' ' +
      TIME_HELPER.formatDate({ date: time, format: 'hh:mm' })
  ).toDate();
}
