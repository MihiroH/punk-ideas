import fs from 'node:fs'
import path from 'node:path'
import { extractStyle } from '@ant-design/static-style-extract'

import { AntdConfigProvider } from '~/themes/AntdConfigProvider'

const outputPath = './public/css/antd.min.css'
const outputDir = path.dirname(outputPath)

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const css = extractStyle((node) => (
  <>
    <AntdConfigProvider>{node}</AntdConfigProvider>
  </>
))

fs.writeFileSync(outputPath, css)
