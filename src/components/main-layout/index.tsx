import { FC, PropsWithChildren } from "react";
import { useRecoilValue } from "recoil";

import StateBar from "../state-bar";
import FooterBar from "../footer-bar";
import NavigationBar from "../navigation-bar";

import { cursorAtom } from "../../store/global-config";

import styles from "./styles.module.scss";
import Polygon from "../../app/polygon";

type Props = {
  elementList: Polygon[];
};

const MainLayout: FC<PropsWithChildren<Props>> = ({ children, elementList }) => {
  const cursor = useRecoilValue(cursorAtom);

  return (
    <main className={styles.main} style={{ cursor }}>
      <NavigationBar />
      <section className={styles.body}>
        <div className={styles.canvas}>
          <StateBar list={elementList} />
          {children}
        </div>
        <FooterBar />
      </section>
    </main>
  );
};

export default MainLayout;
