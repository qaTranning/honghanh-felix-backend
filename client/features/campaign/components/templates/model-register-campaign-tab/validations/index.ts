import { z } from 'zod';

export const adminConfirmValidationSchema = z.object({
  status: z
    .string({
      invalid_type_error: 'Trạng thái là bắt buộc',
      required_error: 'Trạng thái là bắt buộc',
    })
    .min(1, 'Trạng thái là bắt buộc'),
  modelId: z.number({
    invalid_type_error: 'Người mẫu là bắt buộc',
    required_error: 'Người mẫu là bắt buộc',
  }),
  campaignRoleId: z.number({
    invalid_type_error: 'Vai trò là bắt buộc',
    required_error: 'Vai trò là bắt buộc',
  }),
});

export type AdminConfirmFormValues = z.infer<typeof adminConfirmValidationSchema>;
