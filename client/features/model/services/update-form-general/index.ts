import * as yup from 'yup';
import dayjs from 'dayjs';
import { useGetDetailModelQuery, useUpdateModelMutation } from '../../apis';
import { ANDT_FORM_HELPER, FORM_HELPER, useFormWithSchema } from '~/common';
import type { IUser } from '~/features/user/models';
const schema = yup.object().shape({
  citizenship: yup
    .mixed()
    .oneOf(['ASIAN', 'AFRICAN', 'EUROPEAN', 'AMERICAN', 'VIETNAMESE'])
    .required(),
  gender: yup.mixed().oneOf(['FEMALE', 'MALE']),
  // location: yup.mixed().oneOf(['HN', 'HCM', 'DN']),
  location: yup.string().required('Vị trí là bắt buộc'),
  dob: yup.mixed(),
  address: yup.string().optional(),
  talent: yup.string().optional(),
  introduce: yup.string().max(255, 'Giới thiệu phải nhỏ hơn 255 ký tự'),
  // social
  facebook: yup.string().optional().max(255, 'Facebook phải nhỏ hơn 255 ký tự'),
  instagram: yup.string().optional().max(255, 'Instagram phải nhỏ hơn 255 ký tự'),
  twitter: yup.string().optional().max(255, 'Twitter phải nhỏ hơn 255 ký tự'),
  tiktok: yup.string().optional().max(255, 'Tiktok phải nhỏ hơn 255 ký tự'),
  idCardBackFace: yup.array().optional(),
  idCardFrontFace: yup.array().optional(),
  phone: yup.string().optional(),
  idCard: yup.string().optional(),
});

type SchemaType = yup.InferType<typeof schema>;

export function useUpdateFormGeneral() {
  const updateModelMutation = useUpdateModelMutation();

  const { mutate } = updateModelMutation;
  const { currentModelId, resultUser, query, resultModel } = useGetDetailModelQuery();

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
    const { idCardBackFace, idCardFrontFace } = values;

    const { uploadImage: uploadIdFrontFaceImage, deleteImage: deleteIdCardFrontFace } =
      ANDT_FORM_HELPER.handleImageForApi({
        listImageForm: idCardFrontFace || [],
        defaultValue: resultModel.value?.idCardFrontFace || undefined,
      });

    const { uploadImage: uploadIdBackFaceImage, deleteImage: deleteIdCardBackFace } =
      ANDT_FORM_HELPER.handleImageForApi({
        listImageForm: idCardBackFace || [],
        defaultValue: resultModel.value?.idCardBackFace || undefined,
      });

    FORM_HELPER.handlePayloadUpdateForm(values, isFieldDirty, (payload) => {
      const { dob, ...tPayload } = payload;

      const body = {
        ...tPayload,
        dob: dob ? dayjs(dob as any).toDate() : undefined,
        idCardFrontFace: uploadIdFrontFaceImage,
        idCardBackFace: uploadIdBackFaceImage,
        deleteIdCardFrontFace,
        deleteIdCardBackFace,
      };

      mutate({ modelId: currentModelId.value || 0, body });
    });
  });

  const isDirty = computed(() => FORM_HELPER.handlePayloadUpdateForm(form.values, isFieldDirty));

  return { currentModelId, onSubmit, ...form, isDirty, ...query };
}

const DEFAULT_VALUE: SchemaType = {
  citizenship: 'ASIAN',
  gender: 'MALE',
  location: 'HN',
  dob: undefined,
  introduce: '',
  facebook: '',
  instagram: '',
  twitter: '',
  tiktok: '',
  phone: '',
  idCard: '',
};

function handleValueInitial(values?: IUser): SchemaType {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }

  const {
    location,
    citizenship,
    instagram,
    introduce,
    twitter,
    facebook,
    tiktok,
    talent,
    idCardBackFace,
    idCardFrontFace,
    dob,
    gender,
    address,
    idCard,
    phone,
  } = model;

  return {
    citizenship,
    address: address || '',
    gender: gender as any,
    location: location || '',
    dob: dob ? dayjs(dob) : undefined,
    instagram: instagram || '',
    introduce: introduce || '',
    twitter: twitter || '',
    facebook: facebook || '',
    tiktok: tiktok || '',
    talent: talent || '',
    idCardBackFace: ANDT_FORM_HELPER.handleImageForm(idCardBackFace),
    idCardFrontFace: ANDT_FORM_HELPER.handleImageForm(idCardFrontFace),
    phone: phone || '',
    idCard: idCard || '',
  };
}

export type UseUpdateFormGeneralType = ReturnType<typeof useUpdateFormGeneral>;
