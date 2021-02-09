import React from "react";
import Svg, {G, Path, Rect} from "react-native-svg";

const SvgRefresh = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" {...props}>
    <G transform="translate(-3287 -3713)">
      <Rect
        data-name="Rectangle 381"
        width={32}
        height={32}
        rx={5}
        transform="translate(3287 3713)"
        fill="#fde5a9"
      />
      <G data-name="refresh">
        <G data-name="Group 1332">
          <Path
            data-name="Path 2345"
            d="M3307.399 3726.018a6.052 6.052 0 00-4.307-1.784h-.893l1.433-1.434-.795-.8-2.8 2.8 2.76 2.8.8-.791-1.419-1.447h.914a4.963 4.963 0 11-4.963 4.963v-.564H3297v.564a6.092 6.092 0 1010.4-4.307z"
            stroke="#fde5a9"
            strokeWidth={0.5}
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgRefresh;
