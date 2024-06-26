import { Buff, Bytes, Stream } from '@cmdcode/buff'
import { ScriptData }          from '@scrow/tapscript'
import { encode_script }       from '@scrow/tapscript/script'
import { check }               from '@/util/index.js'

export function decode_witness (bytes : Bytes) : string[] {
  const stream = Buff.bytes(bytes).stream
  const stack  = []
  const count  = stream.read_varint()
  for (let i = 0; i < count; i++) {
    const word = read_data(stream, true)
    stack.push(word ?? '')
  }
  return stack
}

export function encode_witness (
  data : ScriptData[]
) : string {
  const buffer : Buff[] = []
  if (Array.isArray(data)) {
    const count = Buff.calc_varint(data.length)
    buffer.push(count)
    for (const entry of data) {
      const bytes = (!check.is_empty(entry))
        ? encode_script(entry, true)
        : new Buff(0)
      buffer.push(bytes)
    }
    return Buff.join(buffer).hex
  } else {
    return Buff.bytes(data).hex
  }
}

function read_data (
  stream  : Stream,
  varint ?: boolean
) : string | null {
  const size = (varint === true)
    ? stream.read_varint('le')
    : stream.size
  return size > 0
    ? stream.read(size).hex
    : null
}
