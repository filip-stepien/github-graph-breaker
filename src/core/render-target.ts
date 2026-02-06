export interface RenderTarget {
    onFrame(frame: Uint8ClampedArray<ArrayBufferLike>): void | Promise<void>;
    onFinish(allFrames: Uint8ClampedArray<ArrayBufferLike>[]): void | Promise<void>;
}
