import type { ComputedRef, Ref, StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { getProjectionLength } from '../../utils';
import type { RefElement, Rotate, Size } from '../../models';
import { useDraggable } from '../use-draggable';
import { useWheel } from '../use-wheel';
const WHEEL_ZOOM = 0.02;
// 背景图片操作 包括拖拽、缩放、旋转
export function useBackImgOperate(editBox: RefElement, imgSize: Size) {
  // 图片滚轮调整大小
  useWheel(editBox, updateBgImgZoom);
  const bgImgZoom = ref(1);
  function updateBgImgZoom(delta: number) {
    bgImgZoom.value += delta > 0 ? WHEEL_ZOOM : -WHEEL_ZOOM;
  }
  // 旋转角度
  const imgRotate: Ref<Rotate> = ref(0);
  function updateRotate() {
    imgRotate.value = ((imgRotate.value + 90) % 360) as Rotate;
  }
  // 拖动图片
  const { style: editPositionStyle, x: baImgX, y: baImgY } = useDraggable(editBox);
  const bgImgStyle = computed(() => {
    return {
      ...editPositionStyle.value,
      width: `${imgSize.width * bgImgZoom.value}px`,
      height: `${imgSize.height * bgImgZoom.value}px`,
      transform: `rotate(${imgRotate.value}deg)`,
    };
  });
  return {
    bgImgZoom,
    editPositionStyle,
    baImgX,
    baImgY,
    bgImgStyle,
    imgRotate,
    updateRotate,
  };
}

export interface useSelectOperateProps {
  initSize: number;
  select: RefElement;
  resize: RefElement;
  limitSize: Size;
  bgBoxSize: Size;
  disable?: boolean;
}
export function useSelectOperate(props: useSelectOperateProps) {
  const { initSize, select, resize, limitSize, disable = false, bgBoxSize } = props;
  const selectBoxSize = ref(initSize);
  // 监听resize按钮移动
  const { x: resizeX, y: resizeY, clear: clearResize } = useDraggable(resize);
  // 限制范围
  const selectRange = {
    x: {
      min: 0,
      max: limitSize.width - selectBoxSize.value,
    },
    y: {
      min: 0,
      max: limitSize.height - selectBoxSize.value,
    },
  };
  // 更新范围
  function updateSelectRange() {
    selectRange.x.max = limitSize.width - selectBoxSize.value;
    selectRange.y.max = limitSize.height - selectBoxSize.value;
  }
  // 拖动选框
  const {
    style: selectPositionStyle,
    x: selectX,
    y: selectY,
    setPosition,
    clear: clearSelect,
  } = useDraggable(select, {
    range: selectRange,
  });
  // 选框大小位置style
  const selectBoxStyle: ComputedRef<StyleValue> = computed(() => {
    return {
      width: `${selectBoxSize.value}px`,
      height: `${selectBoxSize.value}px`,
      ...selectPositionStyle.value,
    };
  });
  // 限制选框大小
  function updateSelectSize() {
    if (selectBoxSize.value + selectX.value > limitSize.width)
      selectBoxSize.value = limitSize.width - selectX.value;
    if (selectBoxSize.value + selectY.value > limitSize.height)
      selectBoxSize.value = limitSize.height - selectY.value;
  }
  // 监听选框大小改变 更新限制范围
  watch([resizeX, resizeY], (newV, oldV) => {
    const sizeChangeX = newV[0] - oldV[0];
    const sizeChangeY = newV[1] - oldV[1];
    const sizeChange = getProjectionLength([sizeChangeX, sizeChangeY], [1, 1]);
    selectBoxSize.value = selectBoxSize.value + sizeChange;
    selectBoxSize.value = selectBoxSize.value <= 0 ? 0 : selectBoxSize.value;
    updateSelectSize();
    updateSelectRange();
  });
  if (disable) {
    clearResize();
    clearSelect();
  }
  setPosition({ x: (bgBoxSize.height - initSize) / 2, y: (bgBoxSize.width - initSize) / 2 });
  return {
    selectBoxSize,
    selectBoxStyle,
    selectX,
    selectY,
  };
}
