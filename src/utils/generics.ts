export function typeSafeSwitch<T extends keyof any, V>(
  r: Record<T, V>
): (type: T) => V {
  return (type: T) => {
    return r[type];
  };
}

export function typeSafeList<T extends keyof any>(r: Record<T, T>): T[] {
  return Object.values(r);
}

export function joinWithFilter(text: string[], deliminator: string): string {
  return text.join(deliminator);
}
