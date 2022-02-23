import angular, { IModule, auto, IRootScopeService, IScope, ICompileService } from 'angular';
import $ from 'jquery';

import { CoreSetup } from '../../../../src/core/public';
import { VisParams } from '../../../../src/plugins/visualizations/public';
import { getAngularModule } from './get_inner_angular';
import { getKibanaLegacy, getVisualization } from '../services';
import { initSankeyVisLegacyModule } from './sankey_vis_legacy_module';
// @ts-ignore
import tableVisTemplate from './table_vis.html';
import { BaseVisType } from '../../../../src/plugins/visualizations/public/vis_types';
import { IInterpreterRenderHandlers } from '../../../../src/plugins/expressions';

const innerAngularName = 'kibana/table_vis';

export function getTableVisualizationControllerClass(
  core: CoreSetup
) {
  return class TableVisualizationController {
    private tableVisModule: IModule | undefined;
    private injector: auto.IInjectorService | undefined;
    el: JQuery<Element>;
    $rootScope: IRootScopeService | null = null;
    $scope: (IScope & { [key: string]: any }) | undefined;
    $compile: ICompileService | undefined;
    params: object;
    handlers: any;
    vis: BaseVisType;

    constructor(domeElement: Element, visName: string) {
      this.el = $(domeElement);
      this.vis = getVisualization().get(visName);
    }

    getInjector() {
      if (!this.injector) {
        const mountpoint = document.createElement('div');
        mountpoint.className = 'visualization';
        this.injector = angular.bootstrap(mountpoint, [innerAngularName], {
          strictDi: true
        } );
        this.el.append(mountpoint);
      }

      return this.injector;
    }

    async initLocalAngular() {
      if (!this.tableVisModule) {
        const [coreStart] = await core.getStartServices();
        const { initAngularBootstrap } = await import('./angular/angular_bootstrap');
        initAngularBootstrap();
        this.tableVisModule = getAngularModule(innerAngularName, coreStart);
        initSankeyVisLegacyModule(this.tableVisModule);
        getKibanaLegacy().loadFontAwesome();
      }
    }

    async render(
      esResponse: object,
      visParams: VisParams,
      handlers: IInterpreterRenderHandlers
      ): Promise<void> {
      await this.initLocalAngular();
      // The notification should be shown only when the user select one sub aggregation.
      // if (esResponse.tables[0].columns.length === 2) {
      //   getNotifications().toasts.addWarning({ title: 'Warning', text: 'Minimum two sub aggs needed.'});
      // }

      return new Promise((resolve, reject) => {
        try {
          if (!this.$rootScope) {
            const $injector = this.getInjector();
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
          }
          const updateScope = () => {
            if (!this.$scope) {
              return;
            }
            this.$scope.vis = this.vis;
            this.$scope.visState = { params: visParams, title: visParams.title };
            this.$scope.esResponse = esResponse;

            this.$scope.visParams = visParams;
            this.$scope.renderComplete = resolve;
            this.$scope.renderFailed = reject;
            this.$scope.resize = Date.now();
            this.$scope.$apply();
          };

          if (!this.$scope && this.$compile) {
            this.$scope = this.$rootScope.$new();
            this.$scope.uiState = handlers.uiState;
            this.$scope.filter = handlers.event;
            updateScope();
            this.el.find('.visualization').append(this.$compile(tableVisTemplate)(this.$scope));
            this.el.find('.visChart__spinner').remove();
            this.$scope.$apply();
          } else {
            updateScope();
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    destroy() {
      if (this.$rootScope) {
        this.$rootScope.$destroy();
        this.$rootScope = null;
      }
    }
  };
}
