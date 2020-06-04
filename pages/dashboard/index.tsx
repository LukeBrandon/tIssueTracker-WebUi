import React, {useState, useEffect} from "react";
import styles from "./index.module.scss";
import NavPage from "../../layouts/navPage";
import { Board }  from "../../types/types";
import Link from "next/link";

export default function DashboardPage() {

    const [boards, setBoards] = useState<Board[]>([]);
    const userId = 1;

    async function fetchBoardData(){
        //TODO: make this use the userId for the user that is logged in
        const res = await fetch(`http://localhost:6969/board/all/${userId}`);
        res.json()
            .then(res => setBoards(res as Board[]))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchBoardData();
    }, []);

    console.log(boards);

  return(
    <NavPage>
        {boards.length > 0 &&
        <h3>Here are your boards, userId: {userId}:</h3>
        }
        {boards.length > 0 && boards.map((board, index) => (
            // Not sure if the key should be the Id of the board but getting weird error
            // Doesn't allow strings? TODO: Fix this if the need arises.
            <Link key={index} href={{ pathname: 'view-board', query: { boardId: board._id }}}><a>{board.title} at Index {index}</a></Link>
        )) }
        {boards.length == 0 &&
            <p>You do not have any boards, click here to make one now!</p>
        }
    </NavPage>
  );
}
