export interface PSBTKeyPair {
  key   : string | null
  label : string
  type  : number
  value : string
}

export interface PSBTData {
  global  : PSBTKeyPair[]
  inputs  : Array<PSBTKeyPair[]>
  outputs : Array<PSBTKeyPair[]>
}
