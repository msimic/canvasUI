import { UIElement, Rect, Size } from './ui-element';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import * as _ from 'lodash';

export class StackPanel extends UIElement {
    public Content: UIElement[] = [];

    private orientation = 'vertical';
    getOrientation(): string {
        return this.orientation;
    }
    setOrientation(value: string) {
        this.orientation = value;
    }

    public addChild(el: UIElement) {
        this.Content.push(el);
        this.update();
    }

    public removeChild(el: UIElement) {
        const removeIndex = _.findIndex(this.Content, (e) => e === el);
        this.Content.splice(removeIndex, 1);
        this.update();
    }

    public draw(ctx: CanvasRenderingContext2D, parentArea: Rect): Size {
        this.contextRef = ctx;
        this.parentArea = parentArea;

        let posX = 0;
        let posY = 0;

        for (let index = 0; index < this.Content.length; index++) {
            const element = this.Content[index];
            const elementPos: Rect = {
                x: parentArea.x + posX,
                y: parentArea.y + posY,
                width: parentArea.width - posX,
                height: parentArea.height - posY,
            };
            const elSize = element.draw(ctx, elementPos);

            if (this.orientation === 'vertical') {
                posY += elSize.height;

                if (posY + elSize.height > parentArea.height) {
                    break;
                }
            } else {
                posX += elSize.width;

                if (posX + elSize.width > parentArea.width) {
                    break;
                }
            }
        }


        return { width: posX, height: posY};
    }
}
