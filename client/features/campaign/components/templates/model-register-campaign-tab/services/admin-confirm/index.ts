import { adminConfirmValidationSchema, type AdminConfirmFormValues } from '../../validations';
import type { IRegisterCampaign } from '@/features/campaign/models';
import { useFormZodSchema } from '~/common/form';
import type { MakeOptional } from '~/common/models';
import {
  useAdminConfirmRegisterCampaignMutation,
  type IBodyAdminConfirmRegisterCampaignRequest,
} from '~/features/campaign/apis/register/admin-confirm';

export function useAdminConfirmRegisterCampaignService() {
  const adminConfirmRegisterCampaignMutation = useAdminConfirmRegisterCampaignMutation();

  const currentCampaignRoleId = ref<number | undefined>(undefined);

  const form = useFormZodSchema({
    schema: adminConfirmValidationSchema,
    options: {
      initialValues: handleConvertInitialValues(undefined),
    },
  });

  const { handleSubmit, handleReset, errors, resetForm } = form;

  watch(errors, () => {});

  function handleConvertBody(values: AdminConfirmFormValues) {
    const { status, ...rest } = values;

    const body = {
      ...rest,
      status,
    };

    return body;
  }

  const onSubmit = (
    params: Pick<IBodyAdminConfirmRegisterCampaignRequest, 'campaignId'>,
    onDone: VoidFunction
  ) => {
    return handleSubmit((values) => {
      const body = {
        ...params,

        ...handleConvertBody(values),
      };

      adminConfirmRegisterCampaignMutation.mutate(
        { body },
        {
          onSuccess() {
            onDone();
          },
        }
      );
    })();
  };

  async function handleCancel() {
    handleReset();
    await navigateTo({ name: 'data-campaign' });
  }

  function handleResetValues(data: IRegisterCampaign | undefined) {
    resetForm({
      values: handleConvertInitialValues(data),
    });
  }

  const isPending = computed(() => adminConfirmRegisterCampaignMutation.isPending);

  return {
    currentCampaignRoleId,
    isPending,
    handleCancel,
    handleResetValues,
    ...form,
    onSubmit,
  };
}

const DEFAULT_VALUES: MakeOptional<AdminConfirmFormValues> = {
  status: undefined,
  campaignRoleId: undefined,
  modelId: undefined,
};

function handleConvertInitialValues(
  data: IRegisterCampaign | undefined
): MakeOptional<AdminConfirmFormValues> {
  if (!data) return DEFAULT_VALUES;

  return {
    status: data?.status || undefined,
    campaignRoleId: data?.campaignRoleId || undefined,
    modelId: data?.modelId || undefined,
  };
}
