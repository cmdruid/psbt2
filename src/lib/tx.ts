import { Buff } from '@cmdcode/buff'

export function decode_tx (txhex : string) {
  const stream  = Buff.hex(txhex).stream
  const version = stream.read(4)

  const vin       = []
  const vin_count = stream.read_varint()

  for (let i = 0; i < vin_count; i++) {
    const txid      = stream.read(32)
    const vout      = stream.read(4)
    const scriptSig = stream.read(stream.read_varint())
    const sequence  = stream.read(4)
    vin.push({ txid, vout, scriptSig, sequence })
  }

  const vout      = []
  const out_count = stream.read_varint()

  for (let i = 0; i < out_count; i++) {
    const value        = stream.read(8)
    const scriptPubKey = stream.read(stream.read_varint())
    vout.push({ value, scriptPubKey })
  }

  const locktime = stream.read(4)

  return { version, vin, vout, locktime }
}
