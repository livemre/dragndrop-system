import React, { DragEvent, useEffect, useState } from "react";
import "./App.css";

type DropZoneType = {
  id: number;
  title: string;
  visible: boolean;
};

const App: React.FC = () => {
  // State to store the list of data items
  const [data, setData] = useState<DropZoneType[]>([
    { id: 1, title: "Veri 1", visible: true },
    { id: 2, title: "Veri 2", visible: true },
    { id: 3, title: "Veri 3", visible: true },
    { id: 4, title: "Veri 4", visible: true },
    { id: 5, title: "Veri 5", visible: true },
    { id: 6, title: "Veri 6", visible: true },
  ]);

  // State to store the currently dragged item
  const [draggedItem, setDraggedItem] = useState<DropZoneType | null>(null);

  // State to store the index of the item being dragged over
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // State to store the position (top or bottom) of the placeholder
  const [placeholderPosition, setPlaceholderPosition] = useState<
    "top" | "bottom" | null
  >(null);

  // Function to handle the start of dragging
  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    item: DropZoneType
  ) => {
    setDraggedItem(item); // Set the dragged item state
    event.dataTransfer.effectAllowed = "move"; // Set the effect allowed for the drag operation
    event.dataTransfer.setData("text/plain", `${item.id}`);
    const ghostElement = event.target as HTMLDivElement;
    event.dataTransfer.setDragImage(ghostElement, 0, 0);

    // Set the item's visibility to false when dragging starts
    setData((prevData) =>
      prevData.map((dataItem) =>
        dataItem.id === item.id ? { ...dataItem, visible: false } : dataItem
      )
    );
  };

  // Function to handle dragging over a target element
  const onDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault(); // Prevent default behavior to allow drop
    if (draggedItem !== null) {
      const target = event.currentTarget as HTMLDivElement; // Get the current target element
      const boundingRect = target.getBoundingClientRect(); // Get the bounding rectangle of the target
      const offsetY = event.clientY - boundingRect.top; // Calculate the vertical offset of the mouse within the target
      const height = boundingRect.height; // Get the height of the target element

      const isBottomHalf = offsetY > height / 2; // Determine if the mouse is in the bottom half of the target

      setPlaceholderPosition(isBottomHalf ? "bottom" : "top"); // Set the placeholder position based on the mouse position
      setDragOverIndex(index); // Set the index of the target being dragged over
    }
  };

  // Function to handle leaving a drag target
  const onDragLeave = () => {
    setDragOverIndex(null); // Clear the drag over index
    setPlaceholderPosition(null); // Clear the placeholder position
  };

  // Function to handle dropping the dragged item
  const onDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault(); // Prevent default behavior to allow drop
    if (draggedItem !== null) {
      const newData = [...data]; // Create a copy of the current data
      const oldIndex = newData.findIndex((item) => item.id === draggedItem.id); // Find the index of the dragged item in the data

      if (oldIndex !== -1) {
        newData.splice(oldIndex, 1); // Remove the dragged item from its original position
      }

      let targetIndex = index; // Set the initial target index to the current index
      if (placeholderPosition === "bottom") {
        targetIndex = index + 1; // Adjust the target index if the placeholder is in the bottom position
      }

      if (oldIndex < index) {
        targetIndex--; // Adjust the target index if the item is being moved down the list
      }

      if (targetIndex < 0) {
        targetIndex = 0; // Ensure the target index is not less than 0
      }

      if (targetIndex > newData.length) {
        targetIndex = newData.length; // Ensure the target index is not greater than the length of the data
      }

      newData.splice(targetIndex, 0, { ...draggedItem, visible: true }); // Insert the dragged item at the target index with visible set to true
      setData(newData); // Update the data state with the new order
    }

    setDraggedItem(null); // Clear the dragged item state
    setDragOverIndex(null); // Clear the drag over index state
    setPlaceholderPosition(null); // Clear the placeholder position state
  };

  // Function to handle the end of the drag operation
  const onDragEnd = () => {
    setDraggedItem(null); // Clear the dragged item state
    setDragOverIndex(null); // Clear the drag over index state
    setPlaceholderPosition(null); // Clear the placeholder position state
  };

  return (
    <div className="App">
      <div className="data-state">
        <h2>Mevcut Durum:</h2>
        {data.map((item) => (
          <p key={item.id}>
            {item.id}: {item.title}
          </p>
        ))}
      </div>
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`card-container ${
            dragOverIndex === index ? "card-container-hover" : ""
          }`}
        >
          {dragOverIndex === index && placeholderPosition === "top" && (
            <div className="placeholder placeholder-top"></div>
          )}
          <div
            className={`card ${!item.visible ? "card-hidden" : ""} ${
              dragOverIndex === index
                ? "card-moving-" +
                  (placeholderPosition === "bottom" ? "down" : "up")
                : ""
            }`}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
          >
            <p className="text">{item.id}</p>
            <p className="text">{item.title}</p>
          </div>
          <div className="placeholder-black"></div>
          {dragOverIndex === index && placeholderPosition === "bottom" && (
            <div className="placeholder placeholder-bottom"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
