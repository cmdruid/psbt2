import { Buff }                 from '@cmdcode/buff'
import { PSBTData, PSBTRecord } from '@/types.js'
import { get_key_type }         from './keypair.js'
import { get_io_counts }        from './util.js'
import { assert }               from '@/util/index.js'

import CONST from '@/const.js'

export function encode_psbt (
  data   : PSBTData,
  format : 'hex' | 'b64' = 'hex'
) {
  const { global, inputs, outputs } = data
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

  return (format === 'hex')
    ? encoded
    : Buff.hex(encoded).base64
}

function encode_keypair <T extends Record<number, string>> (
  keypair : PSBTRecord<T[keyof T]>,
  keymap  : T
) {
  // Unpack the keypair object.
  const { key, label, value } = keypair
  //
  const type = get_key_type(keymap, label)
  // Set our temp key bytes variable to empty buffer.
  let kb = new Buff(0, 0)
  // If key type is proprietary:
  if (type === 0xFC) {
    // Assert key exists.
    assert.exists(key)
    // Serialize key label.
    const label_bytes = Buff.str(label as string)
    // Calculate label varint.
    const label_vint  = Buff.calc_varint(label_bytes.length)
    // Update temp variable.
    kb = Buff.join([ label_vint, label_bytes, key ])
  } else if (key !== undefined) {
    // Update temp variable.
    kb = Buff.bytes(key)
  }
  // Serialize type value.
  const type_bytes  = Buff.num(type)
  // Combine key type with key data.
  const key_bytes   = Buff.join([ type_bytes, kb ])
  // Calculate key varint.
  const key_vint    = Buff.calc_varint(key_bytes.length)
  // Serialize value bytes.
  const value_bytes = Buff.bytes(value)
  // Calculate value varint.
  const value_vint  = Buff.calc_varint(value_bytes.length)
  // Return serialized keypair.
  return Buff.join([ key_vint, key_bytes, value_vint, value_bytes ]).hex
}
