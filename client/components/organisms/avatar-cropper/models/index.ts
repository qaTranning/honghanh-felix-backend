import type { Ref } from 'vue';

export interface Size {
  width: number;
  height: number;
}
export interface SizeStyle {
  width: string;
  height: string;
}
export interface Position {
  left: number;
  top: number;
}
export interface PositionStyle {
  left: string;
  top: string;
}
export type Rotate = 0 | 90 | 180 | 270;
export interface Rectangle {
  width: number;
  height: number;
  left: number;
  top: number;
  zoom?: number;
  rotate?: Rotate;
}
export interface Range {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}
export type MRef<T> = Ref<T | null>;
export type RefElement = MRef<HTMLElement>;

export interface AvatarCropperProps {
  /**
   * @description 初始图像src init img src
   */
  avatar?: string;
  /**
   * @description 图片上传地址 upload url
   */
  url?: string;
  /**
   * @description 图片上传字段名 upload field name
   */
  field?: string;
  /**
   * @description 图片上传格式 upload file type
   */
  format?: string;
  /**
   * @description 上传携带请求头 http request headers
   */
  headers?: Record<string, string>;
  /**
   * @description 上传携带其他数据 http request data
   */
  data?: Record<string, string>;
  /**
   * @description 图片框宽度  img box width
   */
  width?: number;
  /**
   * @description 图片框长度  img box height
   */
  height?: number;
  /**
   * @description  选择框初始大小 init select box size
   */
  selectSize?: number;
  /**
   * @description 是否跨域携带携带cookie cross domain with cookie
   */
  withCredentials?: boolean;
  /**
   * @description 上传方法 upload method
   */
  method?: 'POST' | 'GET';
  /**
   * @description 接受的文件类型 accept file type
   */
  accept?: string;
  /**
   * @description 是否可以旋转 can rotate
   */
  rotate?: boolean;
  /**
   * @description 是否静止用户操作选择框 whether to still user operation selection box
   */
  disableSelect?: boolean;
  /**
   * @description 是否fixed  is fixed
   */
  fixed?: boolean;
  /**
   * @description 是否展示预览 is show preview
   */
  showPreview?: boolean;
  /**
   * @description 预览框大小 preview box size
   */
  previewSize?: number;
  /**
   * @description 自定义文字 i18n
   */
  /**
   * @description 语言 language
   */
  lang?: 'zh-CN' | 'zh-TW' | 'en';
  /**
   * @description 自定义上传  custom upload
   */
  onCustomRequest?: (file: File) => void;
  /**
   * @description 上传前钩子 返回false可以阻止上传 upload before callback if return false can prevent upload
   */
  onBefoureUpload?: (file: File) => boolean | Promise<boolean>;
  /**
   * @description 上传成功钩子 upload success callback
   */
  onSuccess?: (respose: any, file: File) => void;
  /**
   * @description 上传失败钩子 upload fail callback
   */
  onError?: (err: Error, file: File) => void;
  /**
   * @description 点击关闭按钮 click close button
   */
  onClose?: () => void;
}

export interface AvatarCropperEmits {
  (e: 'update:avatar', value: string): void;
}

// avatar cropper upload

export interface ShAvatarCropperUploadProps {
  cropper: AvatarCropperProps;
}
