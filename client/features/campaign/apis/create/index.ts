import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { ICampaign } from '../../models';
import { CAMPAIGN_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';
interface ICreateCampaignRequest {
  body: object;
}

function createCampaignRequest(req: ICreateCampaignRequest) {
  const { body } = req;
  const formData = serialize(body, { indices: true });

  return requestApi<FormData, IResponseApi<ICampaign>>({
    method: 'POST',
    url: 'campaign/create',
    data: formData,
    isFormData: true,
  });
}

interface IUseCreateCampaignMutationProps {
  configs?: MutationConfig<typeof createCampaignRequest>;
}

export function useCreateCampaignMutation(props: IUseCreateCampaignMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const createCampaignMutation = useMutation({
    mutationFn: createCampaignRequest,
    onMutate: () => {
      onLoadMessager('Đang tạo chiến dịch...');
    },
    onSuccess: () => {
      onSuccessMessager('Tạo thành công!');
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return createCampaignMutation;
}
