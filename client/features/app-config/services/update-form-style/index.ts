import { jsonReturnStringArray } from '../../../../common/helpers/json';
import { useMutationUpdateAppConfig, useQueryDetailAppConfig } from '../../apis';
import type { IAppConfig } from '../../models';
import {
  appConfigUpdateStyleSchemaValidation,
  type AppConfigUpdateStyleSchemaValidationType,
} from './validations';
import { useFormWithSchema } from '~/common/hooks';

const DEFAULT_VALUE: AppConfigUpdateStyleSchemaValidationType = {
  value: [],
};

function convertInitial(data?: IAppConfig) {
  return data ? { value: jsonReturnStringArray(data?.value) } : DEFAULT_VALUE;
}

export function useAppConfigUpdateStyleForm() {
  const updateMutation = useMutationUpdateAppConfig();

  const { query, appConfigId } = useQueryDetailAppConfig();

  const { data } = query;
  const initialValues = computed(() => convertInitial(data.value?.data));
  const form = useFormWithSchema({
    schema: appConfigUpdateStyleSchemaValidation,
    options: {
      initialValues: initialValues.value,
    },
  });

  const { handleSubmit, resetForm, errors } = form;

  const onSubmit = handleSubmit((values) => {
    const { value } = values;
    if (appConfigId.value) {
      updateMutation.mutation.mutate(
        {
          params: { id: appConfigId.value },
          body: {
            value: JSON.stringify(value),
            name: data.value?.data?.name,
          },
        },
        {
          onSuccess() {},
        }
      );
    }
  });

  watch(data, (value) => {
    resetForm({
      values: convertInitial(value?.data),
    });
  });

  return { onSubmit, query, appConfigId, ...form };
}
