import { HitTestable } from './hit-testable';

export class Size {
    width: number;
    height: number;
}

export class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export class UIElement extends HitTestable {
    private background: string;

    private foreground: string;

    protected contextRef: CanvasRenderingContext2D;
    protected parentArea: Rect;
    getBackground(): string {
        return this.background;
    }
    setBackground(value: string) {
        this.background = value;
    }
    getForeground(): string {
        return this.foreground;
    }
    setForeground(value: string) {
        this.foreground = value;
    }

    public update() {

    }

    public draw(ctx: CanvasRenderingContext2D, parentArea: Rect): Size {
        ctx.save();
        this.contextRef = ctx;
        this.parentArea = parentArea;
        ctx.rect(parentArea.x, parentArea.y, parentArea.width, parentArea.height);
        ctx.clip();
        const el = this;
        ctx.translate(parentArea.x, parentArea.y);
        ctx.beginPath();
        ctx.rect(el.getLeft(), el.getTop(), el.getWidth(), el.getHeight());
        ctx.closePath();
        ctx.fillStyle = el.getBackground();
        ctx.fill();
        ctx.strokeStyle = el.getForeground();
        ctx.strokeRect(el.getLeft(), el.getTop(), el.getWidth(), el.getHeight());
        ctx.translate(-parentArea.x, -parentArea.y);
        ctx.restore();
        return { width: el.getWidth(), height: el.getHeight()};
    }

    protected onPositionChanged() {
        this.update();
        if (this.contextRef) { this.draw(this.contextRef, this.parentArea); }
    }

    protected onSizeChanged() {
        this.update();
        if (this.contextRef) { this.draw(this.contextRef, this.parentArea ); }
    }
}
