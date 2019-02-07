import { UIElement, Rect, Size } from './ui-element';
import { TextBlock } from './text-block';

export class UIWindow extends UIElement {
    private title: string;
    get Title(): string {
        return this.title;
    }
    set Title(value: string) {
        this.title = value;
        this.update();
    }

    public TitleBar: TextBlock;
    public Content: UIElement = null;

    constructor() {
        super();
        this.setLeft(100);
        this.setTop(100);
        this.setWidth(200);
        this.setHeight(150);
        this.setBackground('#eeeeee');
        this.setForeground('#111111');
        this.Title = 'Window';
        this.TitleBar = new TextBlock();
        this.update();
    }

    public update() {
        if (this.TitleBar) {
            this.TitleBar.setFont('bold 14px serif');
            this.TitleBar.setLeft(0);
            this.TitleBar.setForeground(this.getBackground());
            this.TitleBar.setBackground(this.getForeground());
            this.TitleBar.setTop(0);
            this.TitleBar.setWidth(super.getWidth());
            this.TitleBar.setHeight(20);
            this.TitleBar.setText(this.Title);
        }
    }

    public draw(ctx: CanvasRenderingContext2D, parentArea: Rect): Size {
        super.draw(ctx, parentArea);
        const titleBarPos: Rect = {
            x: this.parentArea.x + this.getLeft(),
            y: this.parentArea.y + this.getTop(),
            width: super.getWidth(),
            height: this.TitleBar.getHeight(),
        };
        this.TitleBar.draw(ctx, titleBarPos);
        const contentPos: Rect = {
            x: this.parentArea.x + this.getLeft(),
            y: this.parentArea.y + this.getTop() + this.TitleBar.getHeight(),
            width: super.getWidth(),
            height: this.getHeight() - this.TitleBar.getHeight(),
        };
        if (this.Content) {
            this.Content.draw(ctx, contentPos);
        }
        return { width: this.getWidth(), height: this.getHeight()};
    }
}
