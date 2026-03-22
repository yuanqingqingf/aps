import { ScrollBar } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
export declare class ScrollBarComponent {
    hScrollBar: ScrollBar;
    vScrollBar: ScrollBar;
    _gantt: Gantt;
    _clearHorizontalScrollBar: any;
    _clearVerticalScrollBar: any;
    constructor(gantt: Gantt);
    createScrollBar(tableWidth: number, tableHeight: number): void;
    refresh(): void;
    hideVerticalScrollBar(): void;
    showVerticalScrollBar(autoHide?: boolean): void;
    hideHorizontalScrollBar(): void;
    showHorizontalScrollBar(autoHide?: boolean): void;
    updateVerticalScrollBarPos(topRatio: number): void;
    updateHorizontalScrollBarPos(leftRatio: number): void;
    updateScrollBar(): void;
}
