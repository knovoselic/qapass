import { injectable } from "inversify";

@injectable()
export default abstract class Transformer
{
    public transformArray(items: Array<any>): Array<any>
    {
        let out: Array<any> = [];

        items.forEach(item => {
            out.push(
                this.transform(item)
            )
        });

        return out;
    }

    public abstract transform(item: any): any;
}