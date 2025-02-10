/* eslint-disable prettier/prettier */
export const reoreder = <T>(list: T[], startIndex, endIndex): T[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}
