import { z } from 'zod';
import { getZodDayjsAntd } from '~/common';

export const campaignRoleValidationSchema = z.object({
  name: z.string().trim().min(1, 'Vai trò là bắt buộc').max(255, 'Vai trò phải nhỏ hơn 255 ký tự'),

  gender: z
    .enum(['FEMALE', 'MALE'], {
      required_error: 'Giới tính là bắt buộc',
    })
    .default('FEMALE'),

  budget: z.number({
    required_error: 'Ngân sách là bắt buộc',
    invalid_type_error: 'Ngân sách là bắt buộc',
  }),
  // budget: z
  //   .string({
  //     invalid_type_error: 'Ngân sách là bắt buộc',
  //     required_error: 'Ngân sách là bắt buộc',
  //   })
  //   .min(1, 'Ngân sách là bắt buộc')
  //   .default(''),
  imageLicenseFee: z
    .string({
      invalid_type_error: 'Phí bản quyền hình ảnh là bắt buộc',
      required_error: 'Phí bản quyền hình ảnh là bắt buộc',
    })
    .min(1, 'Phí bản quyền hình ảnh là bắt buộc')
    .default(''),
  fromHeight: z
    .number({
      required_error: 'Chiều cao tối thiểu là bắt buộc',
      invalid_type_error: 'Chiều cao tối thiểu là bắt buộc',
    })
    .min(1, 'Chiều cao tối thiểu phải lớn hơn 1')
    .max(999, 'Chiều cao tối thiểu phải nhỏ hơn 999'),
  toHeight: z
    .number({
      required_error: 'Chiều cao tối đa là bắt buộc',
      invalid_type_error: 'Chiều cao tối đa là bắt buộc',
    })
    .min(1, 'Chiều cao tối đa phải lớn hơn 1')
    .max(999, 'Chiều cao tối đa phải nhỏ hơn 999'),
  fromWeight: z
    .number({
      required_error: 'Cân nặng tối thiểu là bắt buộc',
      invalid_type_error: 'Cân nặng tối thiểu là bắt buộc',
    })
    .min(1, 'Cân nặng tối thiểu phải lớn hơn 1')
    .max(999, 'Cân nặng tối thiểu phải nhỏ hơn 999'),
  toWeight: z
    .number({
      required_error: 'Cân nặng tối đa là bắt buộc',
      invalid_type_error: 'Cân nặng tối đa là bắt buộc',
    })
    .min(1, 'Cân nặng tối đa phải lớn hơn 1')
    .max(999, 'Cân nặng tối đa phải nhỏ hơn 999'),
  fromAge: z
    .number({
      required_error: 'Độ tuổi tối thiểu là bắt buộc',
      invalid_type_error: 'Độ tuổi tối thiểu là bắt buộc',
    })
    .min(1, 'Độ tuổi tối thiểu phải lớn hơn 1')
    .max(999, 'Độ tuổi tối thiểu phải nhỏ hơn 999'),
  toAge: z
    .number({
      required_error: 'Độ tuổi tối đa là bắt buộc',
      invalid_type_error: 'Độ tuổi tối đa là bắt buộc',
    })
    .min(1, 'Độ tuổi tối đa phải lớn hơn 1')
    .max(999, 'Độ tuổi tối đa phải nhỏ hơn 999'),
  quantity: z
    .number({
      invalid_type_error: 'Số lượng là bắt buộc',
      required_error: 'Số lượng là bắt buộc',
    })
    .min(1, 'Số lượng phải lớn hơn 1')
    .max(999, 'Số lượng phải nhỏ hơn 999'),
  style: z
    .array(z.object({ value: z.string(), label: z.string() }), {
      invalid_type_error: 'Phong cách là bắt buộc',
      required_error: 'Phong cách là bắt buộc',
    })
    .min(1, 'Phong cách là bắt buộc'),

  citizenship: z
    .enum(['ASIAN', 'AFRICAN', 'EUROPEAN', 'AMERICAN', 'VIETNAMESE'], {
      required_error: 'Citizenship là bắt buộc',
    })
    .default('ASIAN'),
  workLoad: z
    .number({
      required_error: 'Thời gian làm việc là bắt buộc',
      invalid_type_error: 'Thời gian làm việc là bắt buộc',
    })
    .min(1, 'Thời gian làm việc phải lớn hơn 1')
    .max(99999, 'Thời gian làm việc phải nhỏ hơn 99999'),
  description: z.string().trim().min(1, 'Mô tả là bắt buộc'),
  shootingDate: z
    .array(
      getZodDayjsAntd({
        messageInvalid: 'Thời gian làm việc không hợp lệ',
        messageRequired: 'Thời gian làm việc là bắt buộc',
      }),
      {
        required_error: 'Thời gian làm việc là bắt buộc',
        invalid_type_error: 'Thời gian làm việc là bắt buộc',
      }
    )
    .length(2, 'Thời gian làm việc là bắt buộc'),

  fitingTime: z
    .array(
      getZodDayjsAntd({
        messageInvalid: 'Thời gian thử đồ là bắt buộc',
        messageRequired: 'Thời gian thử đồ là bắt buộc',
      }),
      {
        required_error: 'Thời gian thử đồ là bắt buộc',
        invalid_type_error: 'Thời gian thử đồ là bắt buộc',
      }
    )
    .length(2, 'Thời gian thử đồ là bắt buộc')
    .min(1, 'Thời gian thử đồ là bắt buộc'),
});

export type CampaignRoleFormValues = z.infer<typeof campaignRoleValidationSchema>;
