// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

export default class Generator {
    public generate(): Path[] {
        const circlePath = PathUtil.approximateCircle([1, 1], 1);
        return [circlePath];
    }
}
