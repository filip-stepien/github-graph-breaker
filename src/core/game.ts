import { Ball } from './ball';
import { Block } from './block';
import { GameEntity } from './game-entity';
import { RenderTarget } from './render-target';
import { Renderer } from './renderer';

export class Game {
    public blocks: Block[] = [];

    public ball: Ball;

    public renderer: Renderer;

    private gameEntities: GameEntity[];

    private renderTargets: RenderTarget[];

    private stopRequested = false;

    constructor(
        renderer: Renderer,
        ball: Ball,
        blocks: Block[] = [],
        renderTargets: RenderTarget[] = []
    ) {
        this.renderer = renderer;
        this.ball = ball;
        this.blocks = blocks;
        this.renderTargets = renderTargets;
        this.gameEntities = [ball, ...blocks];
    }

    public static builder(): GameBuilder {
        return new GameBuilder();
    }

    public requestStop() {
        this.stopRequested = true;
    }

    public async start() {
        const maxBrokenBlocks = 20;

        while (
            this.blocks.map(block => block.currentColor === 'rgba(0,0,0,0)').filter(block => block)
                .length < maxBrokenBlocks &&
            !this.stopRequested
        ) {
            this.renderer.clearBackground();

            for (const entity of this.gameEntities) {
                entity.update(this);
                entity.draw(this);
            }

            const frame = this.renderer.saveFrame();
            await Promise.all(this.renderTargets.map(target => target.onFrame(frame)));
        }

        await Promise.all(this.renderTargets.map(target => target.onFinish(this.renderer.frames)));
    }
}

export class GameBuilder {
    private renderer!: Renderer;

    private ball!: Ball;

    private blocks: Block[] = [];

    private renderTargets: RenderTarget[] = [];

    public setRenderer(renderer: Renderer): GameBuilder {
        this.renderer = renderer;
        return this;
    }

    public setRenderTargets(...targets: RenderTarget[]) {
        this.renderTargets = targets;
        return this;
    }

    public setBall(ball: Ball): GameBuilder {
        this.ball = ball;
        return this;
    }

    public setBlocks(blocks: Block[]): GameBuilder {
        this.blocks = blocks;
        return this;
    }

    public addBlock(block: Block): GameBuilder {
        this.blocks.push(block);
        return this;
    }

    public build(): Game {
        if (!this.renderer) {
            throw new Error('Game requires renderer object set.');
        }

        if (!this.ball) {
            throw new Error('Game requires ball object set.');
        }

        if (this.renderTargets.length === 0) {
            throw new Error('Set at least one render target.');
        }

        return new Game(this.renderer, this.ball, this.blocks, this.renderTargets);
    }
}
