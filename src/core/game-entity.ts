import { Game } from './game';

export type CollisionSide = 'top' | 'bottom' | 'left' | 'right' | null;

export class GameEntity {
    public x: number = 0;

    public y: number = 0;

    public width: number = 0;

    public height: number = 0;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static builder(): GameEntityBuilder {
        return new GameEntityBuilder();
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public getBoundingBox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    public getCollisionSide(entity: GameEntity): CollisionSide {
        const a = this.getBoundingBox();
        const b = entity.getBoundingBox();

        const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
        const overlapY = a.y < b.y + b.height && a.y + a.height > b.y;

        if (!overlapX || !overlapY) {
            return null;
        }

        const overlapLeft = a.x + a.width - b.x;
        const overlapRight = b.x + b.width - a.x;
        const overlapTop = a.y + a.height - b.y;
        const overlapBottom = b.y + b.height - a.y;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        switch (minOverlap) {
            case overlapLeft:
                return 'left';
            case overlapRight:
                return 'right';
            case overlapTop:
                return 'top';
            case overlapBottom:
                return 'bottom';
        }

        return null;
    }

    public draw(_game: Game) {}

    public update(_game: Game) {}
}

export class GameEntityBuilder {
    protected x: number = 0;

    protected y: number = 0;

    protected width: number = 0;

    protected height: number = 0;

    public setX(x: number) {
        this.x = x;
        return this;
    }

    public setY(y: number) {
        this.y = y;
        return this;
    }

    public setWidth(width: number) {
        this.width = width;
        return this;
    }

    public setHeight(height: number) {
        this.height = height;
        return this;
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }

    public setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        return this;
    }

    public build(): GameEntity {
        return new GameEntity(this.x, this.y, this.width, this.height);
    }
}
