import dayjs from 'dayjs';
import { campaignRoleValidationSchema, type CampaignRoleFormValues } from '../../validations';
import {
  useCreateCampaignRoleMutation,
  useUpdateCampaignRoleMutation,
} from '@/features/campaign/apis';
import type { ICampaignRole } from '@/features/campaign/models';
import { TIME_HELPER } from '~/common';
import { useFormZodSchema } from '~/common/form';
import type { MakeOptional } from '~/common/models';
import { jsonReturnStringArray } from '~/common/helpers/json';

export function useUpsertFormCampaignRole() {
  const updateCampaignRoleMutation = useUpdateCampaignRoleMutation();

  const createCampaignRoleMutation = useCreateCampaignRoleMutation();

  const currentCampaignRoleId = ref<number | undefined>(undefined);

  const form = useFormZodSchema({
    schema: campaignRoleValidationSchema,
    options: {
      initialValues: handleConvertInitialValues(undefined),
    },
  });

  const { handleSubmit, handleReset, resetForm } = form;

  function handleConvertBody(values: CampaignRoleFormValues) {
    const { toAge, workLoad, style, shootingDate, fitingTime, ...rest } = values;
    // toAge must be a number string, style must be a number string, wordload must be a number string, workingTime must be a Date instance

    const convertStyle =
      style?.length > 0 ? JSON.stringify(style.map((style) => style.value)) : undefined;

    const body = {
      ...rest,
      toAge: toAge ? String(toAge) : undefined,
      style: convertStyle,
      wordload: workLoad ? String(workLoad) : undefined,
      startShootingDate: shootingDate[0].toDate(),
      endShootingDate: shootingDate[1].toDate(),
      startFittingDate: fitingTime[0].toDate(),
      endFittingDate: fitingTime[1].toDate(),
    };

    return body;
  }

  const onSubmit = (campaignId: number, onDone: VoidFunction) => {
    return handleSubmit((values) => {
      const body = {
        ...handleConvertBody(values),
        campaignId,
      };

      // updatez
      if (currentCampaignRoleId.value) {
        updateCampaignRoleMutation.mutate(
          {
            campaignRoleId: +currentCampaignRoleId.value,
            body,
          },
          {
            onSuccess() {
              onDone();
              updateCampaignRoleMutation.reset();
            },
          }
        );

        return;
      }

      // create
      createCampaignRoleMutation.mutate(
        {
          body,
        },
        {
          onSuccess() {
            onDone();
            createCampaignRoleMutation.reset();
          },
        }
      );
    })();
  };

  async function handleCancel() {
    handleReset();
    await navigateTo({ name: 'data-campaign' });
  }

  function handleResetValues(data: ICampaignRole | undefined) {
    resetForm({
      values: handleConvertInitialValues(data),
    });
  }

  const isPending = computed(
    () => updateCampaignRoleMutation.isPending || createCampaignRoleMutation.isPending
  );

  return {
    currentCampaignRoleId,
    isPending,
    handleCancel,
    handleResetValues,
    ...form,
    onSubmit,
  };
}

const DEFAULT_VALUES: MakeOptional<CampaignRoleFormValues> = {
  name: '',
  description: '',
  fromAge: undefined,
  toAge: undefined,
  budget: undefined,
  citizenship: 'ASIAN',
  fromHeight: undefined,
  fromWeight: undefined,

  gender: 'FEMALE',
  imageLicenseFee: undefined,
  quantity: undefined,
  toHeight: undefined,
  toWeight: undefined,
  workLoad: undefined,
  style: [],
  shootingDate: undefined,
  fitingTime: undefined,
};

function handleConvertInitialValues(
  data: ICampaignRole | undefined
): MakeOptional<CampaignRoleFormValues> {
  if (!data) return DEFAULT_VALUES;

  const style =
    jsonReturnStringArray(data?.style).map((style) => {
      return {
        label: style,
        value: style,
      };
    }) || undefined;

  const shootingDate = [dayjs(data.startShootingDate), dayjs(data.endShootingDate)];
  const fitingTime = [dayjs(data.startFittingDate), dayjs(data.endFittingDate)];

  return {
    name: data.name || '',
    budget: Number(data.budget) || undefined,
    citizenship: data.citizenship || undefined,
    description: data.description || '',
    fromAge: Number(data.fromAge) || undefined,
    toAge: Number(data.toAge) || undefined,
    fromHeight: Number(data.fromHeight) || undefined,
    fromWeight: Number(data.fromWeight) || undefined,
    toHeight: Number(data.toHeight) || undefined,
    toWeight: Number(data.toWeight) || undefined,
    gender: data.gender || undefined,
    imageLicenseFee: data.imageLicenseFee || undefined,
    quantity: Number(data.quantity) || undefined,
    style,
    workLoad: Number(data.wordload) || undefined,
    shootingDate,
    fitingTime,
  };
}
