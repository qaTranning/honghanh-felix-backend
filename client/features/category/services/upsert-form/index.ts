import * as yup from 'yup';
import {
  useQueryDetailCategory,
  useMutationUpdateCategory,
  useMutationCreateCategory,
} from '../../apis';
import type { ICategory } from '../../models';
import { useFormWithSchema } from '~/common';

export function useCategoryUpsertForm() {
  const createMutation = useMutationCreateCategory({});
  const updateMutation = useMutationUpdateCategory({});

  const { query, categoryId } = useQueryDetailCategory({});

  const { data } = query;
  watch(data, () => {
    const result = data.value?.data;

    if (!result) return;

    resetForm({
      values: {
        order: result.order,
        name: result.name,
      },
    });
  });
  const initialValues = computed(() =>
    data.value?.data ? convertInitial(data.value?.data) : { ...DEFAULT_VALUE }
  );

  const form = useFormWithSchema({
    schema,
    options: {
      initialValues: initialValues.value,
    },
  });

  const { handleSubmit, resetForm } = form;

  const onSubmit = handleSubmit((values) => {
    if (categoryId.value) {
      updateMutation.mutation.mutate(
        { params: { id: categoryId.value }, body: values },
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
            name: 'data-category-update',
            query: { id: newAppConfigId },
          });
        },
      }
    );
  });

  return { onSubmit, categoryId, ...form };
}

interface IDefaultValueForm extends Pick<ICategory, 'name' | 'order'> {}

const DEFAULT_VALUE: IDefaultValueForm = {
  name: '',
  order: 10,
};

function convertInitial(data: ICategory): IDefaultValueForm {
  const { name, order } = data;
  return { name, order };
}

export const schema = yup.object().shape({
  name: yup
    .string()
    .min(1, 'Tối thiểu 1 ký tự')
    .max(56, 'Tối đa 56 ký tự')
    .required('Trường bắt buộc điền'),
  order: yup.number().required('Trường bắt buộc điền'),
});

export type UseCategoryUpsertFormType = ReturnType<typeof useCategoryUpsertForm>;
