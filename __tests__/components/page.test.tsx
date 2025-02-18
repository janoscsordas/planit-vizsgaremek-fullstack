import { describe, test } from 'vitest'
import { render } from '@testing-library/react'
import Page from '@/app/page'

describe('Page', () => {
    test('should render', () => {
        render(<Page />)
    })
})