import { message } from 'ant-design-vue';
import type { IResponseErrorApi } from '~/common/models';

export interface HandleMessagerCrudProps {
  loadingContent?: string;
  successContent?: string;
  errorContent?: string;
}

function handleMessageAndt(
  key: string,
  { loadingContent, successContent, errorContent }: HandleMessagerCrudProps
) {
  const onLoadMessager = (content?: string) => {
    message.loading({ content: content || loadingContent || 'Đang tải', key });
  };
  const onSuccessMessager = (content?: string) => {
    message.success({
      content: content || successContent || 'Thành công!',
      key,
      duration: 2,
    });
  };
  const onErrorMessager = (content?: string | IResponseErrorApi['messages']) => {
    let msg = '';

    if (Array.isArray(content)) {
      msg = content?.map((item) => item?.errors?.[0])?.join(', ') || '';
    } else {
      msg = content || errorContent || 'Thất bại!';
    }

    message.error({
      content: msg,
      key,
      duration: 2,
    });
  };

  return { onErrorMessager, onLoadMessager, onSuccessMessager };
}

export const MESSAGE_LIBS = { handleMessageAndt };
