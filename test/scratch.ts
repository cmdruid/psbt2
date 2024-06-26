import { decode_psbt, encode_psbt } from '@/index.js'
import { Buff } from '@cmdcode/buff'

const psbt_b64 = 'cHNidP8BAJcAAAAAAARAQg8AAAAAACJRIEpsaIZ+v5ut6+f3skwGTyOggA9nEULJyruAhZWRDZOGHAIAAAAAAAAWABSIC4Srx3P4mOHZbbBKCib1JRpDVwAAAAAAAAAAJ2pYABRqyBsrG75HMLExjyhI4lmF3un9mgQAAAH0BAAA6mAEZnONpQAAAAAAAAAACmpdAzA6MAIB9FEAAAAAAAAiAgL1PFXPl3K1rgFwrP4R/TyMGYuuaDa+kjo/WBCtdAmJZRh0fpapVAAAgAEAAIAAAACAAAAAAAYAAAAAAAA='
const psbt_hex = Buff.base64(psbt_b64).hex

const ret = decode_psbt(psbt_b64)

console.dir(ret, { depth: null })

const hex = encode_psbt(ret)

console.log('hex:', hex)

console.log('is valid:', hex === psbt_hex)
