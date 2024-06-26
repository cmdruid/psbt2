export function exists <T> (
  value ?: T | null
) : value is NonNullable<T> {
  if (typeof value === 'undefined' || value === null) {
    return false
  }
  return true
}

export function is_empty (data : any) : boolean {
  if (typeof data === 'undefined' || data === null) {
    return true
  } else if (
    Array.isArray(data)      ||
    typeof data === 'string' ||
    data instanceof Uint8Array
  ) {
    return data.length === 0
  } else if (typeof data === 'object') {
    return Object.keys(data as object).length === 0
  }
  return false
}

export function is_hex (
  input : any
) : input is string {
  const regex = /[^a-fA-F0-9]/
  if (
    typeof input === 'string' &&
    input.length % 2 === 0    &&
    input.match(regex) === null
  ) { return true }
  return false
}
