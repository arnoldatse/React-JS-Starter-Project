export default interface NavCollapsedRepository {
    getCurrentNavCollapsed(): Promise<boolean>
    setCurrentNavCollapsed(navCollapsed: boolean): Promise<void>
}