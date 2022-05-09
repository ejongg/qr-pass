declare module 'use-react-screenshot' {
    function useScreenshot(): [any, any];
    function createFileName(extension: string, filename: string): string;
}
