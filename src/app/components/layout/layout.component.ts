import { Component, OnInit, ViewChildren, TemplateRef, QueryList, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash';
import { IConfig, defaultConfig, IRow, IColumn } from '../../dto/IConfig';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentInit {

  localStorageName = 'layout';
  config: IConfig = null;

  @ViewChild('canvasTemplate') canvasTemplate: TemplateRef<any>;

  @ViewChild('devTemplate') devTemplate: TemplateRef<any>;

  @ViewChild('defaultTemplate') defaultTemplate: TemplateRef<any>;

  public loaded = false;
  defaultConfig: IConfig;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem(this.localStorageName)) {
        this.defaultConfig = cloneDeep(defaultConfig);
        this.config = JSON.parse(localStorage.getItem(this.localStorageName));
    } else {
        this.resetConfig();
    }
  }

  ngAfterContentInit(): void {
     this.loaded = true;
  }

  resetConfig() {
    this.config = cloneDeep(defaultConfig);
    this.defaultConfig = cloneDeep(defaultConfig);
    localStorage.removeItem(this.localStorageName);
  }

  onDragEnd(columnindex: number, e: {gutterNum: number, sizes: Array<number>}) {
    // Column dragged
    if (columnindex === -1) {
        // Set size for all visible columns
        this.config.columns.filter(c => c.visible === true).forEach((column, index) => column.size = e.sizes[index]);
    } else {
        // Set size for all visible rows from specified column
        this.config.columns[columnindex].rows.filter(r => r.visible === true).forEach((row, index) => row.size = e.sizes[index]);
    }

    this.saveLocalStorage();
  }

  toggleDisabled() {
      this.config.disabled = !this.config.disabled;

      this.saveLocalStorage();
  }

  refreshColumnVisibility() {
      // Refresh columns visibility based on inside rows visibilities (If no row > hide column)
      this.config.columns.forEach((column, index) => {
          column.visible = column.rows.some(row => row.visible === true);
      });

      this.saveLocalStorage();
  }

  saveLocalStorage() {
      localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
  }

  getTemplate(row: IRow, column: IColumn): TemplateRef<any> {
    console.log(row.type);
    console.log(this[row.type]);
    return this[row.type] ? this[row.type] : this.defaultTemplate;
  }

  moveRight(columnIndex, rowIndex) {
    const col = this.config.columns[columnIndex];
    const row = col.rows[rowIndex];

    if (this.config.columns.length - 1 > columnIndex) {
      const nextCol = this.config.columns[columnIndex + 1];
      const nextRow = nextCol.rows[rowIndex];
      const curType = row.type;
      row.type = nextRow.type;
      nextRow.type = curType;

      this.saveLocalStorage();
    }
  }

  moveDown(columnIndex, rowIndex) {
    const col = this.config.columns[columnIndex];
    const row = col.rows[rowIndex];

    if (col.rows.length - 1 > rowIndex) {
      const nextRow = col.rows[rowIndex + 1];
      const curType = row.type;
      row.type = nextRow.type;
      nextRow.type = curType;

      this.saveLocalStorage();
    }
  }

  gutterRowClick(column: number, e: {gutterNum: number, sizes: Array<number>}) {

    if (this.config.disabled) { return; }

    if (e.gutterNum === 1) {
      const col = this.config.columns[column];
      const normalSize = 100 / col.rows.length;
      if (col.rows[0].size > 0) {
          col.rows[1].size += col.rows[0].size;
          col.rows[0].size = 0;
      } else if (this.config.columns[1].rows[0].size > normalSize) {
          col.rows[1].size -= normalSize;
          col.rows[0].size = normalSize;
      } else {
          for (let index = 0; index < col.rows.length; index++) {
            const element = col.rows[index];
            element.size = normalSize;
          }
      }

      this.saveLocalStorage();
    }
  }

  getDefaultColumnSize(colNum: number): number {
    return this.defaultConfig.columns[colNum].size;
  }

  addMissingSizeToColumn(col: number): number {
    const sum = this.config.columns.reduce((pv, cv, ci, cols) => {
      if (ci <= col && cv.visible) {
        pv.size += cv.size;
      }
      return pv;
    }, {
      visible: true,
      size: 0,
      rows: null
    });

    return this.config.columns[col].size += 100 - sum.size;
  }
  anyVisibleColumnAfter(col: number): boolean {
    return this.config.columns.filter((c, i) => {
      if (i > col) {
        if (c.visible) {
          return true;
        }
      }
      return false;
    }).length > 0;
  }

  gutterColClick(e: {gutterNum: number, sizes: Array<number>}) {

    if (this.config.disabled) { return; }

    const normalSize = 100 / this.config.columns.length;
    if (e.gutterNum === 1) {
      if (this.config.columns[0].size > 0) {
          this.config.columns[1].size += this.config.columns[0].size;
          this.config.columns[0].size = 0;
          if (!this.anyVisibleColumnAfter(1)) {
            this.addMissingSizeToColumn(1);
          }
      } else if (this.config.columns[1].size > this.getDefaultColumnSize(1)) {
          this.config.columns[1].size -= this.getDefaultColumnSize(0);
          this.config.columns[0].size = this.getDefaultColumnSize(0);
          if (!this.anyVisibleColumnAfter(1)) {
            this.addMissingSizeToColumn(1);
          }
      } else {
        for (let index = 0; index < this.config.columns.length; index++) {
          const element = this.config.columns[index];
          element.size = normalSize;
        }
      }
      this.saveLocalStorage();
      return;
    }

    if (e.gutterNum === this.config.columns.length - 1) {
      if (this.config.columns[this.config.columns.length - 1].size > 0) {
          this.config.columns[this.config.columns.length - 2].size += this.config.columns[this.config.columns.length - 1].size;
          this.config.columns[this.config.columns.length - 1].size = 0;
      } else if (this.config.columns[this.config.columns.length - 2].size > this.getDefaultColumnSize(this.config.columns.length - 2)) {
          this.config.columns[this.config.columns.length - 2].size -= this.getDefaultColumnSize(this.config.columns.length - 1);
          this.config.columns[this.config.columns.length - 1].size = this.getDefaultColumnSize(this.config.columns.length - 1);
      } else {
        for (let index = 0; index < this.config.columns.length; index++) {
          const element = this.config.columns[index];
          element.size = normalSize;
        }
      }
      this.saveLocalStorage();
      return;
    }
  }
}
