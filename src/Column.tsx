import React, {
  DragEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MainContext } from "./Context";
import Dropping from "./DND/Dropping";
import Dragging from "./DND/Dragging";

interface IProps {
  id: string;
  title: string;
}

const Column: React.FC<IProps> = ({ id, title }) => {
  const context = useContext(MainContext);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [placeholderPosition, setPlaceholderPosition] = useState<
    "bottom" | "top" | null
  >(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverCardinColumnIndex, setDragOverCardinColumnIndex] = useState<
    number | null
  >(null);
  const [showInput, setShowInput] = useState<boolean>(false);

  const [showOverlay, setShowOverlay] = useState(false);

  if (!context) {
    throw new Error("Column must be used within a MainProvider");
  }

  const { createCard, db, getItemIndex, overlayItem } = context;

  const inputRef = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClickHandler = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
        console.log("Disariya tiklandi");
      }
    };

    document.addEventListener("click", onClickHandler);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", onClickHandler);
    };
  }, []);

  const onDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLDivElement;
    const boundingRect = target.getBoundingClientRect();
    const offsetY = event.clientY - boundingRect.top;
    const height = boundingRect.height;
    const isBottomHalf = offsetY > height / 2;

    setPlaceholderPosition(isBottomHalf ? "bottom" : "top");
    setDragOverIndex(index);
    setDragOverCardinColumnIndex(db[index].inColumnIndex);
    console.log(dragOverCardinColumnIndex);
    setShowOverlay(true);
  };

  const _createCard = () => {
    createCard(id, cardTitle);
    console.log("Column = Create card ");
  };

  const getSortedItems = () => {
    return db
      .filter((item) => item.columnId === id)
      .sort((a, b) => a.inColumnIndex - b.inColumnIndex);
  };

  const prepareAddCard = () => {
    setShowInput(true);
    input.current?.focus();
  };

  return (
    <div className="m-3">
      {showOverlay ? overlayItem && overlayItem : ""}
      <Dropping
        columnId={id}
        dragOverCardinColumnIndex={dragOverCardinColumnIndex}
        dragPosition={placeholderPosition}
      >
        <div className="bg-black w-72 h-full p-2">
          <p className="text-gray-200">{title}</p>
          {getSortedItems().map((item) => {
            const index = getItemIndex(item.id);
            return (
              item.columnId === id &&
              item.visible && (
                <Dragging key={item.id} id={item.id} item={item} index={index}>
                  {dragOverIndex === index && placeholderPosition === "top" && (
                    <div className="placeholder placeholder-top"></div>
                  )}

                  <div
                    className="bg-red-300 m-2"
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
              )
            );
          })}
          {showInput ? (
            <div ref={inputRef} className="flex flex-col">
              <textarea
                placeholder="Bu kart icin başlık girin..."
                className="bg-transparent text-white flex flex-row justify-between h-11 m-2"
                onChange={(e) => setCardTitle(e.target.value)}
                autoFocus
              />
              <div className="flex flex-row h-11 m-2">
                <button
                  className="bg-blue-400 px-3 py-1 rounded-xl w-28"
                  onClick={_createCard}
                >
                  Ekle
                </button>
                <button className="bg-black text-white ml-2 hover:bg-gray-500 px-2 rounded-xl">
                  X
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex text-gray-200 hover:bg-gray-600 cursor-pointer rounded-lg m-3"
              onClick={prepareAddCard}
            >
              + Kart Ekle
            </div>
          )}
        </div>
      </Dropping>
    </div>
  );
};

export default Column;
