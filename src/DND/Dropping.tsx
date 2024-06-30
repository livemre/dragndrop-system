import React, {
  DragEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CardType, MainContext } from "../Context";

interface IProps {
  children: ReactNode;
  columnId: string;
  dragOverCardinColumnIndex: number | null;
  dragPosition: "bottom" | "top" | null;
}

const Dropping: FC<IProps> = ({
  children,
  columnId,
  dragOverCardinColumnIndex,
  dragPosition,
}) => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  const { db, setDb, draggedItem, draggedItemIndex, setDraggedItem } = context;

  const ondrop = (event: DragEvent) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    console.log("Dropped!", id);

    if (dragOverCardinColumnIndex !== null && draggedItem) {
      // Yeni inColumnIndex değerini belirle
      const newInColumnIndex =
        dragPosition === "bottom"
          ? dragOverCardinColumnIndex + 1
          : dragOverCardinColumnIndex;

      // inColumnIndex değerlerini güncelle
      const newData = db.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            columnId: columnId,
            inColumnIndex: newInColumnIndex,
          };
        }

        if (
          item.columnId === columnId &&
          item.inColumnIndex >= newInColumnIndex
        ) {
          return {
            ...item,
            inColumnIndex: item.inColumnIndex + 1,
          };
        }

        return item;
      });

      setDb(newData);
    }
    console.log(db);

    setDraggedItem(null);
  };

  return <div onDrop={(e) => ondrop(e)}>{children}</div>;
};

export default Dropping;
