import React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

const SvgFilter = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" {...props}>
    <G fill="none">
      <Path data-name="Rectangle 562" d="M0 0h15v15H0z" />
      <G data-name="Group 1893" stroke="#000" strokeWidth={0.75}>
        <G data-name="Group 1890">
          <Path data-name="Path 6033" d="M12.5 13v1.251" strokeLinecap="round" />
          <G data-name="Ellipse 824" transform="translate(11 10)">
            <Circle cx={1.5} cy={1.5} r={1.5} stroke="none" />
            <Circle cx={1.5} cy={1.5} r={1.125} />
          </G>
          <Path data-name="Path 6036" d="M12.5.5v9.843" strokeLinecap="round" />
        </G>
        <G data-name="Group 1891">
          <Path data-name="Path 6033" d="M2.5 13v1.251" strokeLinecap="round" />
          <G data-name="Ellipse 824" transform="translate(1 10)">
            <Circle cx={1.5} cy={1.5} r={1.5} stroke="none" />
            <Circle cx={1.5} cy={1.5} r={1.125} />
          </G>
          <Path data-name="Path 6036" d="M2.5.5v9.687" strokeLinecap="round" />
        </G>
        <G data-name="Group 1892">
          <Path data-name="Path 6033" d="M7.5 1.75V.5" strokeLinecap="round" />
          <G data-name="Ellipse 824" transform="translate(6 1.75)">
            <Circle cx={1.5} cy={1.5} r={1.5} stroke="none" />
            <Circle cx={1.5} cy={1.5} r={1.125} />
          </G>
          <Path data-name="Path 6036" d="M7.5 14.25V4.499" strokeLinecap="round" />
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgFilter;
