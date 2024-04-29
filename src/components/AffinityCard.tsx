import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Card, Id } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
interface props {
    card: Card;
    deleteCard: (id: Id) => void;
    updateCard: (id: Id, content: string) => void;
}

function AffinityCard({card, deleteCard, updateCard}: props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

     const { setNodeRef, attributes, listeners, transform, transition, isDragging} = 
    useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        },
        disabled: editMode,
      });  

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };



    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <div className="opacity-20 bg-mainBackgroundColor relative p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-green-500 cursor-grabs" 
            ref={setNodeRef} style={style}>
                Dragging Card
            </div>
        );
    }

    if (editMode) {
        return (
        <div className="bg-mainBackgroundColor relative p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-green-500 cursor-grabs" 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
        <textarea  className="h-[90%] w-full resize-none border-none rounded bg-transparent text-black focus:outline-none"
                    value={card.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={e => {
                        if (e.key === "Enter") toggleEditMode();
                    }}
                    onChange={(e) => updateCard(card.id, e.target.value)}
        ></textarea>
        </div>
    )

    }

    return (
        <div className="bg-mainBackgroundColor relative p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-green-500 cursor-grabs"           
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode} onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)}>
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {card.content}
        </p>
        {mouseIsOver && (
        <button className="opacity-80 hover:opacity-100 stroke-black absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded"
            onClick={() => {
                deleteCard(card.id);
            }}
        >
        <TrashIcon/></button>
        )}

        </div>
    )
}

export default AffinityCard;
    
