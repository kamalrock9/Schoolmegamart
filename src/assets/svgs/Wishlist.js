import React from "react";
import Svg, {G, Path} from "react-native-svg";

const SvgWishList = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={469.33}
    viewBox="0 0 512 469.33"
    {...props}>
    <Path data-name="Rectangle 310" fill="none" d="M0 0h512v469.33H0z" />
    <G data-name="heart (5)">
      <G data-name="Group 1258">
        <Path
          fill="currentColor"
          stroke={props.style.color}
          data-name="Path 2261"
          d="M366.825 23.01A143.88 143.88 0 00256 74.209a141.93 141.93 0 00-110.826-51.2A145.174 145.174 0 000 168.186c0 137.4 239.8 271.552 249.519 276.737a11.666 11.666 0 0012.962 0C272.2 439.738 512 307.526 512 168.186A145.175 145.175 0 00366.825 23.01zM256 418.999C218.41 396.964 25.924 279.658 25.924 168.186A119.251 119.251 0 01145.175 48.933a116.658 116.658 0 0199.807 53.792 13.61 13.61 0 0022.035 0 119.25 119.25 0 01219.058 65.461C486.076 280.953 293.589 397.612 256 418.999z"
        />
      </G>
    </G>
  </Svg>
);

export default SvgWishList;
