import { z } from 'zod'

import CONST from './const.js'

const global_enum = z.enum(CONST.PSBT_GLOBAL_KEYS)
const input_enum  = z.enum(CONST.PSBT_INPUT_KEYS)
const output_enum = z.enum(CONST.PSBT_OUTPUT_KEYS)

const key    = z.string()
const value  = z.union([ z.string(), z.number() ])
const pair   = z.object({ key: key.optional(), value })
const global = z.array(pair.extend({ label: global_enum }))
const input  = z.array(pair.extend({ label: input_enum }))
const output = z.array(pair.extend({ label: output_enum }))

const data = z.object({
  global,
  inputs  : input.array(),
  outputs : output.array()
})

export default { data }
