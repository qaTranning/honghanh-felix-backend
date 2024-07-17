import { useMutation } from '@tanstack/vue-query';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { type MutationConfig } from '~/queries';

const TYPES_NOTI = ['new_message'] as const;

interface SendNotiFCMRequest {
  body: {
    userId: number;
    type: (typeof TYPES_NOTI)[number];
    data: Record<string, any>;
  };
}

function sendNotiFCMRequest(req: SendNotiFCMRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<{}>>({
    method: 'POST',
    url: `/user/new-message`,
    data: body,
  });
}

interface UseSendNotiFCMMutationProps {
  configs?: MutationConfig<typeof sendNotiFCMRequest>;
}

export function useSendNotiFCMMutation(props: UseSendNotiFCMMutationProps = {}) {
  const { configs } = props;

  const mutation = useMutation({
    mutationFn: sendNotiFCMRequest,
    ...configs,
  });

  return mutation;
}
