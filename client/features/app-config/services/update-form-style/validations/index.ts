import * as yup from 'yup';

export const appConfigUpdateStyleSchemaValidation = yup.object().shape({
  value: yup.array().of(yup.string().required('Trường bắt buộc điền')),
});

export type AppConfigUpdateStyleSchemaValidationType = yup.InferType<
  typeof appConfigUpdateStyleSchemaValidation
>;
