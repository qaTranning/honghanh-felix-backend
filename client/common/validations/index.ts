import type { UploadFile } from 'ant-design-vue';
import { Dayjs, isDayjs } from 'dayjs';
import { z } from 'zod';

interface GetZodDayjsAntdParams {
  messageRequired?: string;
  messageInvalid?: string;
}

export const getZodDayjsAntd = (params: GetZodDayjsAntdParams = {}) => {
  const { messageRequired = 'Required', messageInvalid = 'Invalid' } = params;

  return z.custom<Dayjs>().superRefine((value, ctx) => {
    if (!value) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messageRequired,
      });
    }
    if (!isDayjs(value)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messageInvalid || messageRequired,
      });
    }
  });
};

export const getZodFileAntd = () => {
  return z.array(z.custom<UploadFile>());
};
