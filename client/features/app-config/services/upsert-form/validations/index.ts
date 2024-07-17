import * as yup from 'yup';

export const appConfigUpsertSchemaValidation = yup.object().shape({
  name: yup.string().required('Trường bắt buộc điền'),
  value: yup.string().required('Trường bắt buộc điền'),
});

export type AppConfigUpsertSchemaValidationType = yup.InferType<
  typeof appConfigUpsertSchemaValidation
>;
