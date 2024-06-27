import {
  MessageBox,
  Message,
} from 'element-ui'

const CONFIRM_TEXT = {
  DEFAULT: {
    title: '提示',
    message: '是否继续此操作?',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    messageBoxType: 'warning',
    messageSuccessText: '操作成功',
    messageSuccessType: 'success',
    messageErrorText: '操作失败',
    messageErrorType: 'error',
    duration: 1500,
  },
}

const MessageSuccess = async (params = CONFIRM_TEXT.DEFAULT) => {
  const confirm = {
    ...CONFIRM_TEXT.DEFAULT,
    ...params,
  }
  Message.success({
    message: confirm.messageSuccessText,
    duration: confirm.duration,
    type: confirm.messageSuccessType,
  })
}

const MessageError = async (params = CONFIRM_TEXT.DEFAULT) => {
  const confirm = {
    ...CONFIRM_TEXT.DEFAULT,
    ...params,
  }
  Message.error({
    message: confirm.messageErrorText,
    duration: confirm.duration,
    type: confirm.messageErrorType,
  })
}

const MessageBoxConfirm = async (params = CONFIRM_TEXT.DEFAULT, fn) => {
  const confirm = {
    ...CONFIRM_TEXT.DEFAULT,
    ...params,
  }
  try {
    await MessageBox.confirm(
      confirm.message,
      confirm.title,
      {
        confirmButtonText: confirm.confirmButtonText,
        cancelButtonText: confirm.cancelButtonText,
        type: confirm.messageBoxType,
      })

    if (typeof fn === 'function') {
      await fn()
    }

    return MessageSuccess(confirm)
  } catch (error) {
    console.log(error)
    return MessageError(confirm)
  }
}

export default {
  CONFIRM_TEXT,
  MessageBoxConfirm,
  MessageSuccess,
  MessageError,
}
