import { CanvasRenderingContext2D, createCanvas } from 'canvas';

export class Renderer {
    private width: number;

    private height: number;

    private ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.ctx = createCanvas(width, height).getContext('2d');
    }

    public getImageData() {
        return this.ctx.getImageData(0, 0, this.width, this.height).data;
    }

    public drawSquare(x: number, y: number, s: number, r: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + s - r, y);
        this.ctx.quadraticCurveTo(x + s, y, x + s, y + r);
        this.ctx.lineTo(x + s, y + s - r);
        this.ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
        this.ctx.lineTo(x + r, y + s);
        this.ctx.quadraticCurveTo(x, y + s, x, y + s - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    public clearBackground() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
