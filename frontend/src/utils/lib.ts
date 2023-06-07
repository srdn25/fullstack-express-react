export const fromStringToJson = (string: string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        console.error(error);
        return false;
    }
}