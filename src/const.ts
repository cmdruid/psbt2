const PSBT_MAGIC_BYTES = '70736274ff'

const PSBT_GLOBAL_TYPE_MAP : Record<number, string> = {
  0x00 : 'UNSIGNED_TX',
  0x01 : 'XPUB',
  0x02 : 'TX_VERSION',
  0x03 : 'FALLBACK_LOCKTIME',
  0x04 : 'INPUT_COUNT',
  0x05 : 'OUTPUT_COUNT',
  0x06 : 'TX_MODIFIABLE',
  0xFB : 'VERSION'
}

const PSBT_INPUT_TYPE_MAP = {
  0x00 : 'NON_WITNESS_UTXO',
  0x01 : 'WITNESS_UTXO',
  0x02 : 'PARTIAL_SIG',
  0x03 : 'SIGHASH_TYPE',
  0x04 : 'REDEEM_SCRIPT',
  0x05 : 'WITNESS_SCRIPT',
  0x06 : 'BIP32_DERIVATION',
  0x07 : 'FINAL_SCRIPTSIG',
  0x08 : 'FINAL_SCRIPTWITNESS',
  0x09 : 'PR_COMMITMENT',
  0x0a : 'RIPEMD160',
  0x0b : 'SHA256',
  0x0c : 'HASH160',
  0x0d : 'HASH256',
  0x0e : 'PREVIOUS_TXID',
  0x0f : 'OUTPUT_INDEX',
  0x10 : 'SEQUENCE',
  0x11 : 'REQUIRED_TIME_LOCKTIME',
  0x12 : 'REQUIRED_HEIGHT_LOCKTIME',
  0x13 : 'TAP_KEY_SIG',
  0x14 : 'TAP_SCRIPT_SIG',
  0x15 : 'TAP_LEAF_SCRIPT',
  0x16 : 'TAP_BIP32_DERIVATION',
  0x17 : 'TAP_INTERNAL_KEY',
  0x18 : 'TAP_MERKLE_ROOT'
}

const PSBT_OUTPUT_TYPE_MAP = {
  0x00 : 'REDEEM_SCRIPT',
  0x01 : 'WITNESS_SCRIPT',
  0x02 : 'BIP32_DERIVATION',
  0x03 : 'AMOUNT',
  0x04 : 'SCRIPT',
  0x05 : 'TAP_INTERNAL_KEY',
  0x06 : 'TAP_TREE',
  0x07 : 'TAP_BIP32_DERIVATION'
}

export default {
  PSBT_MAGIC_BYTES,
  PSBT_GLOBAL_TYPE_MAP,
  PSBT_INPUT_TYPE_MAP,
  PSBT_OUTPUT_TYPE_MAP
}
