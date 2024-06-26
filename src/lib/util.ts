import { Buff }             from '@cmdcode/buff'
import { decode_tx }        from '@scrow/tapscript/tx'
import { PSBTGlobalRecord } from '@/types.js'

import {
  get_global_key,
  has_global_key
} from './keypair.js'

export function get_io_counts (global : PSBTGlobalRecord[]) {
  // Set the version of the PSBT.
  const version = (has_global_key(global, 'VERSION'))
    ? Number(get_global_key(global, 'VERSION'))
    : 0
  // Check which version of PSBT we are using.
  if (version === 2) {
    // Get the input and output counts.
    const vin_kp = get_global_key(global, 'INPUT_COUNT')
    const out_kp = get_global_key(global, 'OUTPUT_COUNT')
    const vin_ct = Buff.bytes(vin_kp.value).num
    const out_ct = Buff.bytes(out_kp.value).num
    return [ vin_ct, out_ct ]
  } else {
    // Parse the unsigned transaction.
    const keypair = get_global_key(global, 'UNSIGNED_TX')
    const txdata  = decode_tx(keypair.value as string, false)
    // Set the input and output counts.
    const vin_ct = txdata.vin.length
    const out_ct = txdata.vout.length
    return [ vin_ct, out_ct ]
  }
}
