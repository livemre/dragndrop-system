import React, {
  ChangeEvent,
  DragEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { CardType, MainContext } from "./Context";
import Dropping from "./DND/Dropping";
import Dragging from "./DND/Dragging";

interface IProps {
  id: string;
}

const Column: React.FC<IProps> = ({ id }) => {
  const context = useContext(MainContext);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [placeholderPosition, setPlaceholderPosition] = useState<
    "bottom" | "top" | null
  >(null);

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverCardinColumnIndex, setDragOverCardinColumnIndex] = useState<
    number | null
  >(null);

  const [itemIndex, setItemIndex] = useState<number | null>(null);

  if (!context) {
    throw new Error("Column must be used within a MainProvider");
  }

  const { createCard, db, getItemIndex } = context;

  const onDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    // console.log("On Drag Over");
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    // console.log(data);

    // Uzerinde durulan nesne
    const target = event.currentTarget as HTMLDivElement;

    const boundingRect = target.getBoundingClientRect();
    const offsetY = event.clientY - boundingRect.top;
    const height = boundingRect.height;

    const isBottomHalf = offsetY > height / 2;

    setPlaceholderPosition(isBottomHalf ? "bottom" : "top");
    // console.log(placeholderPosition);

    // Uzerinde durulan ogenin indexini al DragOverIndex e ata
    setDragOverIndex(index);

    // Drag Over olan kartin In column index numarasini bul.

    setDragOverCardinColumnIndex(db[index].inColumnIndex);
    console.log(dragOverCardinColumnIndex);
  };

  const createRandomCard = () => {
    createCard(id, cardTitle);
    console.log("Column = Create card ");
  };

  const getSortedItems = () => {
    return db
      .filter((item) => item.columnId === id)
      .sort((a, b) => {
        return a.inColumnIndex - b.inColumnIndex;
      });
  };

  return (
    <div>
      <div>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCardTitle(e.target.value)
          }
        />
        <button onClick={createRandomCard}>CREATE RANDOM CARD</button>
      </div>
      <p>Column ID : {id}</p>
      <Dropping
        columnId={id}
        dragOverCardinColumnIndex={dragOverCardinColumnIndex}
        dragPosition={placeholderPosition}
      >
        <div className="column">
          {getSortedItems().map((item) => {
            const index = getItemIndex(item.id);
            return item.columnId === id ? (
              item.visible ? (
                <Dragging id={item.id} item={item} index={index}>
                  {dragOverIndex === index && placeholderPosition === "top" && (
                    <div className="placeholder placeholder-top"></div>
                  )}
                  <div
                    className="bg-red-300 m-2"
                    key={item.id}
                    onDragOver={(e) => onDragOver(e, index)}
                  >
                    <p> Item ID :{item.id}</p>
                    <p> {item.title}</p>
                    <p> Item Index {index}</p>
                    <p> In Column index : {item.inColumnIndex}</p>
                    <p>Column ID : {item.columnId}</p>
                  </div>
                  {dragOverIndex === index &&
                    placeholderPosition === "bottom" && (
                      <div className="placeholder placeholder-bottom"></div>
                    )}
                </Dragging>
              ) : (
                ""
              )
            ) : (
              ""
            );
          })}
        </div>
      </Dropping>
    </div>
  );
};

export default Column;

// Bu kolon kendi ID sine sahip olan ogeleri listeleyecek.
