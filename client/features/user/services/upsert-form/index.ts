import { useCreateUserMutation, useGetDetailUserQuery, useUpdateUserMutation } from '../../apis';
import type { IUser } from '../../models';
import { userSchemaValidation } from './validations';
import { useFormZodSchema } from '~/common/form';

export function useUpsertFormUser() {
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();

  const { query, currentUserId } = useGetDetailUserQuery();

  const { data } = query;

  const result = computed(() => data.value?.data as IUser | undefined);

  const form = useFormZodSchema({
    schema: userSchemaValidation,
    options: {
      initialValues: {
        role: 'MODEL',
      },
    },
  });

  const { handleSubmit, resetForm, handleReset } = form;

  watch(data, () => {
    const user = data.value?.data;

    resetForm({
      values: {
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        role: user?.role || undefined,
        // phone: user?.phone || '',
        // dob: user?.dob ? dayjs(user.dob) : undefined,
      },
    });
  });

  const onSubmit = handleSubmit((values) => {
    const body = {
      ...values,
      // dob: values.dob?.toDate(),
    };

    if (currentUserId.value) {
      updateUserMutation.mutate({ userId: currentUserId.value, body });

      return;
    }

    createUserMutation.mutate(
      { body },
      {
        async onSuccess(res) {
          const newUserId = res.data?.id;
          const dataNavigate = newUserId
            ? {
                name: 'data-user-update',
                query: { id: newUserId },
              }
            : {
                name: 'data-user',
              };

          await navigateTo(dataNavigate);
        },
      }
    );
  });

  async function handleCancel() {
    handleReset();
    await navigateTo({ name: 'data-user' });
  }

  return {
    currentUserId,
    query,
    result,
    handleCancel,
    ...form,
    onSubmit,
  };
}
