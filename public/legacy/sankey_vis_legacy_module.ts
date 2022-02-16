/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { IModule } from 'angular';

// @ts-ignore
import { KbnSankeyVisController } from './sankey_vis_controller.js';
// @ts-ignore
import { KbnAggTable } from './agg_table/agg_table';
// @ts-ignore
import { KbnAggTableGroup } from './agg_table/agg_table_group';

/** @internal */
export const initSankeyVisLegacyModule = (angularIns: IModule): void => {
  angularIns
    .controller('KbnSankeyVisController', KbnSankeyVisController)
    .directive('kbnAggTable', KbnAggTable)
    .directive('kbnAggTableGroup', KbnAggTableGroup)
};
