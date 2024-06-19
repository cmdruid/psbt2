import { Buff } from '@cmdcode/buff'

import { consume_keypairs, get_keypair } from './keypair.js' 
import { PSBTData, PSBTKeyPair }         from '@/types.js'

import CONST from '@/const.js'

export function decode_psbt (psbthex : string) : PSBTData {
  // Convert PSBT hex into a data stream.
  const stream = Buff.hex(psbthex).stream
  // Parse the magic bytes.
  const magic  = stream.read(5).hex
  // Verify the magic bytes.
  if (magic !== CONST.PSBT_MAGIC_BYTES) {
    throw new Error('invalid magic for psbt: ' + magic)
  }
  // Parse the global keys list.
  const global = consume_keypairs(stream, CONST.PSBT_GLOBAL_TYPE_MAP)
  // Get the input and output counts.
  const vin_count = get_input_count(global)
  const out_count = get_output_count(global)
  // Define the input keys list.
  const inputs : PSBTKeyPair[][] = []
  // For number of inputs we expect:
  for (let i = 0; i < vin_count; i++) {
    // Collect keys for the current input.
    const pairs = consume_keypairs(stream, CONST.PSBT_INPUT_TYPE_MAP)
    inputs.push(pairs)
  }
  // Define the output keys list.
  const outputs : PSBTKeyPair[][] = []
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
  return { global, inputs, outputs }
}

function get_input_count (keys : PSBTKeyPair[]) {
  const kp = get_keypair(keys, 'INPUT_COUNT')
  return Buff.bytes(kp.value).num
}

function get_output_count (keys : PSBTKeyPair[]) {
  const kp = get_keypair(keys, 'OUTPUT_COUNT')
  return Buff.bytes(kp.value).num
}
