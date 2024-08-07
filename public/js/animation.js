/**
 * @param {string[]} frames
 * @param {number} frameLen
 * @returns {function(number): string}
 */
export function createAnimation(frames, frameLen) {
  return function resolveFrame(distance) {
    const frameIndex = Math.floor(distance / frameLen) % frames.length;
    const frameName = frames[frameIndex];
    return frameName;
  };
}
