import React, { useContext, useState } from "react";
import { MainContext } from "./Context";

type Props = {};

const CreateColumn = (props: Props) => {
  const { columns, createColumn } = useContext(MainContext)!;
  const [cardName, setCardName] = useState<string>("");

  const addNewColumn = () => {
    if (columns) {
      console.log("Add new column");

      createColumn(cardName);
    }
  };

  return (
    <div>
      <button onClick={addNewColumn}>Create Column</button>
    </div>
  );
};

export default CreateColumn;
