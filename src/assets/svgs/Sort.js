import React from "react";
import Svg, {G, Path, Rect} from "react-native-svg";

const SvgSort = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" {...props}>
    <Path data-name="Rectangle 564" fill="none" d="M0 0h15v15H0z" />
    <G data-name="sort (1)">
      <G data-name="Group 1889">
        <Path
          data-name="Path 6031"
          d="M11.087 13.797a.369.369 0 10.737 0V1.257l2.2 2.2a.367.367 0 00.521-.518l-2.83-2.83a.376.376 0 00-.518 0l-2.83 2.83a.366.366 0 10.518.518l2.2-2.2v12.54z"
        />
        <Path
          data-name="Path 6032"
          d="M6.286 10.707a.365.365 0 00-.518 0l-2.2 2.2V.368a.369.369 0 00-.737 0v12.543l-2.2-2.2a.366.366 0 00-.518.518l2.83 2.83a.369.369 0 00.521 0l2.83-2.83a.374.374 0 00-.008-.522z"
        />
      </G>
    </G>
  </Svg>
);

export default SvgSort;
