import type { IContext2d, IDrawContext, IMarkAttribute, IGraphicAttribute, IThemeAttribute, IGroupGraphicAttribute, IGroup, IGroupRenderContribution } from '@visactor/vtable/es/vrender';
import { BaseRenderContributionTime } from '@visactor/vtable/es/vrender';
export declare class DateHeaderGroupBeforeRenderContribution implements IGroupRenderContribution {
    time: BaseRenderContributionTime;
    useStyle: boolean;
    order: number;
    supportedAppName: string;
    drawShape(group: IGroup, context: IContext2d, x: number, y: number, doFill: boolean, doStroke: boolean, fVisible: boolean, sVisible: boolean, groupAttribute: Required<IGroupGraphicAttribute>, drawContext: IDrawContext, fillCb?: (ctx: IContext2d, markAttribute: Partial<IMarkAttribute & IGraphicAttribute>, themeAttribute: IThemeAttribute) => boolean, strokeCb?: (ctx: IContext2d, markAttribute: Partial<IMarkAttribute & IGraphicAttribute>, themeAttribute: IThemeAttribute) => boolean, doFillOrStroke?: {
        doFill: boolean;
        doStroke: boolean;
    }): void;
}
