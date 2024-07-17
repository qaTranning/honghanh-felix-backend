<!-- eslint-disable no-useless-return -->
<template>
  <div>
    <div class="avatar-upload-main">
      <div>
        <div ref="editBox" class="avatar-upload-edit" :style="editBoxSizeStyle as any">
          <div class="edit-fade" />
          <div ref="select" class="edit-select" :style="selectBoxStyle">
            <span class="edit-selcet-img-box">
              <img
                :src="avatar"
                alt=""
                :style="selsctImgStyle"
                class="edit-select-img"
                @dragstart.prevent=""
                @select.prevent=""
              />
            </span>
            <span class="edit-selcet-border border-3-white" />
            <span v-show="!props.disableSelect" ref="resize" class="select-zoom-point" />
          </div>
          <img
            ref="bgAvatar"
            :src="avatar"
            alt=""
            :style="bgImgStyle"
            class="edit-bg"
            @dragstart.prevent=""
            @select.prevent=""
          />
        </div>
        <div class="avatar-upload-operation">
          <span style="cursor: pointer" @click="file!.click()">Đổi avatar</span>
          <span style="cursor: pointer" class="upload-operation-close" @click="updateRotate">
            <template v-if="props.rotate">
              <svg
                t="1649489582570"
                class="icon-rotate"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3047"
                width="16"
                height="16"
              >
                <path
                  d="M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z"
                  p-id="3048"
                />
              </svg>
              <span>Quay</span>
            </template>
          </span>
        </div>
      </div>
      <div v-if="props.showPreview" class="avatar-upload-preview">
        <span>Xem trước</span>
        <div class="preview-radius border-3-white" :style="previewBoxSizeStyle">
          <img
            :src="avatar"
            alt=""
            :style="previewImgStyle"
            @dragstart.prevent=""
            @select.prevent=""
          />
        </div>
        <div class="preview-square border-3-white" :style="previewBoxSizeStyle">
          <img
            :src="avatar"
            alt=""
            :style="previewImgStyle"
            @dragstart.prevent=""
            @select.prevent=""
          />
        </div>
      </div>
    </div>

    <div class="flex flex-row justify-center space-x-4 pt-4">
      <a-button @click="props.onClose">
        <div v-if="!slots.cancel" class="avatar-button -regular">Hủy</div>
        <slot name="cancel" />
      </a-button>
      <a-button type="primary" :disabled="!avatar" @click="upload">
        <div v-if="!slots.confirm" class="avatar-button -salmon">Lưu</div>
        <slot name="confirm" />
      </a-button>
    </div>
    <div v-show="false">
      <input
        ref="file"
        type="file"
        :name="props.field"
        :accept="props.accept"
        class="hidden"
        @input="changeFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef, Ref, StyleValue } from 'vue';
import { computed, nextTick, reactive, ref, useSlots, watch } from 'vue';
import { message } from 'ant-design-vue';
import { createCutImg, getRange } from '../utils';
import type {
  MRef,
  RefElement,
  Size,
  SizeStyle,
  AvatarCropperProps,
  AvatarCropperEmits,
} from '../models';
import { useBackImgOperate, useSelectOperate } from '../hooks/use-operate';

const props = withDefaults(defineProps<AvatarCropperProps>(), {
  avatar: '',
  url: '',
  field: 'avatar',
  width: 300,
  height: 300,
  withCredentials: false,
  selectSize: 300,
  accept: 'image/*',
  method: 'POST',
  fixed: true,
  rotate: true,
  disableSelect: false,
  format: 'png',
  lang: 'zh-CN',
  showPreview: true,
  previewSize: 100,
});

const emits = defineEmits<AvatarCropperEmits>();

const slots = useSlots();
const avatar: Ref<string> = ref(props.avatar);
watch(
  () => props.avatar,
  (v) => {
    avatar.value = v;
    initImgSize();
  }
);

watch(avatar, (v) => {
  emits('update:avatar', v);
});
// 编辑框尺寸不是响应式的

const {
  width: editBoxWidth,
  height: editBoxHeight,
  selectSize,
  previewSize,
  disableSelect,
} = props;
const initSelectSize =
  selectSize < Math.min(props.width, props.height)
    ? selectSize
    : Math.min(props.width, props.height);
