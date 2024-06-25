<template>
  <div class="story" :style="style">
    <div v-for="id of symbolIds" :key="id" class="cell">
      <div class="container">
        <ej-icon :icon="id"/>
      </div>
      <p><code>{{id}}</code></p>
    </div>
  </div>
</template>

<script>
  import {color} from '@storybook/addon-knobs'

  import icons from '../icons.svg'

  export default {
    storyName: '全部图标',

    props: {
      color: {
        default: color('Color', '#666', 'Preview'),
      },
    },

    data () {
      return {
        symbolIds: [],
      }
    },

    computed: {
      style () {
        return {
          color: this.color,
        }
      },
    },

    async created () {
      const xml = await fetch(icons).then(res => res.text())
      const re = /<symbol id="(\S+?)"/

      let match
      let lastIndex = 0

      while ((match = re.exec(xml.slice(lastIndex)))) {
        this.symbolIds.push(match[1])
        lastIndex += match.index + match[0].length
      }
    },
  }
</script>

<style lang="scss" scoped>
  .story {
    @apply flex flex-wrap;

    margin: calc(50px - 16px) 50px 50px calc(50px - 16px);
  }

  .cell {
    @apply flex-none;

    margin-left: 16px;
    margin-top: 16px;

    &:hover {
      code {
        @apply px-4 bg-white z-10;
      }
    }
  }

  .container {
    @apply relative bg-gray-light;

    width: 96px;
    height: 96px;

    &:hover {
      .ej-icon {
        outline: 1px dashed #f0f;
      }
    }
  }

  .ej-icon {
    @apply absolute inset-0 m-auto;

    width: 32px;
    height: 32px;
  }

  p {
    @apply text-black text-sm text-center relative;

    height: 2em;

    code {
      @apply block whitespace-no-wrap absolute;

      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
