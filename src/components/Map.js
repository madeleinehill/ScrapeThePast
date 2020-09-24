import React from "react";
import { Map, TileLayer, Popup, Circle } from "react-leaflet";
import { connect } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomPopup from "./CustomPopup";
import { getFilteredMentions } from "../modules/selectors";

import { createUseStyles } from "react-jss";
import geoData from "../utils/geo_data";

// necessary to allow for correct loading of marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const useStyles = createUseStyles((theme) => ({
  map: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
}));

const MapWrapper = (props) => {
  console.log(props.totalMentions);
  const classes = useStyles(props);

  const calulateSize = (count) => {
    return props.relativeSizing
      ? 500000 * Math.sqrt(count / props.totalMentions)
      : 10000 * Math.sqrt(count);
  };

  return (
    <>
      <Map className={classes.map} center={[35, -100]} zoom={5}>
        {props.children}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: US National Park Service"
          minZoom={2}
          maxZoom={10}
        />
        {Object.keys(props.mentions).map((obs, i) => {
          return (
            <Circle
              key={obs}
              center={[geoData[obs]["latitude"], geoData[obs]["longitude"]]}
              radius={
                props.scaleMarkers * calulateSize(props.mentions[obs].count)
              }
              color={
                geoData[obs].type === "state" || geoData[obs].type === "country"
                  ? "#F57"
                  : "#57F"
              }
            >
              <Popup>
                <CustomPopup
                  data={{
                    mentions: props.mentions[obs].count,
                    literals: props.mentions[obs].literals,
                    ...geoData[obs],
                    totalMentions: props.totalMentions,
                  }}
                />
              </Popup>
            </Circle>
          );
        })}
      </Map>
    </>
  );
};

const mapStateToProps = (state) => {
  const { mentions, totalMentions } = getFilteredMentions(state);
  return {
    documents: state.documents,
    mentions: mentions,
    totalMentions: totalMentions,
    relativeSizing: state.mapControls.relativeSizing,
    scaleMarkers: state.mapControls.scaleMarkers,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);
