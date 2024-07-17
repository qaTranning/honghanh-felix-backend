import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { ICampaign } from '../../campaigns';
import { CAMPAIGN_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/campaigns';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface UpdateCampaignRequest {
  body: {
    status: string;
  };
  params: {
    id: number;
  };
}

// 'PROCESSING', 'PENDING', 'COMPLETED', 'CANCELED', 'WAITING_PAYMENT', 'PAID'

function onMutate(req: UpdateCampaignRequest) {
  const { body, params } = req;

  return requestApi<typeof body, IResponseApi<ICampaign>>({
    method: 'PATCH',
    url: `/campaign-role/update-status`,
    data: body,
    params: {
      id: params.id,
    },
  });
}

interface UseUpdateCampaignMutationProps {
  configs?: MutationConfig<typeof onMutate>;
}

export function useUpdateStatusCampaignRoleMutation(props: UseUpdateCampaignMutationProps = {}) {
  const { configs } = props;
  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const { mutateAsync, ...mutation } = useMutation({
    mutationFn: onMutate,
    onMutate() {
      onLoadMessager('Đang cập nhật trạng thái...');
    },
    async onSuccess(_, { body, params }) {
      await queryClient.invalidateQueries(allQueriesKeys.campaign.role);
      //   queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      onSuccessMessager('Cập nhật trạng thái thành công!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  function onMutateAsync({ status, id }: { status: string; id: number }) {
    return mutateAsync({ body: { status }, params: { id } });
  }

  return { onMutateAsync, ...mutation };
}
