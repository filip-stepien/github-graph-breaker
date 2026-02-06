import GIFEncoder from 'gif-encoder';
import { createWriteStream } from 'fs';
import { RenderTarget } from './render-target';

export class GifRenderTarget implements RenderTarget {
    private encoder: GIFEncoder;

    constructor(width: number, height: number, outputFile: string) {
        this.encoder = new GIFEncoder(width, height);
        this.encoder.pipe(createWriteStream(outputFile));
        this.encoder.setTransparent(0x0);
        this.encoder.setRepeat(0);
        this.encoder.writeHeader();
    }

    public onFrame(frame: Uint8ClampedArray) {
        this.encoder.addFrame(frame);
        this.encoder.read();
    }

    public onFinish() {
        this.encoder.finish();
        console.log('GIF saved!');
    }
}
