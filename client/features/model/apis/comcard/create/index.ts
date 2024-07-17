import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { MESSAGE_LIBS, axiosClient } from '~/common/libs';
import { MODEL_FEATURE_NAME } from '~/features/model/constants';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface CreateComcardRequest {
  params: {
    id: number;
  };
  body: {
    first_name: string;
    last_name: string;
    height: string;
    weight: string;
    measurement: string;
    shirt: string;
    shoes: string;
    birth: string;
    images: string[];
  };
}
function createComcardRequest(req: CreateComcardRequest) {
  const { params, body } = req;
  const { id } = params;
  return axiosClient({
    baseURL: 'https://felix-comcard.zack.vn',
    method: 'POST',
    url: `/comcard/${id}`,
    data: body,
  });
}

interface IUseQueryCreateComcardProps {
  configs?: MutationConfig<typeof createComcardRequest>;
}

export function useCreateComcardMutation(props: IUseQueryCreateComcardProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    MODEL_FEATURE_NAME,
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComcardRequest,
    onMutate: () => {
      onLoadMessager('Đang tạo...');
    },
    onSuccess: (_, { params: { id } }) => {
      onSuccessMessager('Tạo comcard thành công');
      queryClient.invalidateQueries(allQueriesKeys.model.comcardDetail(id));
    },
    onError: (error) => {
      onErrorMessager(error?.messages || error.message);
    },
    ...configs,
  });

  return mutation;
}
