import { decode_psbt } from './decode.js'

import {
  PSBTData,
  PSBTemplate
} from '@/types.js'

import PSBTSchema from '@/schema.js'

export function update_psbt (
  data  : string | PSBTData,
  templ : PSBTemplate
) : PSBTData {
  // If PSBT data is input as a string, decode it.
  if (typeof data === 'string') {
    data = decode_psbt(data)
  }
  // Unpack PSBT data object.
  const { global, inputs, outputs } = data
  // Push elements from template into PSBT data.
  global.push(...templ.global  ?? [])
  inputs.push(...templ.inputs  ?? [])
  outputs.push(...templ.outputs ?? [])
  // Validate and return the new PSBT.
  return PSBTSchema.data.parse({ global, inputs, outputs }) as PSBTData
}
