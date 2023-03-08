# useMarkerCluster

A React hook for clustering markers using the [marker-cluster](https://github.com/Krombik/marker-cluster) library.

## Example

```tsx
import useMarkerCluster from "use-marker-cluster";
import { GoogleMap, OverlayView } from "google-maps-js-api-react";

const Map = ({ points }) => {
  const markerCluster = useMarkerCluster(
    points,
    (point) => [point.lng, point.lat],
    {
      asyncMode: true,
    }
  );

  return (
    <GoogleMap
      style={mapStyle}
      defaultOptions={{
        scrollwheel: true,
        center: { lat: 0, lng: 0 },
        zoom: 5,
      }}
      // it's probably better to wrap it in a debounce method or use setTransition
      onBoundsChanged={function (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        markerCluster
          .setZoom(this.getZoom()!)
          .setBounds(sw.lng(), sw.lat(), ne.lng(), ne.lat())
          // callback method triggers rerender
          .callback();
      }}
    >
      {markerCluster.getPoints(
        ({ lat, lng, id }, key) => (
          <OverlayView lat={lat} lng={lng} key={key} preventMapHitsAndGestures>
            <div style={markerStyle}>m{id}</div>
          </OverlayView>
        ),
        (lng, lat, count, expandZoom, key) => (
          <OverlayView lat={lat} lng={lng} key={key} preventMapHitsAndGestures>
            <div style={markerStyle}>{count}</div>
          </OverlayView>
        )
      )}
    </GoogleMap>
  );
};
```

## API

### useMarkerCluster

```ts
const useMarkerCluster: <P>(points: P[], getLngLat: (item: P) => [lng: number, lat: number], options?: UseMarkerClusterOptions): MarkerCluster<P>;
```

The useMarkerCluster hook provides an easy way to cluster markers on a map by continuously monitoring the `points` parameter and clustering them when new data is received. Once clustering is complete, the hook will automatically trigger a rerender. For better understanding of usage see [example](#example)

Returns [MarkerCluster](https://github.com/Krombik/marker-cluster#class-markerclustert) instance

#### UseMarkerClusterOptions

| Name         | Type         | Description                                                                                 | Default |
| :----------- | :----------- | :------------------------------------------------------------------------------------------ | :------ |
| `asyncMode?` | `boolean`    | if `true`, the clustering process will be moved to another thread and will not block the UI | `false` |
| `minZoom?`   | `number`     | min zoom level to cluster the points on                                                     | `0`     |
| `maxZoom?`   | `number`     | max zoom level to cluster the points on                                                     | `16`    |
| `radius?`    | `number`     | cluster radius in pixels                                                                    | `60`    |
| `extent?`    | `number`     | size of the tile grid used for clustering                                                   | `256`   |
| `callback?`  | `() => void` | method to be executed after clustering                                                      |         |

---

### useMarkerCluster.cleanup

```ts
useMarkerCluster.cleanup();
```

If `asyncMode` has been set, use this method to abandon the [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) if necessary

---

## License

MIT © [Krombik](https://github.com/Krombik)
