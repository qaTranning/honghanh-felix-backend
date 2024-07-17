import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useProfileUpdateMutation } from '../../apis/update';
import { PROFILE_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS } from '~/common/libs';

export function useProfileUpdatePasswordForm() {
  const { onLoadMessager, onSuccessMessager } = MESSAGE_LIBS.handleMessageAndt(
    PROFILE_FEATURE_NAME,
    {}
  );
  const { handleSubmit, ...form } = useForm({
    validationSchema,
    initialValues: { ...DEFAULT_VALUE },
    keepValuesOnUnmount: false,
  });
  //   mutate
  const { mutate } = useProfileUpdateMutation({
    configs: {
      onMutate: () => {
        onLoadMessager('Đang cập nhật');
      },
      onSuccess: () => {
        onSuccessMessager('Cập nhật thành công');
        form.resetForm();
      },
    },
  });

  const onSubmit = handleSubmit((values) => {
    const { oldPassword, newPassword: password } = values;
    mutate({ body: { oldPassword, password } });
  });

  return { onSubmit, ...form };
}

// config
const validationSchema = yup.object().shape({
  oldPassword: yup.string().min(6).max(128).trim().required().label('old_password'),
  newPassword: yup.string().min(6).max(128).trim().required().label('new_password'),
  confirmPassword: yup
    .string()
    .required('Please retype your password.')
    .oneOf([yup.ref('newPassword')], 'Your passwords do not match.'),
});

interface IProfilePasswordUpdateForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const DEFAULT_VALUE: IProfilePasswordUpdateForm = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export type UseProfileUpdatePasswordFormType = ReturnType<typeof useProfileUpdatePasswordForm>;
