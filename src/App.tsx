// App.tsx
import React, { DragEvent, useContext, useState } from "react";
import "./App.css";
import { CardType, ColumnType, MainProvider } from "./Context";
import Column from "./Column";
import CreateColumn from "./CreateColumn";
import Board from "./Board";

const App: React.FC = () => {
  const [data, setData] = useState<CardType[]>([
    {
      id: "1",
      title: "Veri 1",
      visible: true,
      columnId: "1",
      inColumnIndex: 0,
    },
  ]);

  const [draggedItem, setDraggedItem] = useState<CardType | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [placeholderPosition, setPlaceholderPosition] = useState<
    "top" | "bottom" | null
  >(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>, item: CardType) => {
    setDraggedItem(item);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${item.id}`);
    const ghostElement = event.target as HTMLDivElement;
    event.dataTransfer.setDragImage(ghostElement, 0, 0);

    setData((prevData) =>
      prevData.map((dataItem) =>
        dataItem.id === item.id ? { ...dataItem, visible: false } : dataItem
      )
    );
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedItem !== null) {
      const target = event.currentTarget as HTMLDivElement;
      const boundingRect = target.getBoundingClientRect();
      const offsetY = event.clientY - boundingRect.top;
      const height = boundingRect.height;

      const isBottomHalf = offsetY > height / 2;

      setPlaceholderPosition(isBottomHalf ? "bottom" : "top");
      setDragOverIndex(index);
    }
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
    setPlaceholderPosition(null);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedItem !== null) {
      const newData = [...data];
      const oldIndex = newData.findIndex((item) => item.id === draggedItem.id);

      if (oldIndex !== -1) {
        newData.splice(oldIndex, 1);
      }

      let targetIndex = index;
      if (placeholderPosition === "bottom") {
        targetIndex = index + 1;
      }

      if (oldIndex < index) {
        targetIndex--;
      }

      if (targetIndex < 0) {
        targetIndex = 0;
      }

      if (targetIndex > newData.length) {
        targetIndex = newData.length;
      }

      newData.splice(targetIndex, 0, { ...draggedItem, visible: true });
      setData(newData);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
    setPlaceholderPosition(null);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setPlaceholderPosition(null);
  };

  return (
    <div className="App">
      <Board />
    </div>
  );
};

export default App;