// 编辑器尺寸style
const editBoxSizeStyle: SizeStyle = {
  width: `${editBoxWidth}px`,
  height: `${editBoxHeight}px`,
};
// 图片尺寸 图片加载完之前默认为编辑器尺寸
const imgSize: Size = reactive({
  width: editBoxWidth,
  height: editBoxHeight,
});
// 头像图片element
const bgAvatar: MRef<HTMLImageElement> = ref(null);
// 图片改动就重置尺寸
watch(
  bgAvatar,
  () => {
    if (bgAvatar.value?.width) initImgSize();
  },
  {
    immediate: true,
  }
);
// 编辑器最外层element 确定拖拽和滚动的范围
const editBox: RefElement = ref(null);
// 背景图片的操作 包括缩放、旋转、移动
const { bgImgZoom, baImgX, baImgY, bgImgStyle, imgRotate, updateRotate } = useBackImgOperate(
  editBox,
  imgSize
);
// 把图片变为object-fit: cover;的形式 填充满不拉伸
function initImgSize() {
  // 挂载dom之后才能获得正确的宽高
  nextTick(() => {
    const el = bgAvatar.value!;
    // 图片加载完后才能获取宽高
    el.onload = () => {
      const width = el.naturalWidth;
      const height = el.naturalHeight;
      if (width / height > editBoxWidth / editBoxHeight) {
        bgImgZoom.value = editBoxHeight / height;
        imgSize.height = height;
        imgSize.width = width;
      } else {
        bgImgZoom.value = editBoxWidth / width;
        imgSize.height = height;
        imgSize.width = width;
      }
      baImgX.value = 0;
      baImgY.value = 0;
    };
  });
}
// 选择框
const select: RefElement = ref(null);
// 调整选择器大小按钮
const resize: RefElement = ref(null);
// 选择框的操作 包括缩放、移动
const { selectBoxSize, selectBoxStyle, selectX, selectY } = useSelectOperate({
  initSize: initSelectSize,
  select,
  resize,
  bgBoxSize: { width: editBoxWidth, height: editBoxHeight },
  limitSize: { width: editBoxWidth, height: editBoxHeight },
  disable: disableSelect,
});
// 选择框内图片的样式
const selsctImgStyle: ComputedRef<StyleValue> = computed(() => {
  return {
    width: `${imgSize.width * bgImgZoom.value}px`,
    height: `${imgSize.height * bgImgZoom.value}px`,
    left: `${baImgX.value - selectX.value}px`,
    top: `${baImgY.value - selectY.value}px`,
    transform: `rotate(${imgRotate.value}deg)`,
  };
});
const previewBoxSizeStyle: ComputedRef<StyleValue> = computed(() => {
  return {
    width: `${previewSize}px`,
    height: `${previewSize}px`,
  };
});
// 预览图片的样式
const previewImgStyle: ComputedRef<StyleValue> = computed(() => {
  const zoom = previewSize / selectBoxSize.value;
  return {
    width: `${imgSize.width * zoom * bgImgZoom.value}px`,
    height: `${imgSize.height * zoom * bgImgZoom.value}px`,
    left: `${(baImgX.value - selectX.value) * zoom}px`,
    top: `${(baImgY.value - selectY.value) * zoom}px`,
    transform: `rotate(${imgRotate.value}deg)`,
  };
});

const file: MRef<HTMLInputElement> = ref(null);
function changeFile(e: Event) {
  const file = e.target as HTMLInputElement;
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const url = (e.target as FileReader).result;
    if (url) {
      avatar.value = url as string;
      initImgSize();
    }
    file.value = '';
  };
  reader.readAsDataURL(file.files![0]);
}
async function upload() {
  try {
    const formData = new FormData();

    const blob = await getImgData();
    const format = props.format;
    formData.append(props.field, blob, `avatar.${format}`);
    const data = props.data || {};
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const file = new File([blob], `avatar.${format}`, {
      type: `image/${format}`,
    });

    if (props.onCustomRequest) {
      props.onCustomRequest(file);
      return;
    }
    if (props.onBefoureUpload) {
      await props.onBefoureUpload(file);
    }
  } catch (error) {
    message.error('Upload error');
  }
}
const cutImg = createCutImg();
function getImgData() {
  const range = getRange(
    {
      left: selectX.value,
      top: selectY.value,
      width: selectBoxSize.value,
      height: selectBoxSize.value,
    },
    {
      left: baImgX.value,
      top: baImgY.value,
      width: imgSize.width,
      height: imgSize.height,
      zoom: bgImgZoom.value,
    }
  );
  return cutImg(avatar.value, range, props.format);
}
</script>

