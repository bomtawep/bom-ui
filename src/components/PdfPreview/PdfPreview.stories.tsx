import type { Meta, StoryObj } from '@storybook/react-vite'
import { PdfPreview } from './PdfPreview'

// A tiny valid one-page PDF so the story works offline.
const tinyPdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 24 Tf 40 70 Td (bom-ui PdfPreview) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'App/PdfPreview',
  component: PdfPreview,
  args: { url: '/report.pdf', title: 'รายงาน', height: '50vh' },
} satisfies Meta<typeof PdfPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  args: { fetcher: () => Promise.resolve(new Blob([tinyPdf], { type: 'application/pdf' })) },
}

export const Failed: Story = {
  args: { fetcher: () => Promise.reject(new Error('Chrome ไม่พร้อมใช้งาน (503)')) },
}

export const Loading: Story = {
  args: { fetcher: () => new Promise(() => {}) },
}
