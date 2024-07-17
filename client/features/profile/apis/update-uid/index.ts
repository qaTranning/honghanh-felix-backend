import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IProfile } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IprofileUpdateMutation {
  body: {
    uid: string;
  };
}

function profileUpdateUidMutation(req: IprofileUpdateMutation) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<IProfile>>({
    method: 'POST',
    url: 'user/create-user-uid',
    data: body,
  });
}
interface IMutationProps {
  configs?: MutationConfig<typeof profileUpdateUidMutation>;
}

export function useProfileUpdateUidMutation(props: IMutationProps = {}) {
  const { configs } = props;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: profileUpdateUidMutation,

    onSuccess: async (res) => {
      //   await queryClient.invalidateQueries({
      //     queryKey: allQueriesKeys.profile._def,
      //   });
    },
    ...configs,
  });

  return mutation;
}
