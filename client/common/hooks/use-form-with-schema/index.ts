import { useForm, type FormOptions } from 'vee-validate';
import * as yup from 'yup';

interface UseFormWithSchemaProps<S extends yup.AnyObjectSchema> {
  schema: S;
  options?: Omit<FormOptions<yup.InferType<S>>, 'validationSchema'>;
}
export function useFormWithSchema<S extends yup.AnyObjectSchema>(props: UseFormWithSchemaProps<S>) {
  const { schema, options } = props;
  const form = useForm<yup.InferType<S>>({
    validationSchema: schema,
    ...options,
  });

  return form;
}
