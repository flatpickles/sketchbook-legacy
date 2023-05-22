// @ts-ignore - ignore unresolved import for template file
import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

import PolylineUtil from '../../Util/PolylineUtil';

export default class Generator {
    public generate(): [number, number][] {
        let points: [number, number][] = [
            [1, 1],
            [1, 3],
            [3, 2],
            [5, 5],
            [1, 4.5],
            [1, 4.9],
            [1, 5],
        ];
        points = PolylineUtil.evenlySpacePoints(points);
        console.log(points);
        return points;
    }
}
