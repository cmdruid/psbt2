import { encode_psbt } from './encode.js'

export function create_psbt (txhex : string) {
  return encode_psbt({
    global  : [ { label: 'UNSIGNED_TX', value: txhex } ],
    inputs  : [],
    outputs : []
  })
}
