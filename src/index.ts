import noop from "lodash.noop";
import MarkerCluster, {
  Coords,
  MarkerMapper,
  ClusterMapper,
  MarkerClusterOptions,
} from "marker-cluster";
import { useEffect } from "react";
import useConst from "react-helpful-utils/useConst";
import useForceRerender from "react-helpful-utils/useForceRerender";

export type UseMarkerClusterOptions = MarkerClusterOptions & {
  /**
   * if `true`, the {@link MarkerCluster.loadAsync loadAsync} method will be used for clustering, otherwise {@link MarkerCluster.load load}
   */
  asyncMode?: boolean;
  /**
   * a method that will be executed only after the clustering is completed
   */
  onLoaded?(): void;
};

export type { Coords, MarkerMapper, ClusterMapper };

/**
 * @param points - The points to be clustered
 * @param getLngLat - Function to get the latitude and longitude coordinates of a marker
 * @param options - Options for configuring the clustering
 */
const useMarkerCluster = <P>(
  points: P[],
  getLngLat: (item: P) => Coords,
  options?: UseMarkerClusterOptions
) => {
  const forceUpdate = useForceRerender();

  const markerCluster = useConst(() => {
    const markerCluster = new MarkerCluster(getLngLat, options);

    const parentCb = markerCluster.callback;

    markerCluster.callback = () => {
      parentCb();

      forceUpdate();
    };

    return markerCluster;
  });

  useEffect(() => {
    const onLoaded = (options && options.onLoaded) || noop;

    if (options && options.asyncMode) {
      markerCluster.loadAsync(points).then(onLoaded);
    } else {
      markerCluster.load(points);

      onLoaded();
    }
  }, [points]);

  markerCluster.isLoading = points !== markerCluster.points;

  return markerCluster;
};

/**
 * If {@link UseMarkerClusterOptions.asyncMode asyncMode} has been set, use this method to abandon the {@link MarkerCluster.worker worker} if necessary
 */
useMarkerCluster.cleanup = () => {
  MarkerCluster.cleanup();
};

export default useMarkerCluster;
