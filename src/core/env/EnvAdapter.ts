export default interface EnvAdapter {
    get(key: string): string | undefined
}