import Logger from '../../../services/Logger';
import fs_module from 'fs';

describe('Logger.write', () => {
    it('calls fs.createWriteStream and fs.write', async () => {
        const write = jest.fn();

        const createWriteStream = jest.fn(() => {
            return {
                write: write as Function
            }
        });

        const fs = {
            createWriteStream: createWriteStream as any
        } as typeof fs_module;

        const logger = new Logger(fs);

        const content = 'content';

        await logger.write(content, 'errors.log');

        expect(createWriteStream).toHaveBeenCalledTimes(1);
        expect(write).toHaveBeenCalledTimes(1);
        expect(write).toHaveBeenLastCalledWith(`${content}\r\n`);
    });
});