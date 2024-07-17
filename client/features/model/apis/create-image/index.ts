import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  body: { modelId: number; image: File[] };
}

function onMutate(req: IRequest) {
  const { body } = req;

  const formData = serialize(body, { noFilesWithArrayNotation: true });

  return requestApi<typeof formData, IResponseApi<any>>({
    method: 'POST',
    url: `/model/admin-create-image`,
    isFormData: true,
    data: formData,
  });
}
interface IProps {
  configs?: MutationConfig<typeof onMutate>;
}

export function useMutationCreateImageModel(props: IProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'MODEL_FEATURE_NAME',
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onMutate,
    onMutate() {
      onLoadMessager('Updating model...');
    },
    async onSuccess(_, { body: { modelId } }) {
      onSuccessMessager('Model updated!');

      queryClient.invalidateQueries(allQueriesKeys.user.detail(modelId));
      queryClient.invalidateQueries(allQueriesKeys.user.list);
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return { ...mutation };
}
