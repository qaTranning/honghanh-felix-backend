import type { UploadFile } from 'ant-design-vue';
import { z } from 'zod';
import { useGetDetailModelQuery, useMutationCreateImageModel } from '../../apis';
import type { IUser } from '~/features/user/models';
import { ANDT_FORM_HELPER } from '~/common';
import { useFormZodSchema } from '~/common/form';

const schema = z.object({
  images: z.array(z.custom<UploadFile>()).max(10),
});

type SchemaType = z.infer<typeof schema>;

export function useUpsertImageModelForm() {
  const { mutate } = useMutationCreateImageModel();

  const { currentModelId, resultModel, query } = useGetDetailModelQuery();

  const listImage = computed(
    () =>
      resultModel?.value?.modelImages.map((item) => ({
        id: item.id,
        image: item.image,
        key: item.id,
      })) || []
  );

  const form = useFormZodSchema({
    schema,
    options: {
      initialValues: { ...DEFAULT_VALUE },
    },
  });
  const { handleSubmit, resetForm } = form;

  const onSubmit = handleSubmit((values) => {
    if (!currentModelId.value) {
      return;
    }

    const { uploadImages } = ANDT_FORM_HELPER.handleImagesForApi({ listImageForm: values.images });

    mutate({
      body: {
        modelId: currentModelId.value,
        image: uploadImages as any,
      },
    });
  });

  return { currentModelId, onSubmit, listImage, ...form, ...query };
}

const DEFAULT_VALUE: SchemaType = {
  images: [],
};

function handleValueInitial(values?: IUser): SchemaType {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }
  if (model) {
    const { modelImages } = model;

    if (!modelImages) {
      return { ...DEFAULT_VALUE };
    }

    const data = modelImages.map((item) => item.image);

    return { images: ANDT_FORM_HELPER.handleImagesForm(data) };
  }

  return { ...DEFAULT_VALUE };
}

export type UseUpsertImageModelFormType = ReturnType<typeof useUpsertImageModelForm>;
