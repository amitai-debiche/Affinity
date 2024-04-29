import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Card, Column, Id } from "../types";
//import '../styles/AffinityBoard.css';
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import AffinityCard from "./AffinityCard";


function AffinityBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [newColumnTitle, setNewColumnTitle] = useState<string>("");
    const columnsId = useMemo(() => columns.map((col) => col.id),[columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [activeCard, setActiveCard] = useState<Card | null>(null);

    const [cards, setCards] = useState<Card[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {
            distance: 5,
        },
        })
    );

    return (
    <div>
        <h1 className="justify-center flex mb-4 text-4xl font-extrabold font-serif leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Simple Affinity</h1>
        <div className="justify-center flex items-center space-x-8">
        <input type="text" value={newColumnTitle} autoFocus onChange={(e) => setNewColumnTitle(e.target.value)}
        className="h-[40px] w-[500px] px-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "></input>
        <button
            onClick={() => {createNewColumn();}}
            className="flex items-center gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-green-500 hover:ring-2 gap-2">Add Column<PlusIcon/></button>
    </div>
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
            <SortableContext items={columnsId}>
            {columns.map(column => (
                <ColumnContainer 
                    key={column.id}
                    column={column}
                    deleteColumn={deleteColumn} 
                    updateColumn={updateColumn} 
                    createCard={createCard}
                    cards={cards.filter(card => card.columnId === column.id)}
                    deleteCard={deleteCard}
                    updateCard={updateCard}
                    />
                )
            )}
            </SortableContext>
            </div>
        </div>
        {createPortal(
        <DragOverlay>
            {activeColumn && (
                <ColumnContainer column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createCard={createCard}
                cards={cards.filter(card => card.columnId === activeColumn.id)}
                deleteCard={deleteCard}
                updateCard={updateCard}
                />
            )}
            {activeCard && <AffinityCard card={activeCard}
                deleteCard={deleteCard}
                updateCard={updateCard}/>}
        </DragOverlay>, document.body)};
        </DndContext>
    </div>
    </div>
    );

     function createNewColumn() {
        let title;
        if (newColumnTitle === ""){
            title = `Column ${columns.length + 1}`;
        }else {
            title = newColumnTitle;
        }
            
        const columnToAdd: Column = {
            id: generateId(),
            title: title,
        };

        setColumns([...columns, columnToAdd]);
        }
    function generateId() {
        return Math.floor(Math.random() * 30000);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id);
        setColumns(filteredColumns);

        const newCards = cards.filter((c) => c.columnId !== id);
        setCards(newCards);
    }

    function onDragStart(event: DragStartEvent){
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current?.column);
            return;
        }
        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current?.card);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveCard(null);
        const {active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);

            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return {...col, title};
        });
        setColumns(newColumns);
    }

    function createCard(columnId: Id) {
        const newCard: Card = {
            id: generateId(),
            columnId,
            content: `Card ${cards.length + 1}`,
        };
        setCards([...cards, newCard]);
    }

    function deleteCard(id: Id) {
        const newCards = cards.filter(card => card.id !== id);
        setCards(newCards);
    }

    function updateCard(id: Id, content: string) {
        const newCards = cards.map(card => {
            if (card.id !== id) return card;
            return {...card, content};
        })
        setCards(newCards);
    }

    function onDragOver(event: DragOverEvent) {
        const {active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveCard = active.data.current?.type==="Card";
        const isOverCard = over.data.current?.type === "Card";

        if (!isActiveCard) return;
        //Card over another Card
        if (isActiveCard && isOverCard) {
            setCards(cards => {
                const activeIndex = cards.findIndex(c => c.id === activeId);
                const overIndex = cards.findIndex(c => c.id === overId);
            
            if (cards[activeIndex].columnId !== cards[overIndex].columnId) {
                cards[activeIndex].columnId = cards[overIndex].columnId;
            }

                return arrayMove(cards, activeIndex, overIndex);
            });
        }

        //Card over another col
        const isOverColumn = over.data.current?.type === "Column";
        if (isActiveCard && isOverColumn) {
            setCards(cards => {
                const activeIndex = cards.findIndex(c => c.id === activeId);
            
                cards[activeIndex].columnId = overId;

                return arrayMove(cards, activeIndex, activeIndex);
            });
        }
    }
}

export default AffinityBoard;
