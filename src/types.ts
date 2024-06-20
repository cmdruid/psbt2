import CONST from './const.js'

export type PSBTGlobalKeys = typeof CONST.PSBT_GLOBAL_TYPE_MAP[keyof typeof CONST.PSBT_GLOBAL_TYPE_MAP]
export type PSBTInputKeys  = typeof CONST.PSBT_INPUT_TYPE_MAP[keyof typeof CONST.PSBT_INPUT_TYPE_MAP]
export type PSBTOutputKeys = typeof CONST.PSBT_OUTPUT_TYPE_MAP[keyof typeof CONST.PSBT_OUTPUT_TYPE_MAP]

export interface PSBTRecord <T> {
  key  ?: string
  label : T
  value : string | number
}

export interface PSBTData {
  global  : PSBTRecord<PSBTGlobalKeys>[]
  inputs  : Array<PSBTRecord<PSBTInputKeys>[]>
  outputs : Array<PSBTRecord<PSBTOutputKeys>[]>
}
