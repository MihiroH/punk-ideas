import { Button, Checkbox, Space } from 'antd'

import ClientDatePicker from '~/components/ClientDatePicker'

export function Welcome() {
  return (
    <Space>
      <Button type="primary">ボタン</Button>
      <Checkbox>Checkbox</Checkbox>
      <ClientDatePicker />
    </Space>
  )
}
