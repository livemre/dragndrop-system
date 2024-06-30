import React, { FC, ReactNode, createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type CardType = {
  id: string;
  title: string;
  visible: boolean;
  columnId: string;
  inColumnIndex: number;
};

export type ColumnType = {
  id: string;
  cards?: CardType[];
  visible?: boolean;
  title?: string;
};

export interface IProps {
  columns: ColumnType[];
  createColumn: (title: string) => void;
  db: CardType[];
  setDb: React.Dispatch<React.SetStateAction<CardType[]>>;
  createCard: (columnId: string, title: string) => void;
  draggedItem: CardType | null;
  setDraggedItem: React.Dispatch<React.SetStateAction<CardType | null>>;
  draggedItemIndex: number | null;
  setDraggedItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
  getItemIndex: (id: string) => number;
}

const MainContext = createContext<IProps | undefined>(undefined);

const MainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [db, setDb] = useState<CardType[]>([]);

  //DND
  const [draggedItem, setDraggedItem] = useState<CardType | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const createColumn = (title: string) => {
    console.log("New column");
    setColumns([
      ...columns,
      { id: uuidv4(), title: title, visible: true, cards: [] },
    ]);
  };

  const getItemIndex = (id: string): number => {
    return db.findIndex((item) => {
      return item.id == id;
    });
  };

  const createCard = (columnId: string, title: string) => {
    console.log("Context Create Card");

    // Kolonda oge yoksa 0 yap

    // Kolon id sine gore kolonda kac oge varsa index i ona gore ayarla
    console.log(columnId);

    const countCardNumberInColumn = db.reduce((count, item) => {
      return item.columnId === columnId ? count + 1 : count;
    }, 0);

    console.log(countCardNumberInColumn);
    console.log(countCardNumberInColumn);

    setDb([
      ...db,
      {
        id: uuidv4(),
        title: title,
        visible: true,
        columnId: columnId,
        inColumnIndex: countCardNumberInColumn,
      },
    ]);
    console.log(db);
  };

  return (
    <MainContext.Provider
      value={{
        columns,
        createColumn,
        db,
        setDb,
        createCard,
        draggedItem,
        setDraggedItem,
        draggedItemIndex,
        setDraggedItemIndex,
        getItemIndex,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
