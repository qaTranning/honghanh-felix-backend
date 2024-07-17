import { type UploadProps } from 'ant-design-vue';

export interface UploadImageProps extends /* @vue-ignore */ UploadProps {}

export interface UploadImageVadidateProps extends /* @vue-ignore */ UploadProps {
  value: UploadProps['fileList'];
}

export interface UploadImageVadidateEmits {
  (e: 'update:value', v: UploadProps['fileList']): void;
}
