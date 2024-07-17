import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAuthLoginMutation } from '../../apis/login';

export function useAuthLoginForm() {
  const { mutate, ...rest } = useAuthLoginMutation();
  const initialValues = { ...DEFAULT_VALUE };

  const { handleSubmit, ...form } = useForm<IAuthLoginForm>({
    initialValues,
    validationSchema,
  });

  const onSubmit = handleSubmit((values) => {
    const body = { ...values };
    // check update
    mutate({ body });
  });

  return {
    onSubmit,
    ...form,
    ...rest,
  };
}

const validationSchema = yup.object().shape({
  email: yup.string().max(128).email().trim().required().label('Email'),
  password: yup.string().min(6).max(50).trim().required().label('Password'),
});

export interface IAuthLoginForm {
  email: string;
  password: string;
}

const DEFAULT_VALUE: IAuthLoginForm = {
  email: '',
  password: '',
};

export type UseAuthLoginFormType = ReturnType<typeof useAuthLoginForm>;
