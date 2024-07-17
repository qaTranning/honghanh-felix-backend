import { z } from 'zod';

export const userSchemaValidation = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, 'Trường bắt buộc điền')
    .max(255, 'Vui lòng điền tối đa 255 kí tự'),
  lastname: z
    .string()
    .trim()
    .min(1, 'Trường bắt buộc điền')
    .max(255, 'Vui lòng điền tối đa 255 kí tự'),
  email: z.string().trim().email('Trường bắt buộc điền'),
  // password: z.string().min(1, 'Password is required'),
  role: z.enum(['ADMIN', 'MODEL', 'REPRESENTATIVE'], {
    required_error: 'Trường bắt buộc điền',
    invalid_type_error: 'Giá trị không hợp lệ',
  }),
  password: z
    .string()
    .trim()
    .min(1, 'Trường bắt buộc điền')
    .min(8, 'Vui lòng điền tối thiểu 8 kí tự')
    .max(32, 'Vui lòng điền tối đa 32 kí tự')
    .optional(),
  // phone: z.string().trim().min(1, 'Phone is required').regex(REGEX_HELPER.regexPhone, {
  //   message: 'Phone number is not valid',
  // }),
  // dob: getZodDayjsAntd({
  //   messageInvalid: 'Date of birth is not valid',
  //   messageRequired: 'Date of birth is required',
  // }),
});
export type UserSchemaValidationType = z.infer<typeof userSchemaValidation>;
