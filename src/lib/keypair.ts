import { Buff, Stream } from '@cmdcode/buff'
import { PSBTKeyPair }  from '@/types.js'
import { assert }       from '@/util/index.js'

export function consume_keypairs (
  stream : Stream,
  keymap : Record<number, string>
) {
  // Define an array to store keypairs.
  const pairs = []
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

export function decode_keypair (
  stream : Stream,
  keymap : Record<number, string>
) : PSBTKeyPair {
  // Read the length of the key.
  const klen  = stream.read_varint()
  // Parse the key data into its own stream.
  const kdat  = stream.read(klen).stream
  // Read the type of the key.
  const type  = kdat.read_varint()
  // Read the key data if present.
  let key = (kdat.size !== 0)
    ? kdat.read(kdat.size).hex
    : null
  // Get the label for the key type.
  let label = keymap[type]
  // If the type is custom:
  if (type === 0xFC) {
    // Assert that key data exists.
    assert.exists(key)
    // Convert key data into a stream.
    const pdat  = Buff.bytes(key).stream
    // Read the identifier length.
    const plen  = pdat.read_varint()
    // Set the label as the identifier.
    label = pdat.read(plen).str
    // Set the new key as the remaining data.
    key   = pdat.read(pdat.size).hex
  }
  // Get the length of the value.
  const vlen  = stream.read_varint()
  // Get the value of the keypair.
  const value = stream.read(vlen).hex
  // Return the keypair data.
  return { key, label, type, value }
}

export function encode_keypair (kp : PSBTKeyPair) {
  // Unpack the keypair object.
  const { key, label, type, value } = kp
  // Set our temp key bytes variable to empty buffer.
  let kb = new Buff(0, 0)
  // If key type is proprietary:
  if (type === 0xFC) {
    // Assert key exists.
    assert.exists(key)
    // Serialize key label.
    const label_bytes = Buff.str(label)
    // Calculate label varint.
    const label_vint  = Buff.calc_varint(label_bytes.length)
    // Update temp variable.
    kb = Buff.join([ label_vint, label_bytes, key ])
  } else if (key !== null) {
    // Update temp variable.
    kb = Buff.hex(key)
  }
  // Serialize type value.
  const type_bytes  = Buff.num(type)
  // Combine key type with key data.
  const key_bytes   = Buff.join([ type_bytes, kb ])
  // Calculate key varint.
  const key_vint    = Buff.calc_varint(key_bytes.length)
  // Serialize value bytes.
  const value_bytes = Buff.hex(value)
  // Calculate value varint.
  const value_vint  = Buff.calc_varint(value_bytes.length)
  // Return serialized keypair.
  return Buff.join([ key_vint, key_bytes, value_vint, value_bytes ]).hex
}

export function get_keypair (
  keys  : PSBTKeyPair[],
  label : string
) {
  const kp = keys.find(e => e.label === label)
  assert.exists(kp, 'keypair not found: ' + label)
  return kp
}
