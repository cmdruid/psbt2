import { Buff, Stream }         from '@cmdcode/buff'
import { PSBTData, PSBTRecord } from '@/types.js'
import { get_io_counts }        from './util.js'
import { assert, check }               from '@/util/index.js'

import PSBTSchema from '@/schema.js'
import CONST      from '@/const.js'

export function decode_psbt (psbt_str : string) : PSBTData {
  // Convert PSBT hex into a data stream.
  const stream = (check.is_hex(psbt_str))
    ? Buff.hex(psbt_str).stream
    : Buff.base64(psbt_str).stream
  // Parse the magic bytes.
  const magic  = stream.read(5).hex
  // Verify the magic bytes.
  if (magic !== CONST.PSBT_MAGIC_BYTES) {
    throw new Error('invalid magic for psbt: ' + magic)
  }
  // Parse the global keys list.
  const global  = consume_keypairs(stream, CONST.PSBT_GLOBAL_TYPE_MAP)
  // Get input and output counts.
  const [ vin_count, out_count ] = get_io_counts(global)
  // Define the input keys list.
  const inputs = []
  // For number of inputs we expect:
  for (let i = 0; i < vin_count; i++) {
    // Collect keys for the current input.
    const pairs = consume_keypairs(stream, CONST.PSBT_INPUT_TYPE_MAP)
    inputs.push(pairs)
  }
  // Define the output keys list.
  const outputs = []
  // For number of inputs we expect:
  for (let i = 0; i < out_count; i++) {
    // Collect keys for the current input.
    const pairs = consume_keypairs(stream, CONST.PSBT_OUTPUT_TYPE_MAP)
    // Push current set of keys to output array.
    outputs.push(pairs)
  }
  // If we have bytes left over, fail.
  if (stream.size !== 0) {
    throw new Error('stream has excess bytes: ' + new Buff(stream.data).hex)
  }
  // We also need to check for required included, required excluded, and allowed.
  return PSBTSchema.data.parse({ global, inputs, outputs }) as PSBTData
}

function consume_keypairs <T extends Record<number, string>> (
  stream : Stream,
  keymap : T
) : PSBTRecord<T[keyof T]>[] {
  // Define an array to store keypairs.
  const pairs : PSBTRecord<T[keyof T]>[] = []
  // Loop through the stream until we hit a 0x00 stop byte.
  while (stream.peek(1).num !== 0x00) {
    const kp = decode_keypair(stream, keymap)
    pairs.push(kp)
  }
  // Consume the 0x00 stop byte.
  stream.read(1)
  // Return the keypairs.
  return pairs
}

function decode_keypair <T extends Record<number, string>> (
  stream : Stream,
  keymap : T
) : PSBTRecord<T[keyof T]> {
  // Read the length of the key.
  const klen  = stream.read_varint()
  // Parse the key data into its own stream.
  const kdat  = stream.read(klen).stream
  // Read the type of the key.
  const type  = kdat.read_varint()
  // Read the key data if present.
  let key = (kdat.size !== 0)
    ? kdat.read(kdat.size).hex
    : undefined
  // Get the label for the key type.
  let label = keymap[type] as T[keyof T]
  // If the type is custom:
  if (type === 0xFC) {
    // Assert that key data exists.
    assert.exists(key)
    // Convert key data into a stream.
    const pdat  = Buff.bytes(key).stream
    // Read the identifier length.
    const plen  = pdat.read_varint()
    // Set the label as the identifier.
    label = pdat.read(plen).str as T[keyof T]
    // Set the new key as the remaining data.
    key   = pdat.read(pdat.size).hex
  }
  // Get the length of the value.
  const vlen  = stream.read_varint()
  // Get the value of the keypair.
  const value = stream.read(vlen).hex
  // Return the keypair data.
  return { key, label, value }
}
