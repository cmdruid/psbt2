import { decode_psbt }    from './decode.js'
import { decode_witness } from './witness.js'
import { PSBTData }       from '@/types.js'

import { get_input_key, has_input_key } from './keypair.js'
import { decode_tx, encode_tx }         from '@scrow/tapscript/tx'

export function finalize_psbt (
  psbt_data : string | PSBTData
) : string {
  // If PSBT data is input as a string, decode it.
  if (typeof psbt_data === 'string') {
    psbt_data = decode_psbt(psbt_data)
  }
  // Unpack PSBT data object.
  const { global, inputs } = psbt_data

  const tx_idx = psbt_data.global.findIndex(e => e.label === 'UNSIGNED_TX')
  if (tx_idx === -1) throw new Error('no tx data found in psbt')

  const txdata = decode_tx(global[tx_idx].value as string)

  // Loop through each input and add witness data.
  for (let i = 0; i < txdata.vin.length; i++) {
    if (has_input_key(inputs[i], 'FINAL_SCRIPTWITNESS')) {
      const wit_key = get_input_key(inputs[i], 'FINAL_SCRIPTWITNESS')
      txdata.vin[i].witness = decode_witness(wit_key.value)
    }
  }

  return encode_tx(txdata).hex
}
