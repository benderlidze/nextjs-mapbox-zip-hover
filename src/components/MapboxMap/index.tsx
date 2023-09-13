"use client";
import * as React from "react";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { csv } from "d3";
import { ZipInfo, ZipInfoProps } from "@/components/ZipInfo";

export const MapboxMap = () => {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [csvData, setCsvData] = React.useState<ZipInfoProps[]>([]);
  const [selectedZip, setSelectedZip] = React.useState<ZipInfoProps>();

  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-100.5, 40],
      zoom: 3.5,
      projection: { name: "mercator" },
    });

    setMap(mapboxMap);

    mapboxMap.on("load", function () {
      mapboxMap.addSource("zips", {
        type: "vector",
        url: "mapbox://jn1532.2z2q31r2",
      });

      mapboxMap.addLayer(
        {
          id: "Zip",
          type: "fill",
          source: "zips",
          paint: {
            "fill-outline-color": "#696969",
            "fill-color": {
              property: "fill",
              type: "identity",
            },
            "fill-opacity": 0.65,
          },
          "source-layer": "zip5_topo_color-2bf335",
        },
        "water"
      );

      mapboxMap.on("click", "Zip", onClick);
    });

    const onClick = (e: MapLayerMouseEvent) => {
      const features = mapboxMap.queryRenderedFeatures(e.point, {
        layers: ["Zip"],
      });
      const feature = features[0];
      const zip = (feature.properties && feature.properties.ZIP5) || 0;

      console.log("zip", csvData, zip);

      const data = csvData.find((d) => d.ZipCode === zip.toString());
      setSelectedZip(data);
    };

    csv("data/Mapping file.csv").then((text) => {
      const data: ZipInfoProps[] = text.map((d) => {
        return {
          ZipCode: d["Zip code"],
          Owner: d.Owner,
          Link: d.Link,
        } as ZipInfoProps;
      });
      setCsvData(data);
    });

    return () => {
      mapboxMap.off("click", "Zip", onClick);
      mapboxMap.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div ref={mapNode} style={{ width: "100%", height: "100%" }} />
      {selectedZip && <ZipInfo data={selectedZip} />}
    </div>
  );
};
