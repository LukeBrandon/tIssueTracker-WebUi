import React, {useState} from "react";
import styles from "./index.module.scss";
import NavPage from "../../layouts/navPage";
import Link from "next/link";

type Board = {
    id: number;
    title: String;
}

export default function DashboardPage() {

    const [boards, setBoards] = useState<Board[]>([]);

    function fetchBoardData(){
        const fakeBoards: Board[] = [{ id: 1, title: "First Board"}, { id: 2, title: "TissueTracker"}];

        setBoards(fakeBoards);
    }

    if(boards.length == 0){
        fetchBoardData();
    }

    console.log(boards);

  return(
    <NavPage>
        {boards.length > 0 &&
        <h3>Here are your boards:</h3>
        }
        {boards.length > 0 && boards.map((board, index) => (
            <p key={board.id}>{board.title} at Index {index}</p>
        )) }
        {boards.length == 0 &&
            <p>You do not have any boards, click here to make one now!</p>
        }
    </NavPage>
  );
}
