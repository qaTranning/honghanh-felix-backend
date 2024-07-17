/* eslint-disable camelcase */
import { z } from 'zod';
import { useFormZodSchema } from '~/common/form';
import {
  useMutationUpdateAppConfig,
  useQueryDetailByNameAppConfig,
} from '~/features/app-config/apis';

const schema = z.object({
  banner_1: z.string().trim().url('Điền một đoạn url ảnh').optional().or(z.literal('')),
  banner_2: z.string().trim().url('Điền một đoạn url ảnh').optional().or(z.literal('')),
  banner_3: z.string().trim().url('Điền một đoạn url ảnh').optional().or(z.literal('')),
  banner_4: z.string().trim().url('Điền một đoạn url ảnh').optional().or(z.literal('')),
  banner_5: z.string().trim().url('Điền một đoạn url ảnh').optional().or(z.literal('')),
});

type SchemaType = z.infer<typeof schema>;

export function useUpdateBannerForm() {
  const { mutation } = useMutationUpdateAppConfig();
  const { mutate } = mutation;
  const { data, ...query } = useQueryDetailByNameAppConfig({ defaultValue: 'BANNER' });
  const initialValues = computed(() => handleInitialValues(data.value?.data.value));

  const id = computed(() => data.value?.data.id);

  const { handleSubmit, resetForm, ...form } = useFormZodSchema({
    schema,
    options: {
      initialValues: initialValues.value,
    },
  });

  watch(data, (value) => {
    resetForm({
      values: handleInitialValues(value?.data.value),
    });
  });

  const onSubmit = handleSubmit((values) => {
    const { banner_1, banner_2, banner_3, banner_4, banner_5 } = values;

    if (id.value) {
      const updateValue =
        banner_1 + ',' + banner_2 + ',' + banner_3 + ',' + banner_4 + ',' + banner_5;

      mutate({
        params: { id: id.value },
        body: { value: updateValue, name: data.value?.data?.name },
      });
    }
  });

  return { onSubmit, query, ...form };
}

const DEFAULT_VALUE: SchemaType = {
  banner_1: '',
  banner_2: '',
  banner_3: '',
  banner_4: '',
  banner_5: '',
};

function handleInitialValues(value?: string): SchemaType {
  if (value) {
    const arrayValue = value.split(',');

    const data = {
      banner_1: arrayValue[0] || '',
      banner_2: arrayValue[1] || '',
      banner_3: arrayValue[2] || '',
      banner_4: arrayValue[3] || '',
      banner_5: arrayValue[4] || '',
    };
    console.log(data);
    return data;
  } else {
    return { ...DEFAULT_VALUE };
  }
}
export type UseUpdateBannerFormType = ReturnType<typeof useUpdateBannerForm>;
