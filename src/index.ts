import CONST from './const.js'

import { create_psbt }   from './lib/create.js'
import { decode_psbt }   from './lib/decode.js'
import { encode_psbt }   from './lib/encode.js'
import { finalize_psbt } from './lib/finalize.js'
import { update_psbt }   from './lib/update.js'

export * from './lib/create.js'
export * from './lib/decode.js'
export * from './lib/encode.js'
export * from './lib/finalize.js'
export * from './lib/update.js'
export * from './lib/witness.js'
export * from './types.js'

export { CONST }

export default {
  create   : create_psbt,
  encode   : encode_psbt,
  decode   : decode_psbt,
  update   : update_psbt,
  finalize : finalize_psbt
}
