import { FC } from "react";

import Polygon from "../../app/polygon";

type Props = {
  list: Polygon[];
};

const StateBar: FC<Props> = ({ list }) => {
  return (
    <div>
      <h1>Aside</h1>
      <div>
        {list.map((v, i) => (
          <p key={i} style={{ color: v.select ? "red" : "black" }}>
            {i + 1} - Element
          </p>
        ))}
      </div>
    </div>
  );
};

export default StateBar;
