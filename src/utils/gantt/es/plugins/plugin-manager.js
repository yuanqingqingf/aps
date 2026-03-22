export class PluginManager {
    constructor(gantt, options) {
        var _a;
        this.plugins = new Map, this.gantt = gantt, null === (_a = options.plugins) || void 0 === _a || _a.forEach((plugin => {
            this.register(plugin), this._initializePluginRun(plugin);
        }));
    }
    _initializePluginRun(plugin) {
        if (void 0 === plugin.runTime) try {
            plugin.run(this.gantt);
        } catch (error) {} else this._bindGanttEventForPlugin(plugin);
    }
    register(plugin) {
        this.plugins.set(plugin.id, plugin);
    }
    registerAll(plugins) {
        plugins.forEach((plugin => this.register(plugin)));
    }
    getPlugin(id) {
        return this.plugins.get(id);
    }
    getPluginByName(name) {
        return Array.from(this.plugins.values()).find((plugin => plugin.name === name));
    }
    _bindGanttEventForPlugin(plugin) {
        plugin.runTime && plugin.runTime.forEach((runTime => {
            this.gantt.on(runTime, ((...args) => {
                var _a;
                try {
                    null === (_a = plugin.run) || void 0 === _a || _a.call(plugin, ...args, runTime, this.gantt);
                } catch (error) {}
            }));
        }));
    }
    updatePlugins(plugins) {
        Array.from(this.plugins.values()).filter((plugin => !(null == plugins ? void 0 : plugins.some((p => p.id === plugin.id))))).forEach((plugin => {
            this.release(), this.plugins.delete(plugin.id);
        })), this.plugins.forEach((plugin => {
            plugin.update && plugin.update();
        }));
        const addedPlugins = null == plugins ? void 0 : plugins.filter((plugin => !this.plugins.has(plugin.id)));
        null == addedPlugins || addedPlugins.forEach((plugin => {
            this.register(plugin), this._initializePluginRun(plugin);
        }));
    }
    release() {
        this.plugins.forEach((plugin => {
            var _a;
            try {
                null === (_a = plugin.release) || void 0 === _a || _a.call(plugin, this.gantt);
            } catch (error) {}
        }));
    }
}
//# sourceMappingURL=plugin-manager.js.map