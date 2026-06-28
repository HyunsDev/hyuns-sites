import type { PerspectiveCamera } from "three"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export type SolidModelVector = readonly [number, number, number]

export type SolidModelViewState = {
  readonly cameraPosition: SolidModelVector
  readonly cameraScale: number
  readonly target: SolidModelVector
}

export type SolidModelViewStateApplication = {
  readonly camera: PerspectiveCamera
  readonly cameraScale: number
  readonly controls: OrbitControls
  readonly viewState: SolidModelViewState
}

export type SolidModelViewStateSnapshot = {
  readonly camera: PerspectiveCamera
  readonly cameraScale: number
  readonly controls: OrbitControls
}

const DEFAULT_CAMERA_POSITION = [3.15, 2.2, 3.15] satisfies SolidModelVector
const DEFAULT_TARGET = [0, 0, 0] satisfies SolidModelVector

export function createDefaultSolidModelViewState(
  cameraScale: number
): SolidModelViewState {
  return {
    cameraPosition: scaleVector(DEFAULT_CAMERA_POSITION, cameraScale),
    cameraScale,
    target: DEFAULT_TARGET,
  }
}

export function readSolidModelViewState({
  camera,
  cameraScale,
  controls,
}: SolidModelViewStateSnapshot): SolidModelViewState {
  return {
    cameraPosition: vectorToTuple(camera.position),
    cameraScale,
    target: vectorToTuple(controls.target),
  }
}

export function applySolidModelViewState({
  camera,
  cameraScale,
  controls,
  viewState,
}: SolidModelViewStateApplication) {
  const scaledPosition = rescaleSolidModelViewState(viewState, cameraScale)

  camera.position.set(...scaledPosition.cameraPosition)
  controls.target.set(...scaledPosition.target)
  camera.lookAt(controls.target)
}

export function rescaleSolidModelViewState(
  viewState: SolidModelViewState,
  cameraScale: number
): SolidModelViewState {
  if (viewState.cameraScale === cameraScale) {
    return viewState
  }

  const scaleRatio = cameraScale / viewState.cameraScale

  return {
    cameraPosition: scaleVector(viewState.cameraPosition, scaleRatio),
    cameraScale,
    target: viewState.target,
  }
}

function scaleVector(vector: SolidModelVector, scale: number): SolidModelVector {
  return [vector[0] * scale, vector[1] * scale, vector[2] * scale]
}

function vectorToTuple(vector: {
  readonly x: number
  readonly y: number
  readonly z: number
}): SolidModelVector {
  return [vector.x, vector.y, vector.z]
}
