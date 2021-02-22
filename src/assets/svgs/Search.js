import React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

const SvgSearch = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15.015}
    viewBox="0 0 15 15.015"
    {...props}>
    <G fill="none">
      <Path data-name="Rectangle 567" d="M0 0h15v15H0z" />
      <G data-name="Group 1895" stroke="#000" strokeWidth={0.75}>
        <G data-name="Ellipse 825">
          <Circle cx={5.5} cy={5.5} r={5.5} stroke="none" />
          <Circle cx={5.5} cy={5.5} r={5.125} />
        </G>
        <Path data-name="Path 6039" d="M9.344 9.344l5.078 5.141" strokeLinecap="round" />
      </G>
    </G>
  </Svg>
);

export default SvgSearch;
