import { IModule } from 'angular';

// @ts-ignore
import { KbnSankeyVisController } from './sankey_vis_controller';

/** @internal */
export const initSankeyVisLegacyModule = (angularIns: IModule): void => {
  angularIns
    .controller('KbnSankeyVisController', ['$scope','$element','tableConfig',KbnSankeyVisController]);
};
