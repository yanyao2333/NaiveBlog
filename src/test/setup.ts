import '@testing-library/jest-dom'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 每个测试后进行清理
afterEach(() => {
  cleanup()
})
