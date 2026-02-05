import { getContributionCalendar } from './lib/data';
import GIFEncoder from 'gif-encoder';
import fs from 'fs';
import { Renderer } from './core/Renderer';

async function createGif() {
    const calendar = await getContributionCalendar();
    const cellSize = 10;
    const cellRadius = 2;
    const gap = 3;
    const width = calendar.weeks.length * (cellSize + gap) - gap;
    const height = 7 * (cellSize + gap) - gap;

    const renderer = new Renderer(width, height);

    const encoder = new GIFEncoder(width, height);
    encoder.pipe(fs.createWriteStream('contributions.gif'));
    encoder.setQuality(10);
    encoder.setTransparent(0x0);
    encoder.writeHeader();

    calendar.weeks.forEach((week, i) => {
        week.contributionDays.forEach((day, j) => {
            if (day.contributionCount > 0) {
                const x = i * (cellSize + gap);
                const y = j * (cellSize + gap);
                renderer.drawSquare(x, y, cellSize, cellRadius, day.color);
                encoder.addFrame(renderer.getImageData());
                encoder.read();
            }
        });
    });

    encoder.finish();
}

createGif();
