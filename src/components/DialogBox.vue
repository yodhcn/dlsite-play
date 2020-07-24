<style lang="scss">
.dialog-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 150ms ease;
}

.dialog-container {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 150ms ease;
  box-sizing: border-box;

  &.dialog {
    width: 80%;
    max-width: 400px;

    li {
      border-bottom: 1px solid #f6f6f6;
    }
  }

  &.prompt {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}

.dialog-header {
  position: relative;

  h3 {
    margin: 0;
    padding: 0 14px;
    font-size: 16px;
    height: 45px;
    line-height: 45px;
    box-sizing: border-box;
    border-bottom: 1px solid #f6f6f6;
  }

  .close {
    position: absolute;
    height: 45px;
    width: 45px;
    top: 0;
    right: 0;
    padding-right: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.dialog-body {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  -ms-touch-action: pan-y;
  max-height: calc(70vh - 45px);

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100px;
    padding: 0 14px;

    span {
      text-align: center;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.main {
        font-weight: bold;
        font-size: 15px;
      }

      &.sub {
        color: #333;
        font-size: 12px;
      }
    }
  }

  ol {
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    margin: 0;
    height: 45px;
    line-height: 45px;
    padding: 0 14px;
    list-style: none;
    box-sizing: border-box;
    cursor: pointer;

    &.active {
      position: relative;
      color: #1f9aff;
      font-weight: bold;
    }

    &.cancel {
      border-top: 1px solid #f6f6f6;
      height: 56px;
      line-height: 55px;
    }

    .thumbnail {
      position: absolute;
      top: 8px;
      left: 6px;
      width: 30px;
      height: 30px;
      background-color: #eee;

      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }

    .icon {
      position: absolute;
      top: 0;
      left: 6px;
      width: 30px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .text {
      position: absolute;
      top: 0;
      left: 44px;
      right: 44px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .checked {
      position: absolute;
      top: 12px;
      right: 14px;
    }
  }
}
</style>

<template>
  <transition :name="type">
    <div class="dialog-mask" @click="$emit('close')">
      <div class="dialog-container" :class="type" @click.stop>
        <div v-if="$slots['header']" class="dialog-header">
          <slot name="header"></slot>
          <div class="close" @click="$emit('close')" v-touchfeedback>
            <svgicon name="close" width="18" height="18" color="#666"></svgicon>
          </div>
        </div>

        <div class="dialog-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dialog-box',

  props: ['type']
}
</script>
