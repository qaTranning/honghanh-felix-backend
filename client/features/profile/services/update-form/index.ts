import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useProfileUpdateMutation, type IProfileUpdateInput } from '../../apis/update';
import { useQueryProfile } from '../../apis';
import type { IProfile } from '../../models';
import { FORM_HELPER } from '~/common';

export function useProfileUpdateform() {
  //   query
  const { data, isLoading } = useQueryProfile();
  //   mutate
  const { mutate } = useProfileUpdateMutation({});

  //   form
  const initialValues = computed(() =>
    data.value?.data ? convertInitial(data.value?.data) : { ...DEFAULT_VALUE }
  );

  watch(data, () => {
    if (data.value?.data) {
      form.resetForm({ values: convertInitial(data.value?.data) });
    }
  });

  const { handleSubmit, isFieldDirty, ...form } = useForm({
    validationSchema,
    initialValues: initialValues.value,
    keepValuesOnUnmount: false,
  });

  const onSubmit = handleSubmit((values) => {
    FORM_HELPER.handlePayloadUpdateForm(values, isFieldDirty, (payload) => {
      const body = { ...payload };
      mutate({ body });
    });
  });

  const isSubmit = computed(() => !FORM_HELPER.handlePayloadUpdateForm(form.values, isFieldDirty));

  return { initialValues, onSubmit, isSubmit, data, isLoading, ...form };
}

// config
const validationSchema = yup.object().shape({
  firstname: yup.string().max(128).trim().required().label('Firstname'),
  lastname: yup.string().max(128).trim().required().label('Lastname'),
});
interface IProfileUpdateForm
  extends Pick<
    IProfileUpdateInput,
    'firstname' | 'lastname' | 'address' | 'city' | 'oldPassword' | 'password'
  > {}
const DEFAULT_VALUE: IProfileUpdateForm = {
  firstname: '',
  lastname: '',
  address: '',
  city: '',
};

function convertInitial(data: IProfile): IProfileUpdateForm {
  const { firstname, lastname, address, city } = data;
  return { firstname, lastname, address, city };
}

export type UseProfileUpdateformType = ReturnType<typeof useProfileUpdateform>;
