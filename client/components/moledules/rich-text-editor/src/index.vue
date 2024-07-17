<template>
  <div id="text-editor">
    <div v-if="!!editor" class="toolbar">
      <div class="align-dropdown">
        <button class="dropbtn">Heading ▼</button>
        <div class="dropdown-content">
          <a
            v-for="index in 6"
            :key="index"
            :class="{ active: editor.isActive('heading', { level: index }) }"
            :style="{ fontSize: 20 - index + 'px' }"
            role="button"
            @click="onHeadingClick(index as Level)"
          >
            H{{ index }}
          </a>
        </div>
      </div>

      <button
        v-for="({ slug, option, active, icon }, index) in textActions"
        :key="index"
        :class="{ active: editor.isActive(active) }"
        @click="onActionClick(slug, option)"
      >
        <i :class="icon"></i>
      </button>
    </div>

    <editor-content :editor="editor as Editor" />

    <div v-if="!!editor" class="footer">
      <span class="characters-count" :class="maxLimit ? limitWarning : ''">
        {{ charactersCount }}
        {{ maxLimit ? `/ ${maxLimit} characters` : 'characters' }}
      </span>
      |
      <span class="words-count"> {{ wordsCount }} words </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { StarterKit } from '@tiptap/starter-kit';
import { type Level } from '@tiptap/extension-heading';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { CharacterCount } from '@tiptap/extension-character-count';

const props = defineProps<{
  modelValue: string;
  maxLimit: number;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const editor = ref<Editor | null>(null);
const textActions = [
  { slug: 'bold', icon: 'ri-bold', active: 'bold' },
  { slug: 'italic', icon: 'ri-italic', active: 'italic' },
  { slug: 'underline', icon: 'ri-underline', active: 'underline' },
  { slug: 'strike', icon: 'ri-strikethrough', active: 'strike' },
  {
    slug: 'align',
    option: 'left',
    icon: 'ri-align-left',
    active: { textAlign: 'left' },
  },
  // ... rest of the actions
];

const charactersCount = ref('');
const wordsCount = ref('');

const limitWarning = computed(() => {
  const isCloseToMax = +charactersCount.value >= props.maxLimit - 20;
  const isMax = +charactersCount.value === props.maxLimit;

  if (isCloseToMax && !isMax) return 'warning';
  if (isMax) return 'danger';

  return '';
});

onMounted(() => {
  (editor.value as Editor | null) = new Editor({
    content: props.modelValue,
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      CharacterCount.configure({
        limit: props.maxLimit,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: () => {
      if (!editor.value) return;
      emit('update:modelValue', editor.value.getHTML());
    },
  });
});

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return;
    if (editor.value.getHTML() === value) return;
    editor.value.commands.setContent(props.modelValue, false);
  }
);

onUnmounted(() => {
  if (!editor.value) return;
  editor.value.destroy();
});

const onActionClick = (slug: string, option: string | null = null) => {
  if (!editor.value) return;

  const vm = editor.value.chain().focus();
  const actionTriggers = {
    bold: () => vm.toggleBold().run(),
    italic: () => vm.toggleItalic().run(),
    underline: () => vm.toggleUnderline().run(),
    strike: () => vm.toggleStrike().run(),
    bulletList: () => vm.toggleBulletList().run(),
    orderedList: () => vm.toggleOrderedList().run(),
    align: () => {
      if (!option) return;
      vm.setTextAlign(option).run();
    },
    subscript: () => vm.toggleSubscript().run(),
    superscript: () => vm.toggleSuperscript().run(),
    undo: () => vm.undo().run(),
    redo: () => vm.redo().run(),
    clear: () => {
      vm.clearNodes().run();
      vm.unsetAllMarks().run();
    },
    code: () => vm.toggleCodeBlock().run(),
  };

  actionTriggers[slug as keyof typeof actionTriggers]();
};

const onHeadingClick = (level: Level) => {
  if (!editor.value) return;
  const vm = editor.value.chain().focus();
  vm.toggleHeading({ level }).run();
};
</script>
<style lang="less" scoped>
#text-editor {
  border: 1px solid #808080;
  color: black !important;

  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #808080;

    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 20px;
      background: #fff;
      color: #333;
      border: none;
      border-radius: 2px;
      margin: 0.5em 4px;
      appearance: none;
      cursor: pointer;

      &.active {
        background: #333;
        color: #fff;
      }
    }
  }

  .align-dropdown {
    position: relative;
    display: inline-block;
    margin: 0.5em 8px;

    > button {
      height: 32px;
      background: #fff;
      color: #333;
      border: none;
      border-radius: 2px;
      appearance: none;
      cursor: pointer;
    }

    > .dropdown-content {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      border: 1px solid #333;
      outline: 1px solid #fff;
      border-radius: 2px;
      background-color: #fff;
      z-index: 1;

      a {
        display: block;
        padding: 6px 12px;
        text-align: center;
        cursor: pointer;

        &:hover,
        &.active {
          background: #333;
          color: #fff;
        }
      }
    }

    &:hover .dropdown-content {
      display: block;
    }
  }

  .divider {
    width: 1px;
    height: 24px;
    background: #333;
    margin-right: 6px;
  }

  .footer {
    color: #808080;
    font-size: 14px;
    text-align: right;
    padding: 6px;

    .characters-count {
      &.warning {
        color: orange;
      }

      &.danger {
        color: red;
      }
    }
  }

  .ProseMirror {
    height: 300px;
    overflow-y: auto;
    padding-left: 0.5em;
    padding-right: 0.5em;
    outline: none;

    > p:first-child {
      margin-top: 0.5em;
    }

    > h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      &:first-child {
        margin-top: 0.5em;
      }
    }
  }
}
</style>
