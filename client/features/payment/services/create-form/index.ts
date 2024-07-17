import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useMutationCreatePayment } from '../../apis';
import { useFormZodSchema } from '~/common/form';
import { getZodDayjsAntd } from '~/common';

export function useCreatePaymentForm() {
  const { mutateAsync } = useMutationCreatePayment({});

  const form = useFormZodSchema({
    schema: createPaymentSchema,
    options: {
      initialValues: { ...DEFAULT_VALUE },
    },
  });

  const { handleSubmit } = form;

  const { push } = useRouter();
  function showConfirmCreate(values: CreatePaymentSchemaType) {
    const { campaignRoleId, modelId, workingHours, salary } = values;

    Modal.confirm({
      title: 'Bạn muốn tạo thanh toán này',
      icon: createVNode(ExclamationCircleOutlined),
      async onOk() {
        const getValueStringFormNumber = (value: number | undefined) => {
          if (!value) return '0';

          if (Number(value) < 0) return '0';

          return String(value);
        };

        const workingHoursValue = workingHours
          ? workingHours?.map((wh) => {
              const [startDate, endDate] = wh;
              return {
                startDate: dayjs(startDate).toDate(),
                endDate: dayjs(endDate).toDate(),
              };
            })
          : [];

        const body = {
          workingHours: workingHoursValue,
          salary: getValueStringFormNumber(salary),
          campaignRoleId,
          modelId,
        };

        try {
          const res = await mutateAsync({
            body,
          });

          return push({
            name: 'data-payment-detail',
            query: { id: res.data.id.toString() },
          });
        } catch {
          return console.log('Oops errors!');
        }
      },
    });
  }

  const onSubmit = handleSubmit(async (values) => {
    const { ...tValues } = values;

    return showConfirmCreate({ ...tValues });
  });

  return { onSubmit, ...form };
}

const getWorkingHoursField = () => {
  const messageRequired = 'Thời gian làm việc là bắt buộc';

  const schema = z.array(
    z
      .array(
        getZodDayjsAntd({
          messageRequired,
        }),
        {
          required_error: messageRequired,
          invalid_type_error: messageRequired,
        }
      )
      .min(2, {
        message: messageRequired,
      }),
    {
      invalid_type_error: messageRequired,
      required_error: messageRequired,
    }
  );
  return schema;
};
export const createPaymentSchema = z.object({
  campaignRoleId: z.number().int().positive(),
  modelId: z.number().int().positive(),
  // workingHours: z
  //   .number()
  //   .int()
  //   .positive()
  //   .min(1, 'Số giờ làm việc phải lớn hơn 0')
  //   .max(999, 'Số giờ làm việc tối đa là 999'),
  workingHours: getWorkingHoursField(),
  description: z.string().max(1000).optional(),
  currency: z.string().optional(),
  salary: z.number().optional(),
  // otSalary: z.number().optional(),
  // imageLicenseFee: z.number().optional(),
});
export type CreatePaymentSchemaType = z.infer<typeof createPaymentSchema>;

const DEFAULT_VALUE: Partial<CreatePaymentSchemaType> = {
  workingHours: [[] as any] as const,
  description: '',
  currency: 'VND',
  salary: 0,
};
