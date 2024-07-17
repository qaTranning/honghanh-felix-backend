import { z } from 'zod';
import dayjs from 'dayjs';
import { useGetDetailModelQuery, useUpdateModelMutation } from '../../apis';
import { FORM_HELPER, IMAGE_HELPER, TIME_HELPER, getZodDayjsAntd } from '~/common';
import { useFormZodSchema } from '~/common/form';
import type { IUser } from '~/features/user/models';
import { FormatDateTimeEnum } from '~/common/helpers/time';
const schema = z.object({
  // height: z.string().trim().max(255).optional(),
  // weight: z.string().trim().max(255).optional(),
  // measurement: z.string().trim().max(255).optional(),
  // shirt: z.string().trim().max(255).optional(),
  // shoes: z.string().trim().max(255).optional(),

  // images: z.array(z.string()).optional(),

  firstname: z.string().nullish(),
  lastname: z.string().nullish(),
  height: z.number().min(1).nullish(),
  weight: z.number().min(1).nullish(),
  bust: z.number().min(1).nullish(),
  hips: z.number().min(1).max(999).nullish(),
  waist: z.number().min(1).nullish(),
  shirtSize: z.number().nullish(),
  shoesSize: z.number().nullish(),

  dob: z.string().nullish(),
  images: z.array(z.object({ image: z.string(), id: z.number() })).optional(),
});

type SchemaType = z.infer<typeof schema>;

export function useUpdateFormComcard() {
  const updateModelMutation = useUpdateModelMutation();

  const { mutate } = updateModelMutation;
  const { currentModelId, resultUser, query } = useGetDetailModelQuery();

  const initialValues = computed(() => handleValueInitial(resultUser.value));

  watch(resultUser, (value) => {
    resetForm({ values: handleValueInitial(value) });
  });

  const form = useFormZodSchema({
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
      const { ...tPayload } = payload;

      const body = { ...tPayload };

      mutate({ modelId: currentModelId.value || 0, body });
    });
  });

  return { currentModelId, onSubmit, ...form, ...query };
}

const DEFAULT_VALUE: SchemaType = {
  dob: undefined,
  firstname: undefined,
  lastname: undefined,
  height: undefined,
  weight: undefined,
  bust: undefined,
  hips: undefined,
  waist: undefined,
  images: [],
  shirtSize: undefined,
  shoesSize: undefined,
};

function handleValueInitial(values?: IUser): SchemaType {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }

  return {
    dob: TIME_HELPER.convertTimeAndDateFormat(
      FormatDateTimeEnum['DD/MM/YYYY'],
      model?.dob?.toString() || ''
    ),
    firstname: values.firstname || '',
    lastname: values.lastname || '',
    height: Number(model.height) || undefined,
    bust: Number(model.bust) || undefined,
    hips: Number(model.hips) || undefined,
    waist: Number(model.waist) || undefined,
    weight: Number(model.weight) || undefined,
    shirtSize: Number(model.shirtSize) || undefined,
    shoesSize: Number(model.shoesSize) || undefined,
    images:
      values.model?.modelImages
        ?.map((item) => ({
          image: item.image,
          id: item.id,
        }))
        .slice(0, 5) || [],
  };
}

export type UseUpdateFormComcardType = ReturnType<typeof useUpdateFormComcard>;
