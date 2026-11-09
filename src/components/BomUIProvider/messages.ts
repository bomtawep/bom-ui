/** Every UI string the components render. Override via `<BomUIProvider messages>`. */
export interface BomUIMessages {
  required: string
  loading: string
  close: string
  selectPlaceholder: string
  datePickerPlaceholder: string
  dateRangePlaceholder: string
  dateInputPlaceholder: string
  openCalendar: string
  time: string
  pagination: string
  previous: string
  next: string
  previousPage: string
  nextPage: string
  morePages: string
  pageOf: (page: number, pageCount: number) => string
  pageSummary: (from: number, to: number, total: number) => string
  breadcrumb: string
  breadcrumbMore: string
  toggleSidebar: string
  errorTitle: string
  retry: string
  pdfRegenerate: string
  pdfOpenNewTab: string
  pdfFailed: string
}

export const defaultMessages: BomUIMessages = {
  required: 'จำเป็น',
  loading: 'กำลังโหลด',
  close: 'ปิด',
  selectPlaceholder: 'เลือก',
  datePickerPlaceholder: 'เลือกวันที่',
  dateRangePlaceholder: 'เลือกช่วงวันที่',
  dateInputPlaceholder: 'วว/ดด/ปปปป',
  openCalendar: 'เปิดปฏิทิน',
  time: 'เวลา',
  pagination: 'การแบ่งหน้า',
  previous: 'ก่อนหน้า',
  next: 'ถัดไป',
  previousPage: 'หน้าก่อนหน้า',
  nextPage: 'หน้าถัดไป',
  morePages: 'หน้าอื่น ๆ',
  pageOf: (page, pageCount) => `หน้า ${page} / ${pageCount}`,
  pageSummary: (from, to, total) => `${from}–${to} จาก ${total} รายการ`,
  breadcrumb: 'เส้นทาง',
  breadcrumbMore: 'เพิ่มเติม',
  toggleSidebar: 'เปิด/ปิดแถบข้าง',
  errorTitle: 'โหลดข้อมูลไม่สำเร็จ',
  retry: 'ลองใหม่',
  pdfRegenerate: 'สร้างใหม่',
  pdfOpenNewTab: 'เปิดแท็บใหม่',
  pdfFailed: 'สร้าง PDF ไม่สำเร็จ',
}
