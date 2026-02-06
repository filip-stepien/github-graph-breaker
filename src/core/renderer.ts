import { CanvasRenderingContext2D, createCanvas } from 'canvas';

export class Renderer {
    public width: number;

    public height: number;

    public frames: Uint8ClampedArray<ArrayBufferLike>[] = [];

    private ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ctx = createCanvas(width, height).getContext('2d');
    }

    public saveFrame() {
        const frame = this.ctx.getImageData(0, 0, this.width, this.height).data;
        this.frames.push(frame);
        return frame;
    }

    public drawRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        radius: number = 0
    ) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        if (radius > 0) {
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
        } else {
            this.ctx.rect(x, y, width, height);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    public drawCircle(x: number, y: number, radius: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    public clearBackground() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
