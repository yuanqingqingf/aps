import { ContainerModule, GroupRenderContribution } from "@visactor/vtable/es/vrender";

import { DateHeaderGroupBeforeRenderContribution } from "./group-contribution-render";

export default new ContainerModule(((bind, unbind, isBound, rebind) => {
    bind(DateHeaderGroupBeforeRenderContribution).toSelf().inSingletonScope(), bind(GroupRenderContribution).toService(DateHeaderGroupBeforeRenderContribution);
}));
//# sourceMappingURL=index.js.map