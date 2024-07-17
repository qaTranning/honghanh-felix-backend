import { z } from 'zod';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { useMutationUpdatePayment } from '../../apis';
import type { IPayment } from '../../models';
import { createPaymentSchema } from '../create-form';
import { useFormZodSchema } from '~/common/form';

export function useUpdatePaymentForm({ payment }: { payment: ComputedRef<IPayment | undefined> }) {
  const { mutateAsync, ...mutation } = useMutationUpdatePayment({});

  const form = useFormZodSchema({
    schema,
    options: {
      initialValues: { ...DEFAULT_VALUE },
    },
  });
  const { handleSubmit, resetForm } = form;

  const onSubmit = handleSubmit(async (values) => {
    const { penaltyFee, bonusFees, ...tValues } = values;

    if (!payment.value?.id) {
      return;
    }

    const getValueStringFormNumber = (value: number | undefined) => {
      if (!value) return '0';

      if (Number(value) < 0) return '0';

      return String(value);
    };

    const getWorkingHours = () => {
      if (!tValues?.workingHours) {
        return [];
      }

      return (tValues.workingHours || []).map((wh) => {
        const [startDate, endDate] = wh;
        return {
          startDate: dayjs(startDate).toDate(),
          endDate: dayjs(endDate).toDate(),
        };
      });
    };

    try {
      await mutateAsync(
        {
          body: {
            // image: uploadImage,
            salary: getValueStringFormNumber(tValues.salary),
            // otSalary: getValueStringFormNumber(tValues.otSalary),
            // imageLicenseFee: getValueStringFormNumber(tValues.imageLicenseFee),
            penaltyFee,
            workingHours: getWorkingHours(),
            bonusFees,
          },
          params: { id: payment.value.id },
        },
        {
          onSuccess: () => {},
        }
      );
    } catch (error) {}
  });

  function onResetForm(payment: IPayment) {
    resetForm({ values: convertInitial(payment) });
  }

  return { onSubmit, onResetForm, ...mutation, ...form };
}

const schema = createPaymentSchema.extend({
  penaltyFee: z.array(z.any()),
  bonusFees: z.array(z.any()),

  // image: z.array(z.custom<UploadFile>()),
});

type UpdateInvoiceSchemaType = z.infer<typeof schema>;

const DEFAULT_VALUE: Partial<UpdateInvoiceSchemaType> = {
  workingHours: [],
  description: '',
  // image: [],
  currency: 'VND',
  salary: undefined,
  // otSalary: undefined,
  campaignRoleId: undefined,
  modelId: undefined,
  // imageLicenseFee: undefined,
  penaltyFee: [],
  bonusFees: [],
};

function convertInitial(data: IPayment): Partial<UpdateInvoiceSchemaType> {
  function getWorkingHours() {
    if (!data?.workingHours) {
      return [];
    }

    return (data.workingHours || []).map((wh) => {
      return [dayjs(new Date(wh.startDate)), dayjs(new Date(wh.endDate))];
    }) as UpdateInvoiceSchemaType['workingHours'];
  }

  const campaignRoleId = data?.campaignRole?.id || undefined;
  const modelId = data?.model?.id || undefined;
  // const numberOtSalary = data?.otSalary ? +data.otSalary : 0;
  const numberSalary = data?.salary ? +data.salary : 0;
  const currency = data?.currency || undefined;
  const workingHours = getWorkingHours();
  const description = data?.description || undefined;
  const penaltyFee = data?.penaltyFee || [];
  const bonusFees = data?.bonusFees || [];

  // const imageLicenseFee = Number(data?.imageLicenseFee || 0);
  // const image = ANDT_FORM_HELPER.handleImageForm(data.image);

  return {
    description,
    salary: numberSalary,
    // otSalary: numberOtSalary,
    // penaltyFee: convertPenaltyFeeToArray(penaltyFee),
    campaignRoleId,
    modelId,
    penaltyFee,
    currency,
    workingHours,
    // imageLicenseFee,
    bonusFees,
  };
}
