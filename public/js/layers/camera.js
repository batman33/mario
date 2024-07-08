import Camera from "../Camera.js";

/**
 * @param {Camera} cameraToDraw
 * @returns {function}
 */
export function createCameraLayer(cameraToDraw) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {Camera} fromCamera
   */
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = "purple";
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
