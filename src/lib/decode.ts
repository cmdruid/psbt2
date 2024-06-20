import { Buff }      from '@cmdcode/buff'
import { decode_tx } from './tx.js'
import PSBTSchema    from '@/schema.js'

import { PSBTData, PSBTRecord } from '@/types.js'

import {
  consume_keypairs,
  get_keypair,
  has_keypair
} from './keypair.js'

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
  const global  = consume_keypairs(stream, CONST.PSBT_GLOBAL_TYPE_MAP)
  // Set the version of the PSBT.
  const version = (has_keypair(global, 'VERSION'))
    ? Number(get_keypair(global, 'VERSION'))
    : 1
  // Define variables for input and output count.
  let vin_count, out_count
  // Parse input and output count based on PSBT version.
  if (version === 2) {
    // Get the input and output counts.
    vin_count = get_input_count(global)
    out_count = get_output_count(global)
  } else {
    // Parse the unsigned transaction.
    const keypair = get_keypair(global, 'UNSIGNED_TX')
    const txdata  = decode_tx(keypair.value as string)
    // Set the input and output counts.
    vin_count = txdata.vin.length
    out_count = txdata.vout.length
  }
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

function get_input_count <T> (keys : PSBTRecord<T>[]) {
  const kp = get_keypair(keys, 'INPUT_COUNT')
  return Buff.bytes(kp.value).num
}

function get_output_count <T> (keys : PSBTRecord<T>[]) {
  const kp = get_keypair(keys, 'OUTPUT_COUNT')
  return Buff.bytes(kp.value).num
}