<style scoped lang="scss">
.avatar-upload-root {
  --fixed-fade-z-index: 999;
  --fixed-main-z-index: 1000;
  img {
    max-width: unset;
    max-height: unset;
  }
}

.avatar-upload-root-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  justify-content: center;
  display: flex;
  align-items: center;
}
.avatar-upload-fade {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: var(--fixed-z-index);
}
.avatar-upload {
  border-radius: 10px;
  background-color: #fff;
  padding: 5px 15px;
  user-select: none;
  z-index: var(--fixed-main-z-index);
  .border-3-white {
    border: 3px solid #fff;
  }
}
.avatar-upload-fixed {
  position: fixed;
}
.avatar-upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  .avatar-upload-close {
    font-size: 18px;
    cursor: pointer;
  }
}
.avatar-upload-main {
  padding: 10px;
  display: flex;
  justify-content: center;
  .edit-fade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
  }
}
.avatar-upload-edit {
  position: relative;
  cursor: move;
  margin-right: 10px;
  overflow: hidden;
  background-image: url('./no.png');
  background-repeat: repeat;
  .edit-select {
    position: absolute;
    border-radius: 50%;
    cursor: move;
    z-index: 3;
    background-color: #e1e2e2;
    .select-zoom-point {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      left: 84%;
      top: 84%;
      cursor: se-resize;
    }
    .edit-selcet-border {
      position: absolute;
      display: block;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      border-radius: 50%;
      box-sizing: border-box;
      top: -2px;
      left: -2px;
    }
    /*  不要让选择框有边框 会影响计算位置 因此另外造一个当边框*/
    .edit-selcet-img-box {
      overflow: hidden;
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .edit-select-img {
      user-select: none;
      display: block;
      position: absolute;
    }
  }
}
.edit-bg {
  user-select: none;
  display: block;
  position: absolute;
  z-index: 2;
  cursor: move;
}
.avatar-upload-preview {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: #f2f2f2;
  padding: 0 10px;
  margin-bottom: 20px;
  font-size: 14px;
  .preview-radius {
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    & > img {
      position: absolute;
    }
  }
  .preview-square {
    overflow: hidden;
    position: relative;
    & > img {
      position: absolute;
    }
  }
}
.avatar-upload-operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: red;
  height: 20px;
  margin-right: 10px;
}
.upload-operation-close {
  display: flex;
  align-items: center;
}
.icon-rotate {
  color: red;
  fill: currentColor;
}
.avatar-upload-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  .avatar-button {
    display: flex;
    overflow: hidden;
    margin: 10px;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: all 150ms linear;
    text-align: center;
    white-space: nowrap;
    text-decoration: none !important;
    text-transform: none;
    text-transform: capitalize;
    color: #fff;
    border: 0 none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    justify-content: center;
    align-items: center;
    flex: 0 0 160px;
    box-shadow: 2px 5px 10px #e4e4e4;
    &:hover {
      transition: all 150ms linear;
      opacity: 0.85;
    }
    &:active {
      transition: all 150ms linear;
      opacity: 0.75;
    }
    &:focus {
      outline: 1px dotted #959595;
      outline-offset: -4px;
    }
  }
  .avatar-button.-regular {
    color: #202129;
    background-color: #f2f2f2;

    &:hover {
      color: #202129;
      background-color: #e1e2e2;
      opacity: 1;
    }

    &:active {
      background-color: #d5d6d6;
      opacity: 1;
    }
  }
  .avatar-button.-salmon {
    color: #ffffff;
    background: #f32c52;
  }
}
</style>
