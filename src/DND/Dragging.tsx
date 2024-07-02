import React, {
  DragEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CardType, MainContext } from "../Context";

type IProps = {
  children: ReactNode;
  id: string;
  item: CardType;
  index: number;
};

const Dragging: FC<IProps> = ({ children, id, item, index }) => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { setDraggedItem, setDraggedItemIndex } = context;

  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    id: string,
    item: CardType
  ) => {
    event.dataTransfer.effectAllowed = "move";

    // Kartin  ID si setdata ile ataniyor.
    event.dataTransfer.setData("text/plain", id);
    console.log(id);

    setDraggedItem(item);
    console.log("On Drag Start");

    // Surukleme basladiginda dragged item visible degeri false olsun.
    console.log("dragged id" + id);

    /*   const newData = db.map((item) => {
      return item.id === id ? { ...item, visible: false } : item;
    });
    
    setDb(newData);
    */

    // Bir div olustur
  };

  useEffect(() => {
    setDraggedItemIndex(index);
  }, [onDragStart]);

  return (
    <div draggable onDragStart={(e) => onDragStart(e, id, item)}>
      {children}
    </div>
  );
};

export default Dragging;
