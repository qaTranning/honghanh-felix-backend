export function profileHandleName(firstname?: string, lastname?: string) {
  const firstnameH = firstname || '';

  const lastnameH = lastname || '';

  const fullname = firstnameH + ' ' + lastnameH;

  return fullname.trim();
}
