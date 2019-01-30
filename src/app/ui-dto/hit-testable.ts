export class HitTestable
{
    private left: number;
    private top: number;
    private width: number;
    private height: number;
    private zIndex: number;

    getZIndex():number {
        return this.zIndex;
    }
    setZIndex(value:number) {
        this.zIndex = value;
        this.onSizeChanged();
    }

    getWidth():number {
        return this.width;
    }
    setWidth(value:number) {
        this.width = value;
        this.onSizeChanged();
    }

    getHeight():number {
        return this.height;
    }
    setHeight(value:number) {
        this.height = value;
        this.onSizeChanged();
    }

    getLeft():number {
        return this.left;
    }
    setLeft(value:number) {
        this.left = value;
        this.onPositionChanged();
    }

    getTop():number {
        return this.top;
    }
    setTop(value:number) {
        this.top = value;
        this.onPositionChanged();
    }

    protected onPositionChanged()
    {

    }

    protected onSizeChanged()
    {

    }

    public HitTest(x: number, y: number): boolean
    {
        return x >= this.getLeft() && x <= this.getLeft() + this.getWidth() && y >= this.getTop() && y <= this.getTop() + this.getHeight();
    }
}