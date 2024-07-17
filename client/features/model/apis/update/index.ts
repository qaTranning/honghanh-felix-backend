import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { IModel } from '../../models';
import { MODEL_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface UpdateModelRequest {
  modelId: number;
  body: object;
}

function updateModelRequest(req: UpdateModelRequest) {
  const { modelId, body } = req;

  const formData = serialize(body, { indices: true });

  return requestApi<typeof formData, IResponseApi<IModel>>({
    method: 'PATCH',
    url: `/user/upsert-model`,
    isFormData: true,
    params: {
      id: modelId,
    },
    data: formData,
  });
}

interface UseUpdateModelMutationProps {
  configs?: MutationConfig<typeof updateModelRequest>;
}

export function useUpdateModelMutation(props: UseUpdateModelMutationProps = {}) {
  const { configs } = props;
  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    MODEL_FEATURE_NAME,
    {}
  );

  const mutation = useMutation({
    mutationFn: updateModelRequest,
    onMutate() {
      onLoadMessager('Updating model...');
    },
    async onSuccess(res) {
      const modelId = res.data?.id;
      await Promise.all([
        modelId && queryClient.invalidateQueries(allQueriesKeys.user.detail(modelId)),
        queryClient.invalidateQueries(allQueriesKeys.user.list),
      ]);

      onSuccessMessager('Model updated!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return mutation;
}
