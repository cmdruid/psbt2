import { assert } from '@/util/index.js'

import {
  PSBTGlobalKeys,
  PSBTGlobalRecord,
  PSBTInputKeys,
  PSBTInputSet,
  PSBTOutputKeys,
  PSBTOutputSet,
  PSBTRecord
} from '@/types.js'

export function get_key_type <T extends Record<number, string>> (
  keymap : T,
  label  : T[keyof T]
) {
  const ent = Object.entries(keymap).find(e => e[1] === label)
  assert.exists(ent, 'type does not exist for label: ' + label)
  return Number(ent[0])
}

export function has_global_key (
  globals : PSBTGlobalRecord[],
  label   : PSBTGlobalKeys
) {
  return has_keypair(globals, label)
}

export function get_global_key (
  globals : PSBTGlobalRecord[],
  label   : PSBTGlobalKeys
) {
  return get_keypair(globals, label)
}

export function has_input_key (
  input : PSBTInputSet,
  label : PSBTInputKeys
) {
  return has_keypair(input, label)
}

export function get_input_key (
  input : PSBTInputSet,
  label : PSBTInputKeys
) {
  return get_keypair(input, label)
}

export function has_output_key (
  output : PSBTOutputSet,
  label  : PSBTOutputKeys
) {
  return has_keypair(output, label)
}

export function get_output_key (
  output : PSBTOutputSet,
  label  : PSBTOutputKeys
) {
  return get_keypair(output, label)
}

function has_keypair <M> (
  keys  : PSBTRecord<M>[],
  label : string
) {
  const kp = keys.find(e => e.label === label)
  return kp !== undefined
}

function get_keypair <M> (
  keys  : PSBTRecord<M>[],
  label : string
) {
  const kp = keys.find(e => e.label === label)
  assert.exists(kp, 'keypair not found: ' + label)
  return kp
}
