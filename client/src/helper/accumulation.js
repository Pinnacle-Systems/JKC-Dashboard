import { substract } from "./helper";

export function getDifferenceInPercentage(prevValue, currentValue) {
    let prevDataValue = parseFloat(prevValue)
    let currentDataValue = parseFloat(currentValue)
    if (prevDataValue > currentDataValue) {
        return (0 - (substract(prevDataValue, currentDataValue) / prevDataValue * 100)).toFixed(2)
    } else if (prevDataValue < currentDataValue) {
        return (substract(currentDataValue, prevDataValue) / currentDataValue * 100).toFixed(2)
    } else {
        return 0
    }
}