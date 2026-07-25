import {Page, SearchParameter} from "@/lib/axios/model/pagination";

export interface CauHinh {
  id: number
  ten: string
  ma: string
  ngayTao: string
  ngayCapNhat: string
  huy?: boolean
}

export interface CauHinhPage extends Page<CauHinh> {

}

export interface CauHinhSearchParameter extends SearchParameter {
}

export interface CauHinhCreation {
  ten: string
  ma: string
}
