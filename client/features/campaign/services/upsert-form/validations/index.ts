import type { UploadFile } from 'ant-design-vue';
import type { LabeledValue } from 'ant-design-vue/lib/select';
import { z } from 'zod';
import { getZodDayjsAntd } from '~/common';

export const campaignSchemaValidation = z.object({
  thumbnail: z
    .array(z.custom<UploadFile>(), {
      required_error: 'Thumbnail là bắt buộc',
      invalid_type_error: 'Thumbnail là bắt buộc',
    })
    .optional(),
  // .min(1, 'Thumbnail là bắt buộc'),
  categoryIds: z
    .array(
      z.object({
        value: z.number({
          invalid_type_error: 'Thể loại là bắt buộc',
          required_error: 'Thể loại là bắt buộc',
        }),
        label: z.string({
          invalid_type_error: 'Thể loại là bắt buộc',
          required_error: 'Thể loại là bắt buộc',
        }),
      }),
      {
        required_error: 'Thể loại là bắt buộc',
        invalid_type_error: 'Thể loại là bắt buộc',
      }
    )
    .min(1, 'Thể loại là bắt buộc'),
  name: z
    .string()
    .trim()
    .min(1, 'Tên chiến dịch là bắt buộc')
    .max(255, 'Tên chiến dịch phải nhỏ hơn 255 ký tự'),
  brand: z
    .array(z.custom<LabeledValue>(), {
      required_error: 'Thương hiệu là bắt buộc',
      invalid_type_error: 'Thương hiệu là bắt buộc',
    })
    .optional(),
  // .length(1, 'Thương hiệu là bắt buộc'),
  description: z
    .string({
      invalid_type_error: 'Mô tả là bắt buộc',
      required_error: 'Mô tả là bắt buộc',
    })
    .trim()
    .min(1, 'Mô tả là bắt buộc'),
  brandName: z.string().trim().optional(),

  location: z
    .string({
      invalid_type_error: 'Vị trí là bắt buộc',
      required_error: 'Vị trí là bắt buộc',
    })
    .trim()
    .min(1, 'Vị trí là bắt buộc')
    .max(255, 'Vị trí phải nhỏ hơn 255 ký tự'),
  budget: z
    .string({
      invalid_type_error: 'Ngân sách là bắt buộc',
      required_error: 'Ngân sách là bắt buộc',
    })
    .min(1, 'Ngân sách là bắt buộc')
    .default(''),

  exclusiveTime: z.string().trim().optional(),
  status: z
    .string({
      required_error: 'Trạng thái là bắt buộc',
      invalid_type_error: 'Trạng thái là bắt buộc',
    })
    .trim()
    .min(1, 'Trạng thái là bắt buộc'),
  exclusive: z
    .boolean()
    .default(false)
    .transform((v) => !!v),
  // fitingTime: z
  //   .array(
  //     getZodDayjsAntd({
  //       messageInvalid: 'Thời gian thử đồ là bắt buộc',
  //       messageRequired: 'Thời gian thử đồ là bắt buộc',
  //     }),
  //     {
  //       required_error: 'Thời gian thử đồ là bắt buộc',
  //       invalid_type_error: 'Thời gian thử đồ là bắt buộc',
  //     }
  //   )
  //   .length(2, 'Thời gian thử đồ là bắt buộc')
  //   .min(1, 'Thời gian thử đồ là bắt buộc'),
  castingTime: getZodDayjsAntd({
    messageInvalid: 'Thời gian casting là bắt buộc',
    messageRequired: 'Thời gian casting là bắt buộc',
  }),
  workingTime: z
    .array(
      getZodDayjsAntd({
        messageInvalid: 'Thời gian làm việc là bắt buộc',
        messageRequired: 'Thời gian làm việc là bắt buộc',
      }),
      {
        required_error: 'Thời gian làm việc là bắt buộc',
        invalid_type_error: 'Thời gian làm việc là bắt buộc',
      }
    )
    .length(2, 'Thời gian làm việc là bắt buộc')
    .min(1, 'Thời gian làm việc là bắt buộc'),
  // workHours: z.coerce.number().min(0),
});

export type CampaignSchemaValidationType = z.infer<typeof campaignSchemaValidation>;
