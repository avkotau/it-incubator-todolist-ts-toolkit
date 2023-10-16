type FieldErrorType = {
  error: string
  field: string
}

export type BaseResponseType<D = {}> = {
  url: string
  resultCode: number
  messages: string[]
  data: D
  fieldsErrors: FieldErrorType[]
}
