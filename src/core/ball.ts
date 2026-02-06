import { Game } from './game';
import { GameEntity, GameEntityBuilder } from './game-entity';

function invertSide(side) {
    switch (side) {
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return null;
    }
}

export class Ball extends GameEntity {
    public velocityX: number;

    public velocityY: number;

    public radius: number;

    public color: string;

    constructor(
        color: string,
        x: number,
        y: number,
        radius: number,
        velocityX: number,
        velocityY: number
    ) {
        super(x, y, radius * 2, radius * 2);
        this.color = color;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    public setVelocity(x: number, y: number) {
        this.velocityX = x;
        this.velocityY = y;
    }

    static builder(): BallBuilder {
        return new BallBuilder();
    }

    override update(game: Game) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (const block of game.blocks) {
            const side = invertSide(block.getCollisionSide(this));

            if (!side) {
                continue;
            }

            if (side === 'top' || side === 'bottom') {
                this.velocityY *= -1;

                if (side === 'top') {
                    this.y = block.getBoundingBox().y - this.height;
                } else {
                    this.y = block.getBoundingBox().y + block.getBoundingBox().height;
                }
            }

            if (side === 'left' || side === 'right') {
                this.velocityX *= -1;

                if (side === 'left') {
                    this.x = block.getBoundingBox().x - this.width;
                } else {
                    this.x = block.getBoundingBox().x + block.getBoundingBox().width;
                }
            }

            block.hit();
            break;
        }

        const { width, height } = game.renderer;

        if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
            this.velocityX *= -1;
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
            this.velocityY *= -1;
        }
    }

    override draw(game: Game) {
        game.renderer.drawCircle(this.x, this.y, this.radius, this.color);
    }
}

export class BallBuilder extends GameEntityBuilder {
    private velocityX: number = 0;

    private velocityY: number = 0;

    private radius: number = 1;

    private color: string = '#ffffff';

    public setVelocity(x: number, y: number) {
        this.velocityX = x;
        this.velocityY = y;
        return this;
    }

    public setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    public setColor(color: string) {
        this.color = color;
        return this;
    }

    public build(): Ball {
        return new Ball(this.color, this.x, this.y, this.radius, this.velocityX, this.velocityY);
    }
}
