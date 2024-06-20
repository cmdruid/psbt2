import { PSBTData } from '@/types.js'

import {
  encode_keypair,
  get_io_counts
} from './keypair.js'

import CONST from '@/const.js'

export function encode_psbt (psbtdata : PSBTData) {
  const { global, inputs, outputs } = psbtdata
  // Get input and output counts.
  let [ vin_count, out_count ] = get_io_counts(global)

  let encoded = CONST.PSBT_MAGIC_BYTES

  for (const kp of global) {
    encoded += encode_keypair(kp, CONST.PSBT_GLOBAL_TYPE_MAP)
  }

  encoded += '00'

  for (const input of inputs) {
    for (const kp of input) {
      encoded += encode_keypair(kp, CONST.PSBT_INPUT_TYPE_MAP)
    }
    encoded   += '00'
    vin_count -= 1
  }

  if (vin_count > 0) {
    encoded += '00'.repeat(vin_count)
  }

  for (const output of outputs) {
    for (const kp of output) {
      encoded += encode_keypair(kp, CONST.PSBT_OUTPUT_TYPE_MAP)
    }
    encoded   += '00'
    out_count -= 1
  }

  if (out_count > 0) {
    encoded += '00'.repeat(out_count)
  }

  return encoded
}
