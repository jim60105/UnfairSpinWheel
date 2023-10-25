/// From: https://github.com/CrazyTim/spin-wheel/issues/23#issuecomment-1713312783
declare module 'spin-wheel/dist/spin-wheel-esm' {
  // -------------- Constants --------------
  export const arcAdjust: number;
  export const baseCanvasSize: number;
  export const dragCapturePeriod: number;
  export const Debugging: {
    pointerLineColor: string;
    labelOutlineColor: string;
    labelRadiusColor: string;
    dragEventHue: number;
  };

  // -------------- Enums --------------
  export enum AlignText {
    left = 'left',
    right = 'right',
    center = 'center'
  }

  // -------------- Interfaces --------------
  export interface Defaults {
    wheel: {
      borderColor: string;
      borderWidth: number;
      debug: boolean;
      image: any;
      isInteractive: boolean;
      itemBackgroundColors: string[];
      itemLabelAlign: AlignText;
      itemLabelBaselineOffset: number;
      itemLabelColors: string[];
      itemLabelFont: string;
      itemLabelFontSizeMax: number;
      itemLabelRadius: number;
      itemLabelRadiusMax: number;
      itemLabelRotation: number;
      itemLabelStrokeColor: string;
      itemLabelStrokeWidth: number;
      items: any[];
      lineColor: string;
      lineWidth: number;
      pixelRatio: number;
      radius: number;
      rotation: number;
      rotationResistance: number;
      rotationSpeed: number;
      rotationSpeedMax: number;
      offset: { w: number; h: number };
      onCurrentIndexChange: any;
      onRest: any;
      onSpin: any;
      overlayImage: any;
      pointerAngle: number;
    };
    item: {
      backgroundColor: string | null;
      image: string | null;
      imageOpacity: number;
      imageRadius: number;
      imageRotation: number;
      imageScale: number;
      label: string | null;
      labelColor: string | null;
      value: any;
      weight: number;
    };
  }

  // -------------- Utility Functions --------------
  export function getRandomInt(min?: number, max?: number): number;
  export function getRandomFloat(min?: number, max?: number, round?: number): number;
  export function degRad(degrees?: number): number;
  export function isAngleBetween(angle: number, arcStart: number, arcEnd: number): boolean;

  // -------------- Event Functions --------------
  export function register(wheel?: any): void;
  export function unregister(wheel?: any): void;

  // -------------- Item Class --------------
  export class Item {
    constructor(wheel: any, props?: any);
    init(props: {
      backgroundColor?: string;
      image?: string;
      imageOpacity?: number;
      imageRadius?: number;
      imageRotation?: number;
      imageScale?: number;
      label?: string;
      labelColor?: string;
      value?: any;
      weight?: number;
    }): void;

    // Getters and Setters
    backgroundColor: string | null;
    image: string | null;
    imageOpacity: number;
    imageRadius: number;
    imageRotation: number;
    imageScale: number;
    label: string | null;
    labelColor: string | null;
    value: any;
    weight: number;

    // Methods
    getIndex(): number;
    getCenterAngle(): number;
    getStartAngle(): number;
    getEndAngle(): number;
    getRandomAngle(): number;
  }

  interface WheelProps {
    borderColor?: string;
    borderWidth?: number;
    debug?: boolean;
    image?: HTMLImageElement;
    isInteractive?: boolean;
    itemBackgroundColors?: string[];
    itemLabelAlign?: string;
    itemLabelBaselineOffset?: number;
    itemLabelColors?: string[];
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelStrokeColor?: string;
    itemLabelStrokeWidth?: number;
    items?: any[]; // Replace with the actual item type if you know it
    lineColor?: string;
    lineWidth?: number;
    pixelRatio?: number;
    rotationSpeedMax?: number;
    radius?: number;
    rotation?: number;
    rotationResistance?: number;
    offset?: { w: number; h: number };
    onCurrentIndexChange?: Function;
    onRest?: Function;
    onSpin?: Function;
    overlayImage?: HTMLImageElement;
    pointerAngle?: number;
  }

  // -------------- Wheel Class --------------
  export class Wheel {
    constructor(container: Element, props?: any);

    init(props?: any): void;
    add(container: Element): void;
    remove(): void;
    resize(): void;
    draw(now?: number): void;
    spin(rotationSpeed?: number): void;
    spinTo(rotation?: number, duration?: number, easingFunction?: any): void;
    spinToItem(
      itemIndex?: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: number,
      easingFunction?: any
    ): void;
    animate(newRotation: number, duration: number, easingFunction?: any): void;
    stop(): void;
    getScaledNumber(n: number): number;
    getActualPixelRatio(): number;
    wheelHitTest(point?: { x: number; y: number }): boolean;
    refreshCursor(): void;
    getAngleFromCenter(point?: { x: number; y: number }): number;
    getCurrentIndex(): number;
    refreshCurrentIndex(angles?: any[]): void;
    getItemAngles(initialRotation?: number): any[];
    refresh(): void;
    limitSpeed(speed?: number, max?: number): number;
    beginSpin(speed?: number, spinMethod?: string): void;
    refreshAriaLabel(): void;
    dragStart(point?: { x: number; y: number }): void;
    dragMove(point?: { x: number; y: number }): void;
    dragEnd(): void;
    isDragEventTooOld(now?: number, event?: any): boolean;
    raiseEvent_onCurrentIndexChange(data?: any): void;
    raiseEvent_onRest(data?: any): void;
    raiseEvent_onSpin(data?: any): void;

    // Define getters and setters based on the Defaults interface
    borderColor: string;
    borderWidth: number;
    debug: boolean;
    image: any;
    isInteractive: boolean;
    itemBackgroundColors: string[];
    itemLabelAlign: AlignText;
    itemLabelBaselineOffset: number;
    itemLabelColors: string[];
    itemLabelFont: string;
    itemLabelFontSizeMax: number;
    itemLabelRadius: number;
    itemLabelRadiusMax: number;
    itemLabelRotation: number;
    itemLabelStrokeColor: string;
    itemLabelStrokeWidth: number;
    items: any[];
    lineColor: string;
    lineWidth: number;
    offset: { w: number; h: number };
    onCurrentIndexChange: any;
    onRest($event: { type: 'rest'; currentIndex: number; rotation: number }): void;
    onSpin: any;
    overlayImage: any;
    pointerAngle: number;
    pixelRatio: number;
    radius: number;
    rotation: number;
    rotationResistance: number;
    rotationSpeed: number;
    rotationSpeedMax: number;
  }
}
