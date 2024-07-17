import * as yup from 'yup';
import { useGetDetailModelQuery, useUpdateModelMutation } from '../../apis';
import { FORM_HELPER, useFormWithSchema } from '~/common';
import type { IUser } from '~/features/user/models';
const schema = yup.object().shape({
  currency: yup.mixed().oneOf(['USD', 'VND']).required('Đơn vị tiền tệ là bắt buộc'),
  salary1h: yup.number().required('Lương 1h là bắt buộc').min(1, 'Lương 1h phải lớn hơn 1'),
  salary4h: yup.number().required('Lương 4h là bắt buộc').min(1, 'Lương 4h phải lớn hơn 1'),
  salary8h: yup.number().required('Lương 8h là bắt buộc').min(1, 'Lương 8h phải lớn hơn 1'),
  salary12h: yup.number().required('Lương 12h là bắt buộc').min(1, 'Lương 12h phải lớn hơn 1'),
  salary24h: yup.number().required('Lương 24h là bắt buộc').min(1, 'Lương 24h phải lớn hơn 1'),
  salaryOvertime: yup
    .number()
    .required('Lương tăng ca là bắt buộc')
    .min(1, 'Lương tăng ca phải lớn hơn 1'),
});

type SchemaType = yup.InferType<typeof schema>;

export function useUpdateFormSalary() {
  const updateModelMutation = useUpdateModelMutation();

  const { mutate } = updateModelMutation;
  const { currentModelId, resultUser, query } = useGetDetailModelQuery();

  const initialValues = computed(() => handleValueInitial(resultUser.value));

  watch(resultUser, (value) => {
    resetForm({ values: handleValueInitial(value) });
  });

  const form = useFormWithSchema({
    schema,
    options: {
      initialValues: initialValues.value,
    },
  });

  const { handleSubmit, resetForm, isFieldDirty, errors } = form;

  const onSubmit = handleSubmit((values) => {
    if (!currentModelId.value) {
      return;
    }

    FORM_HELPER.handlePayloadUpdateForm(values, isFieldDirty, (payload) => {
      const { ...tPayload } = payload;

      const body = { ...tPayload };

      mutate({ modelId: currentModelId.value || 0, body });
    });
  });

  return { currentModelId, onSubmit, ...form, ...query };
}

const DEFAULT_VALUE: SchemaType = {
  currency: 'VND',
  salary1h: 0,
  salary4h: 0,
  salary8h: 0,
  salary12h: 0,
  salary24h: 0,
  salaryOvertime: 0,
};

function handleValueInitial(values?: IUser): SchemaType {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }

  const { currency, salary1h, salary4h, salary8h, salary12h, salary24h, salaryOvertime } = model;

  return {
    currency,
    salary1h,
    salary4h,
    salary8h,
    salary12h,
    salary24h,
    salaryOvertime,
  };
}

export type UseUpdateFormSalaryType = ReturnType<typeof useUpdateFormSalary>;
