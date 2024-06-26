import CONST from './const.js'

export type PSBTGlobalKeys = typeof CONST.PSBT_GLOBAL_TYPE_MAP[keyof typeof CONST.PSBT_GLOBAL_TYPE_MAP]
export type PSBTInputKeys  = typeof CONST.PSBT_INPUT_TYPE_MAP[keyof typeof CONST.PSBT_INPUT_TYPE_MAP]
export type PSBTOutputKeys = typeof CONST.PSBT_OUTPUT_TYPE_MAP[keyof typeof CONST.PSBT_OUTPUT_TYPE_MAP]

export type PSBTGlobalRecord = PSBTRecord<PSBTGlobalKeys>
export type PSBTInputRecord  = PSBTRecord<PSBTInputKeys>
export type PSBTOutputRecord = PSBTRecord<PSBTOutputKeys>

export type PSBTInputSet  = PSBTInputRecord[]
export type PSBTOutputSet = PSBTOutputRecord[]

export type PSBTemplate = Partial<PSBTData>

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
