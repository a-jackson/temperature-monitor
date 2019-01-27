export function standardDeviation(values: number[]) {
    const avg = average(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export function average(data: number[]) {
    const sum = data.reduce((total, value) => total + value, 0);
    return sum / data.length;
}

export function standardError(values: number[]) {
    const stdDev = standardDeviation(values);
    return stdDev / Math.sqrt(values.length);
}
