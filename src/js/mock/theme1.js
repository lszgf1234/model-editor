import {checkedThemeId} from "@/js/mock/checkedThemeId.js";

export const data = [{
  id: 1,
  parentId: 0,
  themeName: '主题树',
  isFiles: true,
}, {
  id: checkedThemeId,
  themeName: '模型工具库',
  isFiles: false,
  parentId: 1,
}, {
  id: 2,
  themeName: '一级1',
  isFiles: true,
  parentId: 1,
}, {
  id: 3,
  themeName: '一级2',
  isFiles: true,
  parentId: 1,
}, {
  id: 4,
  themeName: '二级1-1',
  isFiles: false,
  hasData: true,
  parentId: 2,
}, {
  id: 5,
  themeName: '二级1-2',
  isFiles: false,
  hasData: false,
  parentId: 2,
}]
