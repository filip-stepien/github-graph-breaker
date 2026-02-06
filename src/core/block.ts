import { Game } from './game';
import { CollisionSide, GameEntity, GameEntityBuilder } from './game-entity';

type BlockState = {
    nextColor: string | null;
};

export class Block extends GameEntity {
    private static readonly BLOCK_STATES: Map<string, BlockState> = new Map([
        ['#9be9a8', { nextColor: 'rgba(0,0,0,0)' }],
        ['#40c463', { nextColor: 'rgba(0,0,0,0)' }],
        ['#30a14e', { nextColor: 'rgba(0,0,0,0)' }],
        ['#216e39', { nextColor: 'rgba(0,0,0,0)' }],
        ['rgba(0,0,0,0)', { nextColor: null }]
    ]);

    public currentColor: string;

    constructor(color: string, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const blockState = Block.BLOCK_STATES.get(color);

        if (blockState) {
            this.currentColor = color;
        } else {
            throw new Error(`There is no valid state for block with color ${color}.`);
        }
    }

    public static builder(): BlockBuilder {
        return new BlockBuilder();
    }

    public hit() {
        const nextColor = Block.BLOCK_STATES.get(this.currentColor)!.nextColor;

        if (nextColor !== null) {
            this.currentColor = nextColor;
        }
    }

    public override getCollisionSide(entity: GameEntity): CollisionSide {
        const nextColor = Block.BLOCK_STATES.get(this.currentColor)!.nextColor;
        return nextColor === null ? null : super.getCollisionSide(entity);
    }

    public override draw(game: Game): void {
        game.renderer.drawRect(this.x, this.y, this.width, this.height, this.currentColor, 2);
    }
}

export class BlockBuilder extends GameEntityBuilder {
    private color: string = '#56d364';

    public setColor(color: string): BlockBuilder {
        this.color = color;
        return this;
    }

    public build(): Block {
        return new Block(this.color, this.x, this.y, this.width, this.height);
    }
}
