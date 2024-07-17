import type { UploadFile } from 'ant-design-vue';
import type { FormContext } from 'vee-validate';
import type { LabeledValue } from 'ant-design-vue/lib/select';
import type { Key } from 'ant-design-vue/es/_util/type';
import { IMAGE_HELPER } from '..';
import type { LiteralUnion } from '~/common/models';

// form item for vee vadidate

type ModelType = LiteralUnion<'value' | 'checked' | 'file-list'>;

export function defineFormItemAndtBinds<D extends FormContext['defineComponentBinds']>(
  defineComponentBinds: D,
  key: Parameters<D>[0],
  model: ModelType = 'value'
) {
  const values = defineComponentBinds(key, (state) => ({
    model,
    props: {
      help: state.errors[0],
      validateStatus: state.errors[0] ? 'error' : undefined,
    },
  }));

  return values;
}

// images upload

export function handleImagesForm(values?: string[]): UploadFile[] {
  if (!values) {
    return [];
  }
  return values.map((item) => ({
    uid: item,
    name: item,
    status: 'done',
    url: IMAGE_HELPER.getUrlImageLow(item),
    thumbUrl: IMAGE_HELPER.getUrlImageLow(item),
  }));
}

export function handleImageForm(value?: string | null): UploadFile[] {
  return handleImagesForm(value ? [value] : []);
}

export function handleImagesForApi(
  value: { listImageForm: UploadFile[]; defaultValue?: string[] },
  config?: any
) {
  const { listImageForm, defaultValue } = value;

  // create
  if (!defaultValue) {
    const uploadImages = listImageForm.map((item) => item.originFileObj);

    return { uploadImages, deleteImages: [] };
  }

  // update

  const listNameUpload = listImageForm.map((item) => item.name);

  const deleteImages = defaultValue.filter((item) => !listNameUpload.includes(item));

  const uploadImagesFilter = listImageForm.filter((item) => !defaultValue.includes(item.name));

  const uploadImages = uploadImagesFilter.map((item) => item.originFileObj);

  return { uploadImages, deleteImages };
}

export function handleImageForApi(value: { listImageForm: UploadFile[]; defaultValue?: string }) {
  const { listImageForm, defaultValue } = value;

  const props = { listImageForm, defaultValue: defaultValue ? [defaultValue] : undefined };
  const { uploadImages, deleteImages } = handleImagesForApi(props);

  const uploadImage = uploadImages[0] || undefined;

  const deleteImage = deleteImages[0] || undefined;

  return { uploadImage, deleteImage };
}

export function handleInitialSelect<TData extends Partial<{ id: Key; name: string }>>(
  item?: TData,
  config?: {
    renderValue: (value: TData) => LabeledValue['value'];
    renderLabel: (value: TData) => LabeledValue['label'];
  }
): LabeledValue[] {
  if (!item) {
    return [];
  }
  if (!config) {
    return item ? [{ label: item?.name || '', value: item?.id || '' }] : [];
  } else {
    const { renderLabel, renderValue } = config;

    return [
      {
        value: renderValue(item),
        label: renderLabel(item),
      },
    ];
  }
}

export function handleInitialSelectMultiple<TData>(
  item: TData[],
  config: {
    renderValue: (value: TData) => LabeledValue['value'];
    renderLabel: (value: TData) => LabeledValue['label'];
  }
): LabeledValue[] {
  return item
    ? item.map((jitem) => ({
        value: config.renderValue(jitem),
        label: config.renderLabel(jitem),
      }))
    : [];
}

export function handleSelectForApiMultiple(props: {
  defaultValues?: LabeledValue[];
  values?: LabeledValue[];
}) {
  const { defaultValues, values } = props;

  if (!values) {
    return { creates: undefined, removes: undefined };
  }
  // create
  if (!defaultValues) {
    const creates = values.map((item) => item.value as string);
    const removes: string[] = [];
    return { creates, removes };
  }

  // update

  const nameValues = values.map((item) => item.value as string);
  const defaultNameValues = defaultValues.map((item) => item.value as string);

  const creates = nameValues.filter((item) => !defaultNameValues.includes(item));

  const removes = defaultNameValues.filter((item) => !nameValues.includes(item));
  return { creates, removes };
}

export function handleSelectForApi(props: {
  defaultValues?: LabeledValue[];
  values?: LabeledValue[];
}) {
  const { creates, removes } = handleSelectForApiMultiple(props);

  const create = creates ? creates[0] : undefined;
  const remove = removes ? removes[0] : undefined;

  return { create, remove };
}
