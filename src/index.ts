import { getContributionCalendar } from './lib/data';
import { Renderer } from './core/renderer';
import { Ball } from './core/ball';
import { Block } from './core/block';
import { Game } from './core/game';
import { PngRenderTarget } from './core/png-render-target';
import { GifRenderTarget } from './core/gif-render-target';

const blockSize = 10;
const gap = 3;

async function start() {
    const calendar = await getContributionCalendar();
    const blocks: Block[] = [];

    calendar.weeks.forEach((week, i) => {
        week.contributionDays.forEach((day, j) => {
            if (day.contributionCount === 0) {
                return;
            }

            const x = i * (blockSize + gap);
            const y = j * (blockSize + gap);

            const block = Block.builder()
                .setPosition(x, y)
                .setSize(blockSize, blockSize)
                .setColor(day.color)
                .build();

            blocks.push(block);
        });
    });

    const width = calendar.weeks.length * (blockSize + gap) - gap;
    const height = 7 * (blockSize + gap) - gap;

    const ball = Ball.builder().setRadius(3).setPosition(2, 4).setVelocity(4.5, 4.5).build();
    const renderer = new Renderer(width, height);
    const pngTarget = new PngRenderTarget(width, height, 'frame.png');
    const gifTarget = new GifRenderTarget(width, height, 'frame.gif');
    const game = Game.builder()
        .setRenderTargets(pngTarget, gifTarget)
        .setRenderer(renderer)
        .setBall(ball)
        .setBlocks(blocks)
        .build();

    process.on('SIGINT', async () => {
        console.log('\nStopping game...');
        game.requestStop();
    });

    game.start();
}

start();
