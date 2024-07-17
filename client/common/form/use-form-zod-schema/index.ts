import { toTypedSchema } from '@vee-validate/zod';
import { type FormOptions, useForm } from 'vee-validate';
import { z, ZodSchema } from 'zod';

type UseFormZodSchemaProps<S extends ZodSchema> = {
  schema: S;
  options?: Omit<FormOptions<z.infer<S>>, 'validationSchema'>;
};

export const useFormZodSchema = <S extends ZodSchema>({
  schema,
  options,
}: UseFormZodSchemaProps<S>) => {
  const form = useForm({
    validationSchema: toTypedSchema(schema),
    ...options,
  });

  return form;
};
