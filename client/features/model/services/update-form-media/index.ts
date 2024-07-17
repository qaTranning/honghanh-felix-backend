import * as yup from 'yup';
import { useGetDetailModelQuery, useUpdateModelMutation } from '../../apis';
import { convertArrayStringToString, convertStringToArrayString } from '../../utils';
import { ANDT_FORM_HELPER, useFormWithSchema } from '~/common';
import type { IUser } from '~/features/user/models';
const schema = yup.object().shape({
  video: yup.array().of(yup.string().required('Video là bắt buộc')),
  image360: yup.array().max(1).required('Ảnh 360 là bắt buộc'),
});

type SchemaType = yup.InferType<typeof schema>;

export function useUpdateFormMedia() {
  const updateModelMutation = useUpdateModelMutation();

  const { mutate } = updateModelMutation;
  const { currentModelId, resultUser, resultModel, query } = useGetDetailModelQuery();

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

  const { handleSubmit, resetForm, errors, values } = form;

  watch(errors, (v) => console.log(v));
  watch(values, (v) => console.log(v));

  const onSubmit = handleSubmit((values) => {
    if (!currentModelId.value) {
      return;
    }

    const { video, image360 } = values;

    const videlString = convertArrayStringToString(video);

    const { uploadImage, deleteImage } = ANDT_FORM_HELPER.handleImageForApi({
      listImageForm: image360,
      defaultValue: resultModel.value?.image360,
    });

    mutate({
      modelId: currentModelId.value || 0,
      body: {
        video: videlString,
        image360: uploadImage,
        delete360Image: deleteImage,
      },
    });
  });

  return { currentModelId, onSubmit, ...form, ...query, resultUser, resultModel };
}

const DEFAULT_VALUE: SchemaType = {
  video: [],
  image360: [],
};

function handleValueInitial(values?: IUser): SchemaType {
  if (!values) {
    return { ...DEFAULT_VALUE };
  }
  const model = values?.model;

  if (!model) {
    return { ...DEFAULT_VALUE };
  }

  const { video, image360 } = model;

  return {
    video: convertStringToArrayString(video),
    image360: ANDT_FORM_HELPER.handleImageForm(image360),
  };
}

export type UseUpdateFormMediaType = ReturnType<typeof useUpdateFormMedia>;
