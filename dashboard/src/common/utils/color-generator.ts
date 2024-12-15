/**
 * @module Color range generator
 *
 */

function calculatePoint(i: number, intervalSize: number, colorRangeInfo: ColorRange) {
    const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
        ? (colorEnd - (i * intervalSize))
        : (colorStart + (i * intervalSize)));
}

/* Must use an interpolated color scale, which has a range of [0, 1] */
interface ColorRange {
    colorStart: number;
    colorEnd: number;
    useEndAsStart: boolean;
}

/**
 * @param dataLength - Number of colors to be generated
 * @param colorScale - The D3 interpolate color scale 
 * @param colorRangeInfo - Color range spectrum
 * @returns An array of colors within the choosen spectrum
 *
 * @description 
 *  - Must use an interpolated color scale, which has a range of [0, 1].
 *  - D3 Interpolators are interpolateInfero, interpolateCool, interpolateRainbow, interpolateSpectral, interpolateRdYlBu
 */
export function interpolateColors(dataLength: number, colorScale: (c: number) => string, colorRangeInfo: ColorRange) {
    const { colorStart, colorEnd } = colorRangeInfo;
    const colorRange = colorEnd - colorStart;
    const intervalSize = colorRange / dataLength;
    let i, colorPoint;
    const colorArray = [];

    for (i = 0; i < dataLength; i++) {
        colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
        colorArray.push(colorScale(colorPoint));
    }

    return colorArray;
}
