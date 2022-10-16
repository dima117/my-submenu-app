import { FC, ReactNode, RefObject, useMemo, useRef } from "react";

import { usePopper } from "react-popper";
import ReactDOM from "react-dom";

interface MenuPopupProps {
  visible: boolean;
  anchorRef: RefObject<Element>;
  children: ReactNode;
}

export const MenuPopup: FC<MenuPopupProps> = (props) => {
  const { visible, anchorRef, children } = props;

  let popperRef = useRef(null);
  const { styles, attributes } = usePopper(
    anchorRef.current,
    popperRef.current,
    {
      placement: "right-start",
    }
  );

  const scope = useMemo(() => document.getElementById("popper")!, []);

  if (!visible) {
    return null;
  }

  const popup = (
    <div ref={popperRef} style={styles.popper} {...attributes.popper}>
      {children}
    </div>
  );

  return ReactDOM.createPortal(popup, scope);
};
