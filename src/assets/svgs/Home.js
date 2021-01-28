import * as React from "react";
import Svg, {G, Path} from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={514.069}
      height={469.33}
      viewBox="0 0 514.069 469.33"
      {...props}>
      <G fill="none">
        <Path d="M.999 0h512v469.33h-512z" />
        <Path
          d="M257.034 13.667S104.218 145.584 18.818 217.026a25.716 25.716 0 00-8.819 18.973 24.7 24.7 0 0024.7 24.7H84.11v172.928a24.7 24.7 0 0024.7 24.7h74.111a24.7 24.7 0 0024.7-24.7v-98.814h98.814v98.814a24.7 24.7 0 0024.7 24.7h74.111a24.7 24.7 0 0024.7-24.7V260.702h49.407a24.7 24.7 0 0024.7-24.7 24.21 24.21 0 00-9.461-18.972C409.799 145.584 257.034 13.667 257.034 13.667z"
          stroke={props.style.color}
          strokeWidth={20}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
