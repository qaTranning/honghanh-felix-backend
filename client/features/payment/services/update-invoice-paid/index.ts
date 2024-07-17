import type { UploadFile } from 'ant-design-vue';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useMutationUpdatePaidInvoice } from '../../apis/mutation-update-paid-invoice';
import { useFormZodSchema } from '~/common/form';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import type { IPayment } from '~/features/payment/models';
import { getZodDayjsAntd } from '~/common/validations';

export function useFormUpdateInvoicePaid({ invoice }: { invoice: IPayment }) {
  const { mutate } = useMutationUpdatePaidInvoice();

  const form = useFormZodSchema({
    schema,
    options: {
      initialValues: handleConvertInitialValues(invoice),
    },
  });

  const { handleSubmit, resetForm, handleReset, errors } = form;

  const onSubmit = handleSubmit((values) => {
    mutate({
      params: {
        id: invoice.id,
      },
      body: {
        referenceCode: values.referenceCode,
        image: ANDT_FORM_HELPER.handleImageForApi({
          listImageForm: values.image || [],
          defaultValue: invoice.image,
        }).uploadImage,
        paymentTime: values.paymentTime.format(),
      },
    });
  });

  return {
    form,
    handleSubmit,
    resetForm,
    handleReset,
    errors,
    onSubmit,
  };
}

const schema = z.object({
  referenceCode: z.string().optional(),

  image: z.array(z.custom<UploadFile>()).optional(),
  paymentTime: getZodDayjsAntd({
    messageInvalid: 'Thời gian thanh toán là bắt buộc',
    messageRequired: 'Thời gian thanh toán là bắt buộc',
  }),
});

type SchemaType = z.infer<typeof schema>;

const DEFAULT_VALUES: Partial<SchemaType> = {
  image: [],
  referenceCode: '',
  paymentTime: dayjs(),
};

function handleConvertInitialValues(invoice?: IPayment) {
  if (!invoice) return DEFAULT_VALUES;
  const { referenceCode, image, paymentTime = undefined } = invoice;

  return {
    referenceCode: referenceCode || '',
    image: ANDT_FORM_HELPER.handleImageForm(image),
    get paymentTime() {
      return paymentTime ? dayjs(paymentTime) : dayjs();
    },
  };
}
