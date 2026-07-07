export interface Designation {
  id: string
  name: string
  description?: string
}

export interface Department {
  id: string
  name: string
  code?: string
}

export interface InviteEmployeeRequest {
  email: string
  first_name: string
  last_name: string
  phone?: string
  designation: string
  department?: string
  date_of_joining: string
}

export interface InviteEmployeeResponse {
  message: string
  user_id: string
  email: string
  invite_token: string
}

export interface ApiErrorResponse {
  detail?: string
  error?: string
  [key: string]: unknown
}
