import * as yup from 'yup';
import type { _DeepPartial } from 'pinia';
import { type IBrand } from '../../models';
import { useMutationCreateBrand, useMutationUpdateBrand, useQueryDetailBrand } from '../../apis';
import { ANDT_FORM_HELPER, useFormWithSchema } from '~/common';

export function useUpsertFormBrand() {
  const createMutation = useMutationCreateBrand({});
  const updateMutation = useMutationUpdateBrand({});
  const { query, brandId } = useQueryDetailBrand({});

  const { data } = query;

  watch(data, (value) => {
    const result = value?.data;

    if (!result) return;

    resetForm({
      values: convertInitial(result),
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
    const { thumbnail, userId, ...payload } = values;

    const { uploadImage, deleteImage: deleteThumbnail } = ANDT_FORM_HELPER.handleImageForApi({
      listImageForm: thumbnail || [],
      defaultValue: data.value?.data.thumbnail || undefined,
    });

    const _userId = (userId as any).value || userId;

    if (brandId.value) {
      updateMutation.mutation.mutate(
        {
          params: { id: brandId.value },
          body: {
            ...payload,
            userId: _userId,
            thumbnail: uploadImage,
            deleteThumbnail,
          },
        },
        {
          onSuccess() {},
        }
      );

      return;
    }

    createMutation.mutation.mutate(
      { body: { ...payload, userId: _userId, thumbnail: uploadImage } },
      {
        onSuccess: (res) => {
          const newAppConfigId = res.data?.id;
          if (!newAppConfigId) return;

          navigateTo({
            name: 'data-brand-update',
            query: { id: newAppConfigId },
          });
        },
      }
    );
  });

  return { brandId, onSubmit, ...form, ...query };
}

const DEFAULT_VALUE: SchemaValidation = {
  userId: undefined as unknown as number,
  title: '',
  taxCode: '',
  description: undefined,
  email: '',
  phone: undefined,
  status: 'PENDING',
  website: undefined,
  thumbnail: [],
  address: undefined,
};

function convertInitial(data: IBrand): Partial<SchemaValidation> {
  const {
    title = '',
    taxCode,
    description = '',
    status,
    email = '',
    phone = '',
    website = '',
    thumbnail,
    userId,
    address = '',
  } = data;

  return {
    userId,
    title,
    taxCode,
    description,
    email,
    status,
    phone,
    website,
    address,
    thumbnail: ANDT_FORM_HELPER.handleImageForm(thumbnail),
  };
}

export const schema = yup.object().shape({
  userId: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required(),
          value: yup.number().required('Người dùng không được để trống'),
        });
      case 'number':
        return yup.number().required('Người dùng không được để trống');
      default:
        return yup.number().required('Người dùng không được để trống');
    }
  }),
  title: yup
    .string()
    .min(1, 'Tối thiếu 1 ký tự')
    .max(56, 'Tối đa 56 ký tự')
    .required('Trường bắt buộc điền'),
  taxCode: yup
    .string()
    .min(1, 'Tối thiếu 1 ký tự')
    .max(56, 'Tối đa 56 ký tự')
    .required('Trường bắt buộc điền'),
  description: yup.string().optional().max(256, 'Tối đa 256 ký tự'),
  email: yup.string().email('Điền định dạnh email').required('Trường bắt buộc điền'),
  phone: yup.string().max(15, 'Tối đa 15 ký tự'),
  status: yup.string(), // 'PENDING', 'ACTIVE', 'BANNED',
  website: yup.string().optional(),
  thumbnail: yup.array().optional(),
  address: yup.string().optional(),
});

type SchemaValidation = yup.InferType<typeof schema>;

export type UseBrandUpsertFormType = ReturnType<typeof useUpsertFormBrand>;
