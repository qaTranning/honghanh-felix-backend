import * as yup from 'yup';
import { useMutationCreateGallery } from '../../apis';
import { ANDT_FORM_HELPER, useBoolean, useFormWithSchema } from '~/common';

export function useCreateFormModalGallery() {
  const { mutateAsync, ...mutation } = useMutationCreateGallery({});

  const [open, onOpen] = useBoolean();
  const form = useFormWithSchema({
    schema,
    options: {
      initialValues: { ...DEFAULT_VALUE },
    },
  });

  const { handleSubmit, resetForm } = form;

  const onSubmit = handleSubmit(async (values) => {
    const { name, image } = values;
    const { uploadImage } = ANDT_FORM_HELPER.handleImageForApi({
      listImageForm: image,
    });

    try {
      if (uploadImage) {
        await mutateAsync(
          { body: { name, image: uploadImage } },
          {
            onSuccess: () => {
              onOpen.setFalse();
              resetForm();
            },
          }
        );
      }
    } catch (error) {}
  });

  return { onSubmit, open, onOpen, ...form, ...mutation };
}

export const schema = yup.object().shape({
  image: yup.array().required().length(1),
  name: yup.string().required(),
});
type SchemaType = yup.InferType<typeof schema>;

const DEFAULT_VALUE: SchemaType = {
  name: '',
  image: [],
};

export type UseCreateFormModalType = ReturnType<typeof useCreateFormModalGallery>;
