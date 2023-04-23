export default function castArray<T>(value: T): T extends any[] ? T : [T] {
    // @ts-expect-error
    return Array.isArray(value) ? value : [value];
}
