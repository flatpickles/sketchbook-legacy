import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

export default class Generator {
    public generate(): Path[] {
        return [
            CurveUtil.createBezierSpline([
                [1, 1],
                [1, 3],
                [3, 2],
                [1, 1],
            ]),
        ];
    }
}
