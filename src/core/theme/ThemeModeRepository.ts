export default interface ThemeModeRepository<T> {
    getCurrentThemeMode(): Promise<T>
    setCurrentThemeMode(themeMode: T): Promise<void>
}