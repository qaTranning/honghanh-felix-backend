import {
  useMutationCreateAppConfig,
  useMutationUpdateAppConfig,
  useQueryDetailAppConfig,
} from '../../apis';
import type { IAppConfig } from '../../models';
import { appConfigUpsertSchemaValidation } from './validations';
import { useFormWithSchema } from '~/common/hooks';

export function useAppConfigUpsertForm() {
  const createMutation = useMutationCreateAppConfig();
  const updateMutation = useMutationUpdateAppConfig();

  const { query, appConfigId } = useQueryDetailAppConfig();

  const { data } = query;
  const initialValues = computed(() =>
    data.value?.data ? convertInitial(data.value?.data) : { ...DEFAULT_VALUE }
  );
  const form = useFormWithSchema({
    schema: appConfigUpsertSchemaValidation,
    options: {
      initialValues: initialValues.value,
    },
  });

  const { handleSubmit, resetForm, errors } = form;

  watch(errors, () => {
    console.log(errors);
  });

  const onSubmit = handleSubmit((values) => {
    console.log('values');
    console.log(values);
    if (appConfigId.value) {
      updateMutation.mutation.mutate(
        { params: { id: appConfigId.value }, body: values },
        {
          onSuccess() {},
        }
      );

      return;
    }

    createMutation.mutation.mutate(
      { body: values },
      {
        onSuccess: (res) => {
          const newAppConfigId = res.data?.id;
          if (!newAppConfigId) return;

          navigateTo({
            name: 'data-app-config-update',
            query: { id: newAppConfigId },
          });
        },
      }
    );
  });

  watch(data, () => {
    const appConfig = data.value?.data;

    if (!appConfig) return;

    resetForm({
      values: {
        value: appConfig.value,
        name: appConfig.name,
      },
    });
  });

  return { onSubmit, query, appConfigId, ...form };
}

interface IAppConfigUpdateForm extends Pick<IAppConfig, 'name' | 'value'> {}

const DEFAULT_VALUE: IAppConfigUpdateForm = {
  name: '',
  value: '',
};

function convertInitial(data: IAppConfig): IAppConfigUpdateForm {
  const { name, value } = data;
  return { name, value };
}
