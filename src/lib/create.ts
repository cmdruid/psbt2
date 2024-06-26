import { encode_script }  from '@scrow/tapscript/script'
import { encode_witness } from './witness.js'

import { decode_tx, encode_tx } from '@scrow/tapscript/tx'

import {
  PSBTData,
  PSBTGlobalRecord,
  PSBTInputKeys,
  PSBTInputSet,
  PSBTRecord
} from '@/types.js'

import PSBTSchema from '@/schema.js'

export function create_psbt (txhex : string) : PSBTData {
  const global : PSBTGlobalRecord[] = [],
        inputs : PSBTInputSet[]     = []

  const txdata = decode_tx(txhex)
  const txbase = encode_tx(txdata, true).hex
  //
  for (const txin of txdata.vin) {
    const input : PSBTRecord<PSBTInputKeys>[] = []
    if (typeof txin.scriptSig !== 'number' && txin.scriptSig.length > 0) {
      const script_sig = encode_script(txin.scriptSig, true).hex
      input.push({ label: 'FINAL_SCRIPTSIG', value: script_sig })
    }
    if (txin.witness.length > 0) {
      const witness = encode_witness(txin.witness)
      input.push({ label: 'FINAL_SCRIPTWITNESS', value: witness })
    }
    inputs.push(input)
  }

  global.push({ label: 'UNSIGNED_TX', value: txbase })

  // We also need to check for required included, required excluded, and allowed.
  return PSBTSchema.data.parse({ global, inputs, outputs: [] }) as PSBTData
}
