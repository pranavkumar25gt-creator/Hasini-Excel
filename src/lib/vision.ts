import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export interface VisionModels {
  faceLandmarker: FaceLandmarker;
  cocoModel: cocoSsd.ObjectDetection;
}

let modelsPromise: Promise<VisionModels> | null = null;

export async function loadVisionModels(onProgress?: (step: string) => void): Promise<VisionModels> {
  if (modelsPromise) {
    return modelsPromise;
  }

  modelsPromise = (async () => {
    onProgress?.('Initializing neural vision delegate...');
    
    // Load MediaPipe FaceLandmarker
    onProgress?.('Loading Face Landmarker (WASM)...');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });

    // Load coco-ssd for cell phone detection
    onProgress?.('Loading Object Detector (COCO-SSD)...');
    const cocoModel = await cocoSsd.load({
      base: 'lite_mobilenet_v2',
    });

    onProgress?.('Vision models ready.');
    return { faceLandmarker, cocoModel };
  })();

  return modelsPromise;
}

export interface FaceSignals {
  faceDetected: boolean;
  eyesClosed: boolean;
  eyeBlinkScore: number;
  pitch: number; // degrees
  yaw: number;   // degrees
  roll: number;  // degrees
}

/**
 * Computes Euler angles (yaw, pitch, roll) from MediaPipe facialTransformationMatrixes
 * matrix is a 4x4 row-major array
 */
export function extractEulerAngles(matrix: number[]): { pitch: number; yaw: number; roll: number } {
  if (!matrix || matrix.length < 16) {
    return { pitch: 0, yaw: 0, roll: 0 };
  }

  // Row-major rotation matrix elements
  const r00 = matrix[0];
  const r10 = matrix[4];
  const r11 = matrix[5];
  const r12 = matrix[6];
  const r20 = matrix[8];
  const r21 = matrix[9];
  const r22 = matrix[10];

  // Pitch (around X axis), Yaw (around Y axis), Roll (around Z axis) in degrees
  let pitch = 0;
  let yaw = 0;
  let roll = 0;

  // Sy = sqrt(r00*r00 + r10*r10)
  const sy = Math.sqrt(r00 * r00 + r10 * r10);
  const singular = sy < 1e-6;

  if (!singular) {
    pitch = Math.atan2(r21, r22) * (180 / Math.PI);
    yaw = Math.atan2(-r20, sy) * (180 / Math.PI);
    roll = Math.atan2(r10, r00) * (180 / Math.PI);
  } else {
    pitch = Math.atan2(-r12, r11) * (180 / Math.PI);
    yaw = Math.atan2(-r20, sy) * (180 / Math.PI);
    roll = 0;
  }

  return { pitch, yaw, roll };
}

/**
 * Extracts eye blink blendshape score from FaceLandmarker output
 */
export function extractBlinkScore(blendshapes: any[]): number {
  if (!blendshapes || blendshapes.length === 0 || !blendshapes[0].categories) {
    return 0;
  }
  const categories = blendshapes[0].categories;
  let blinkLeft = 0;
  let blinkRight = 0;

  for (const cat of categories) {
    if (cat.categoryName === 'eyeBlinkLeft') {
      blinkLeft = cat.score;
    } else if (cat.categoryName === 'eyeBlinkRight') {
      blinkRight = cat.score;
    }
  }

  return (blinkLeft + blinkRight) / 2;
}
