import * as yup from 'yup';
import { useGetDetailModelQuery, useUpdateModelMutation } from '../../apis';
import { FORM_HELPER, useFormWithSchema } from '~/common';
import type { IUser } from '~/features/user/models';
import { jsonReturnStringArray } from '~/common/helpers/json';

const schema = yup.object().shape({
  height: yup.number().required('Chiều cao là bắt buộc').min(1, 'Chiều cao phải lớn hơn 1'),
  weight: yup.number().required('Cân nặng là bắt buộc').min(1, 'Cân nặng phải lớn hơn 1'),
  bust: yup.number().required('Vòng 1 là bắt buộc').min(1, 'Vòng 1 phải lớn hơn 1'),
  hips: yup
    .number()
    .required('Vòng 3 là bắt buộc')
    .min(1, 'Vòng 3 phải lớn hơn 1')
    .max(999, 'Vòng 3 phải nhỏ hơn 999'),
  waist: yup.number().required('Vòng 2 là bắt buộc').min(1, 'Vòng 2 phải lớn hơn 1'),
  skinColor: yup.mixed().oneOf(['WHITE', 'YELLOW', 'BLACK']).required('Màu da là bắt buộc'),
  eyeColor: yup.string().required().max(255, 'Màu mắt phải nhỏ hơn 255 ký tự'),
  hairColor: yup.string().required().max(255, 'Màu tóc phải nhỏ hơn 255 ký tự'),
  hairLength: yup.mixed().oneOf(['LONG', 'SHORT']).required('Độ dài tóc là bắt buộc'),
  shirtSize: yup.string().required().max(255, 'Cỡ áo phải nhỏ hơn 255 ký tự'),
  trousersSize: yup.string().required().max(255, 'Cỡ quần phải nhỏ hơn 255 ký tự'),
  shoesSize: yup.string().required().max(255, 'Cỡ giày phải nhỏ hơn 255 ký tự'),
  // style: yup.string().required('Style is required'),
  style: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required('Phong cách là bắt buộc'),
        value: yup.string().required('Phong cách là bắt buộc'),
      })
    )
    .min(1, 'Phong cách là bắt buộc'),
  tattoo: yup
    .boolean()
    .default(false)
    .transform((value) => Boolean(value) || false),
});
type SchemaType = yup.InferType<typeof schema>;

export function useUpdateFormMeasurement() {
  const { mutate } = useUpdateModelMutation();
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

  const { handleSubmit, resetForm, isFieldDirty } = form;

  const onSubmit = handleSubmit((values) => {
    if (!currentModelId.value) {
      return;
    }

    FORM_HELPER.handlePayloadUpdateForm(values, isFieldDirty, (payload) => {
      const { style, ...tPayload } = payload;

      const convertStyle =
        style && style?.length > 0 ? JSON.stringify(style.map((style) => style.value)) : undefined;

      const body = { ...tPayload, style: convertStyle };

      mutate({ modelId: currentModelId.value || 0, body });
    });
  });

  return { currentModelId, onSubmit, ...form, ...query };
}

const DEFAULT_VALUE: Partial<SchemaType> = {
  height: 0,
  weight: 0,
  bust: 0,
  waist: 0,
  skinColor: 'YELLOW',
  eyeColor: '',
  hairColor: '',
  hairLength: 'LONG',
  shirtSize: '',
  trousersSize: '',
  shoesSize: '',
  style: [],
  tattoo: false,
  hips: 0,
};

function handleValueInitial(values?: IUser): Partial<SchemaType> {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }

  const {
    tattoo,
    style,
    trousersSize,
    shoesSize,
    shirtSize,
    hairColor,
    hairLength,
    eyeColor,
    skinColor,
    waist,
    bust,
    height,
    weight,
    hips,
  } = model;

  const styleConvert = style
    ? jsonReturnStringArray(style).map((style) => {
        return {
          label: style,
          value: style,
        };
      })
    : [];

  return {
    tattoo,
    style: styleConvert,
    trousersSize,
    shoesSize,
    shirtSize,
    hairColor,
    hairLength,
    eyeColor,
    skinColor,
    waist,
    bust,
    height,
    weight,
    hips,
  };
}

export type UseUpdateFormMeasurementType = ReturnType<typeof useUpdateFormMeasurement>;
