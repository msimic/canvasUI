import { UIElement, Rect, Size } from './ui-element';
import { isUndefined } from 'util';

export class TextBlock extends UIElement {
    public text: string;
    public font: string;

    getText(): string {
        return this.text;
    }
    setText(value: string) {
        this.text = value;
    }

    getFont(): string {
        return this.font;
    }
    setFont(value: string) {
        this.font = value;
    }

    public draw( ctx: CanvasRenderingContext2D, parentArea: Rect): Size {
        super.draw(ctx, parentArea);
        ctx.save();
        this.contextRef = ctx;
        this.parentArea = parentArea;
        ctx.rect(parentArea.x, parentArea.y, parentArea.width, parentArea.height);
        ctx.clip();
        ctx.translate(parentArea.x, parentArea.y);
        ctx.fillStyle = this.getForeground();
        const oldFont = ctx.font;
        ctx.font = this.getFont();
        const metrics = ctx.measureText(this.getText());

        let w = this.getWidth();
        if (!w) {
            w = metrics.width;
        }
        let h = this.getHeight();
        if (!h) {
            h = parseInt(ctx.font, null) * 1.2;
        }

        let x = this.getLeft();
        if (isUndefined(x)) {
            x = 0;
        } else { // todo better padding
            x += 3;
        }

        let y = this.getTop();
        if (isUndefined(y)) {
            y = 0;
        } else { // todo better padding
            y -= 3;
        }

        ctx.fillText(this.getText(), x, y + h, w);
        ctx.translate(-parentArea.x, -parentArea.y);
        ctx.font = oldFont;
        ctx.restore();

        return { width: w , height: h};
    }
}
