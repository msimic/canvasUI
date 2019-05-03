import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UIWindow } from '../../ui-dto/window';
import { UIElement } from '../../ui-dto/ui-element';
import * as _ from 'lodash';
import { StackPanel } from '../../ui-dto/stack-panel';
import { TextBlock } from '../../ui-dto/text-block';

@Component({
  selector: 'app-canvas-ui',
  templateUrl: './canvas-ui.component.html',
  styleUrls: ['./canvas-ui.component.scss']
})
export class CanvasUIComponent implements OnInit {

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  public ui_elements: UIElement[] = [];

  constructor() { }

  ngOnInit() {
    this.generateRandomWindows();
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    window.requestAnimationFrame(this.loop.bind(this));
    this.canvas.nativeElement.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event: MouseEvent) {
    console.log(event.offsetX + ' / ' + event.offsetY);
    const maxZElm = _.maxBy(this.ui_elements, function(o) { return o.getZIndex(); });
    const maxZ = maxZElm ? maxZElm.getZIndex() : 0;
    for (let index = 0; index < this.ui_elements.length; index++) {
      const element = this.ui_elements[index];
      if (element.HitTest(event.offsetX, event.offsetY)) {
        element.setZIndex(maxZ + 1);
      }
    }
  }

  generateRandomWindows(): any {
    for (let index = 0; index < 2; index++) {
      const wnd = new UIWindow();
      wnd.setLeft(50 + index * 10 * 10);
      wnd.setTop(50 + index * 10 * 10);
      const width = 100 + (Math.floor(Math.random() * 10) + 1) * 30;
      const height = 100 + (Math.floor(Math.random() * 10) + 1) * 30;
      wnd.setHeight(height);
      wnd.setWidth(width);
      wnd.Title = 'Window ' + index;
      const sp = new StackPanel();
      sp.setOrientation(index / 2 === 0 ? 'vertical' : 'horizontal');
      for (let index2 = 0; index2 < 20; index2++) {
        const tb = new TextBlock();
        const tb2 = new TextBlock();
        tb.setText(index + index / 2 === 0 ? ' TextBlock in vertical Stackpanel' : ' hor stack ');
        tb2.setText(index + index / 2 === 0 ? `TestLong TestLong TestLong TestLong TestLong
         TestLong TestLong TestLong TestLong TestLong TestLong TestLong TestLong ` : 'hor');
        tb.setForeground('#ff0000');
        tb2.setForeground('#000ff0');
        sp.addChild(tb);
        sp.addChild(tb2);
      }
      wnd.Content = sp;
      this.ui_elements.push(wnd);
    }
  }

  loop(timestamp: number) {
    console.log('Redrawing canvas at timespamp: ' + timestamp);
    this.update(timestamp);
    this.redraw(timestamp);
  }

  update(timestamp: number) {
    this.ui_elements.forEach(el => {
      el.update();
    });
  }

  redraw(timestamp: number) {
    if (!this.context) { return; }

    this.initCanvasProperties();

    const ctx = this.context;

    this.clearCanvas(ctx);

    this.drawChildren(ctx);

  }


  private initCanvasProperties() {
    this.width = this.canvas.nativeElement.clientWidth;
    this.height = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
  }

  private drawChildren(ctx: CanvasRenderingContext2D) {
    _.orderBy(this.ui_elements, [(e) => e.getZIndex()], ['asc']).forEach(el => {
      el.draw(ctx, {x: 0, y: 0, width: this.width, height: this.height });
    });
  }

  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.closePath();
    ctx.fillStyle = '#cceeaa';
    ctx.fill();
  }
}
