import * as React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

function SvgList(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" {...props}>
      <Path data-name="Rectangle 563" fill="none" d="M0 0h15v15H0z" />
      <G data-name="list">
        <G data-name="Group 1318">
          <G data-name="Group 1317">
            <Path
              data-name="Path 2340"
              d="M13.983 7H3.597a.508.508 0 100 1h10.385a.508.508 0 100-1z"
            />
          </G>
        </G>
        <G data-name="Group 1320">
          <G data-name="Group 1319">
            <Path
              data-name="Path 2341"
              d="M13.983 1H3.597a.508.508 0 100 1h10.385a.508.508 0 100-1z"
            />
          </G>
        </G>
        <G data-name="Group 1322">
          <G data-name="Group 1321">
            <Path
              data-name="Path 2342"
              d="M13.983 13H3.597a.508.508 0 100 1h10.385a.508.508 0 100-1z"
            />
          </G>
        </G>
        <G data-name="Group 1324">
          <G data-name="Group 1323">
            <Circle data-name="Ellipse 54" cx={0.5} cy={0.5} r={0.5} transform="translate(0 1)" />
          </G>
        </G>
        <G data-name="Group 1326">
          <G data-name="Group 1325">
            <Circle data-name="Ellipse 55" cx={0.5} cy={0.5} r={0.5} transform="translate(0 7)" />
          </G>
        </G>
        <G data-name="Group 1328">
          <G data-name="Group 1327">
            <Circle data-name="Ellipse 56" cx={0.5} cy={0.5} r={0.5} transform="translate(0 13)" />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgList;
