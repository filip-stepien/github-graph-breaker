import { writeFileSync } from 'fs';
import { createCanvas, Canvas } from 'canvas';
import { RenderTarget } from './render-target';

export class PngRenderTarget implements RenderTarget {
    private frameCount = 0;

    private width: number;

    private height: number;

    private outputFile: string;

    constructor(width: number, height: number, outputFile: string) {
        this.width = width;
        this.height = height;
        this.outputFile = outputFile;
    }

    public onFrame(frame: Uint8ClampedArray) {
        const canvas: Canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(this.width, this.height);
        imageData.data.set(frame);
        ctx.putImageData(imageData, 0, 0);

        const buffer = canvas.toBuffer('image/png');
        writeFileSync(this.outputFile, buffer);

        this.frameCount++;
    }

    public onFinish(frames: Uint8ClampedArray[]) {
        console.log(`Saved ${this.outputFile}`);
    }
}
