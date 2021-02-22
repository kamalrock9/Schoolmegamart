import React from "react";
import Svg, {Path} from "react-native-svg";

const SvgRefresh = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" {...props}>
    <Path data-name="Rectangle 569" fill="none" d="M0 0h15v15H0z" />
    <Path
      data-name="refresh"
      d="M1.868 8.312a5.208 5.208 0 106.076-5.13V4.84l-2.17-2.17L7.944.5v1.805A6.072 6.072 0 111 8.311z"
    />
  </Svg>
);

export default SvgRefresh;
