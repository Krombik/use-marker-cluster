import MarkerCluster, {
  Coords,
  MarkerMapper,
  ClusterMapper,
  MarkerClusterOptions,
} from "marker-cluster";
import { useEffect, useState } from "react";
import { useConst } from "./utils";

export type UseMarkerClusterOptions = MarkerClusterOptions & {
  /**
   * if `true`, the {@link MarkerCluster.loadAsync loadAsync} method will be used for clustering, otherwise {@link MarkerCluster.load load}
   */
  asyncMode?: boolean;
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
  const forceUpdate = useState<{}>()[1];

  const markerCluster = useConst(() => {
    const markerCluster = new MarkerCluster(getLngLat, options);

    const parentCb = markerCluster.callback;

    markerCluster.callback = () => {
      parentCb();

      forceUpdate({});
    };

    return markerCluster;
  });

  useEffect(() => {
    markerCluster[options && options.asyncMode ? "loadAsync" : "load"](points);
  }, [points]);

  return markerCluster;
};

/**
 * If {@link UseMarkerClusterOptions.asyncMode asyncMode} was set, use this method to abandon {@link MarkerCluster.worker worker} if it needed
 */
useMarkerCluster.cleanup = () => {
  MarkerCluster.cleanup();
};

export default useMarkerCluster;
