import { Card, Column, Id } from "../types";
//import '../styles/ColumnContainer.css';
import TrashIcon from "../icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import AffinityCard from "./AffinityCard";
import PlusIcon from "../icons/PlusIcon";
import BoxIcon from "../icons/BoxIcon";

interface props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createCard: (columnId: Id) => void;
    cards: Card[];
    deleteCard: (id: Id) => void;
    updateCard: (id: Id, content: string) => void;
}


function ColumnContainer(props: props){
    const {column, deleteColumn, updateColumn, createCard, cards, deleteCard, updateCard} = props;

    const [editMode, setEditMode] = useState(false);

    const cardsIds = useMemo(() => { return cards.map(card => card.id); }, [cards]);
    
    const { setNodeRef, attributes, listeners, transform, transition, isDragging} = 
    useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
      });  

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return ( 
        <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor opacity-30 border-2 border-lightgreen-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
        </div>
        );
    }
    return (
        <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
        <div {...attributes} {...listeners} onClick={() => {setEditMode(true);}} className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
            <div className="bg-columnBackgroundColor flex justify-center items-center px-2 py-1 text-sm rounded-full"><BoxIcon/></div>
            {!editMode && column.title}
            {editMode && (
                <input 
                    className="bg-white focus:border-green-500 border rounded outline-none px-2"
                    value={column.title}
                    onChange={e => updateColumn(column.id, e.target.value)}
                    autoFocus 
                    onBlur={()=> setEditMode(false)}
                    onKeyDown={e => {
                        if (e.key !== "Enter") return;
                        setEditMode(false);
                        }}
                />
            )}
        </div>
        <button className= "stroke-gray-500 hover:stroke-black hover:bg-columnBackgroundColor rounded px-1 py-2"
             onClick={() => {
                deleteColumn(column.id)}}><TrashIcon/></button>
        </div>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
            <SortableContext items={cardsIds}>
            {cards.map(card => (
                <AffinityCard key={card.id} card={card} deleteCard={deleteCard} updateCard={updateCard}/>
            ))}
            </SortableContext>
        </div>
        <button className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-green-500 active:bg-white"
        onClick={() => {
            createCard(column.id);
            }}
        ><PlusIcon />
        Add Card
        </button>
        </div>

    );
}

export default ColumnContainer


