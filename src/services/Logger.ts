import fs from "fs";

class Logger
{
    static storagePath: string = `${__dirname}/../../storage/logs/`;

    public write = async (content: string, path: string) => {
        const writeStream = fs.createWriteStream(`${Logger.storagePath}${path}`, {'flags': 'a'});

        writeStream.write(`${content}\r\n`);
    };
}

export default new Logger;