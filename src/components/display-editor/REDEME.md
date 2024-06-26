## 信息展示+编辑组件
* 展示信息
* 单击展示区，切换称输入框
* 对外数据进行双向数据绑定，失去焦点对外change通知
* 可禁用编辑

### props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | String\Number |  | 展示修改的信息 |

### EVENT
| Name | Payload | Description |
|---|---|---|
| change | val | 发送修改内容 |
