export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  quanLyDaoTao: {
    benhNhan: '/web-chan-doan-xray/benhNhan',
    Patient: '/web-chan-doan-xray/Patient',
    staffs: '/web-chan-doan-xray/nhan-viens',
    settings: '/web-chan-doan-xray/settings',
    account: '/web-chan-doan-xray/account'

  },
  errors: { notFound: '/errors/not-found' },
} as const;
