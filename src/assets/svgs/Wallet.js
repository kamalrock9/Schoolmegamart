import React from "react";
import Svg, {G,Path} from "react-native-svg";

const SvgWallet = props => (
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width={512}
  height={469.33}
  viewBox="0 0 512 469.33"
  {...props}
>
  <Path  fill="currentColor"
      stroke={props.style.color} data-name="Rectangle 323" fill="none" d="M0 0h512v469.33H0z" />
  <G data-name="wallet (1)">
    <Path
     fill="currentColor"
     stroke={props.style.color}
      data-name="Path 2273"
      d="M493.532 88.62h-25.889V34.356A10.356 10.356 0 00457.287 24H49.478A42.769 42.769 0 006.812 66.666v335.319a42.769 42.769 0 0042.666 42.665h444.054a10.356 10.356 0 0010.356-10.356V98.976a10.356 10.356 0 00-10.356-10.356zM49.478 44.71h397.453v43.91H49.478a21.954 21.954 0 110-43.908zm0 379.227a21.954 21.954 0 01-21.954-21.954V103.01a41.423 41.423 0 0021.954 6.317h433.7v97.862H341.612a58.1 58.1 0 100 116.192h141.564v100.558zm433.7-121.266H341.612a37.385 37.385 0 010-74.769h141.564z"
    />
    <Path
     fill="currentColor"
     stroke={props.style.color}
      data-name="Path 2274"
      d="M349.898 274.816a10.348 10.348 0 0014.291-9.522 13.876 13.876 0 000-2.071l-.621-1.864-.932-1.865-1.346-1.553a10.356 10.356 0 00-11.288-2.278 12.531 12.531 0 00-3.314 2.278l-1.346 1.553-.928 1.86-.621 1.864a14.079 14.079 0 000 2.071 10.355 10.355 0 003.107 7.249 9.009 9.009 0 003 2.278z"
    />
  </G>
</Svg>
);

export default SvgWallet;
