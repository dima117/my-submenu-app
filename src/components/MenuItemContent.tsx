import { FC } from "react";
import { cn } from "@bem-react/classname";
import { TmpMenuAnyItem } from "../interfaces";

const cls = cn("MenuItemContent");

export const MenuItemContent: FC<{ item: TmpMenuAnyItem }> = ({ item }) => {
  const { text, hint } = item;

  const hintNode = hint ? <div className={cls("Hint")}>{hint}</div> : null;

  return (
    <div className={cls()}>
      <div className={cls("Text")}>{text}</div>
      {hintNode}
    </div>
  );
};
