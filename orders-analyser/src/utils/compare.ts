import { isNil } from '@nestjs/common/utils/shared.utils';

export function compareArrays(a, b): boolean {
  if (isNil(a) || isNil(b)) return false;

  a.sort();
  b.sort();
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (isNil(a[i]) || isNil(b[i])) return false;
    if (a[i].id != b[i]) return false;
  }

  return true;
}
