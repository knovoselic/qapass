import fs from "fs";
import { injectable } from "inversify";

@injectable()
class Logger
{
    protected rootLogPath: string = `${__dirname}/../../storage/logs/`;
    protected fs: typeof fs;

    public constructor(fs_module: typeof fs) {
        this.fs = fs_module;
    }

    public write = async (content: string, path: string) => {

        return this.fs.createWriteStream(`${this.rootLogPath}${path}`, {'flags': 'a'})
            .write(`${content}\r\n`);
    };
}

export default Logger;