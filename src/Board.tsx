import React, { FC, useContext } from "react";

import { ColumnType, MainContext } from "./Context";
import Column from "./Column";
import CreateColumn from "./CreateColumn";

const Board: FC = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("Column must be used within a MainProvider");
  }
  const { columns } = context;

  return (
    <div className="flex flex-row">
      {columns.map((item) => {
        return <Column key={item.id} id={item.id} title={item.title} />;
      })}
      <CreateColumn />
    </div>
  );
};

export default Board;
