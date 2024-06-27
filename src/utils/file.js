/**
 * 保存json文件*/
import { saveAs } from 'file-saver'
export function saveJson(data) {
  const jsonData = JSON.stringify(data)
  const blob = new Blob([jsonData], { type: "text/json;charset=utf-8" })
  saveAs(blob, `data_${Date.now()}.json`)
}
