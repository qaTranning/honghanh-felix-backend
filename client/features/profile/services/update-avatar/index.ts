import { useProfileUpdateMutation } from '../../apis/update';
import { PROFILE_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS } from '~/common/libs';

export function useProfileUpdateAvatar() {
  const { onLoadMessager, onSuccessMessager } = MESSAGE_LIBS.handleMessageAndt(
    PROFILE_FEATURE_NAME,
    {}
  );

  //   mutate
  const { mutate } = useProfileUpdateMutation({
    configs: {
      onMutate: () => {
        onLoadMessager('Đang cập nhật avatar');
      },
      onSuccess: () => {
        onSuccessMessager('Cập nhật avatar thành công');
      },
    },
  });

  function onUpdateAvatar(avatar: File) {
    mutate({ body: { avatar } });
  }

  return { onUpdateAvatar };
}
