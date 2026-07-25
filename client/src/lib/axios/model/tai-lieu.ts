export interface TaiLieu {
  id?: number
  duongDan: string
  filename: string
  loai: string
  huy?: boolean
}

export interface TaiLieuUpload extends TaiLieu {
  file?: File
}
