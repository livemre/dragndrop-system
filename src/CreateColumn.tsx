import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "./Context";

type Props = {};

const CreateColumn = (props: Props) => {
  const { columns, createColumn } = useContext(MainContext)!;
  const [cardName, setCardName] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClickHandler = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    };

    document.addEventListener("click", onClickHandler);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", onClickHandler);
    };
  }, []);

  const addNewColumn = () => {
    if (columns) {
      console.log("Add new column");

      createColumn(cardName);
    }
  };

  const prepareNewList = () => {
    setShowInput(true);
    input.current?.focus;
    console.log("Prepare");
    console.log(showInput);
  };

  if (showInput === true) {
    return (
      <div
        ref={inputRef}
        className="bg-slate-900 p-2 flex flex-col w-72 h-24 rounded-lg"
      >
        <input
          autoFocus
          ref={input}
          placeholder="Liste basligi girin..."
          className="bg-transparent text-white "
          onChange={(e) => setCardName(e.target.value)}
        />
        <div className="flex mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-400 rounded-sm  px-2 "
            onClick={addNewColumn}
          >
            Listeye Ekle
          </button>
          <button
            className="bg-black text-white ml-2 hover:bg-slate-700 p-2"
            onClick={() => setShowInput((prev) => !prev)}
          >
            X
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={prepareNewList}
      className="w-72 h-12 bg-slate-400 hover:bg-slate-300 rounded-md flex items-center justify-center cursor-pointer"
    >
      + Listeye Ekle
    </div>
  );
};

export default CreateColumn;
