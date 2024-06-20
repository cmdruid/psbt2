import { PSBTData }       from '@/types.js'
import { encode_keypair } from './keypair.js'

import CONST from '@/const.js'

export function encode_psbt (psbtdata : PSBTData) {
  const { global, inputs, outputs } = psbtdata

  let encoded = CONST.PSBT_MAGIC_BYTES

  for (const kp of global) {
    encoded += encode_keypair(kp, CONST.PSBT_GLOBAL_TYPE_MAP)
  }

  encoded += '00'

  for (const input of inputs) {
    for (const kp of input) {
      encoded += encode_keypair(kp, CONST.PSBT_INPUT_TYPE_MAP)
    }
    encoded += '00'
  }

  for (const output of outputs) {
    for (const kp of output) {
      encoded += encode_keypair(kp, CONST.PSBT_OUTPUT_TYPE_MAP)
    }
    encoded += '00'
  }

  return encoded
}
