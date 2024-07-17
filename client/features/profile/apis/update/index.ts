import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IProfile } from '../../models';
import { PROFILE_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IprofileUpdateMutation {
  body: Partial<IProfileUpdateInput>;
}

export interface IProfileUpdateInput
  extends Partial<Pick<IProfile, 'firstname' | 'lastname' | 'address' | 'city'>> {
  oldPassword?: string;
  password?: string;
  avatar?: File;
}

export function profileUpdateMutation(req: IprofileUpdateMutation) {
  const { body } = req;

  const data = new FormData();

  for (const [k, v] of Object.entries(body)) {
    data.append(k, v);
  }
  return requestApi<typeof data, IResponseApi<IProfile>>({
    method: 'PATCH',
    url: 'profile-staff',
    data,
    isFormData: true,
  });
}
interface IMutationProps {
  configs?: MutationConfig<typeof profileUpdateMutation>;
}

export function useProfileUpdateMutation(props: IMutationProps = {}) {
  const { configs } = props;
  const { t } = useI18n();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    PROFILE_FEATURE_NAME,
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: profileUpdateMutation,
    onMutate: ({ body }) => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (res) => {
      onSuccessMessager('Cập nhật thành công');
      await queryClient.invalidateQueries({
        queryKey: allQueriesKeys.profile._def,
      });
    },
    ...configs,
  });

  return mutation;
}
