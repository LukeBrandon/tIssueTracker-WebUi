import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import styles from "./index.module.css";
import NavPage from "../../layouts/navPage";
import Link from "next/link";
import { Board, Issue, ISSUE_TODO_VIEW, ISSUE_IN_PROGRESS_VIEW, ISSUE_OUT_FOR_REVIEW_VIEW, ISSUE_COMPLETED_VIEW, IssueStatus, ISSUE_TODO, ISSUE_IN_PROGRESS, ISSUE_OUT_FOR_REVIEW,ISSUE_COMPLETED }  from "../../types/types";
import ListItem from "../../components/listItem/listItem";

export default function ViewBoardPage(){

  const [board, setBoard] = useState<Board>();
  const [issues, setIssues] = useState<Issue[]>([]);

  const router = useRouter();
  const { boardId } = router.query;

  async function fetchBoard(){
    const boardUrl = `http://localhost:6969/board/one/${boardId}`;

      const res = await fetch(boardUrl);
      res.json()
          .then(res => {console.log(res); setBoard(res as Board)})
          .catch(err => console.log(err));
      console.log(board);
  }

  async function fetchIssues(){
    const boardUrl = `http://localhost:6969/issue/all/${boardId}`;

      const res = await fetch(boardUrl);
      res.json()
          .then(res => {console.log(res); setIssues(res as Issue[])})
          .catch(err => console.log(err));
      console.log(issues);
  }

  useEffect(() => {
    if(boardId){
      fetchBoard();
      fetchIssues();
    }
  }, [boardId]);


  return(
    <NavPage>
      { board && <>
        <h4>Viewing your board {board.title}</h4>

        <p> Title : {board.title}</p>
        <p> Board Id : {board._id}</p>
        <p> User Id : {board.userId}</p>

        <div className={styles.boardContainer}>
          <ListItem issues={issues} status={ISSUE_TODO} statusPretty={ISSUE_TODO_VIEW} fetchIssues={fetchIssues} boardId={boardId}></ListItem>
          <ListItem issues={issues} status={ISSUE_IN_PROGRESS} statusPretty={ISSUE_IN_PROGRESS_VIEW} fetchIssues={fetchIssues} boardId={boardId}></ListItem>
          <ListItem issues={issues} status={ISSUE_OUT_FOR_REVIEW} statusPretty={ISSUE_OUT_FOR_REVIEW_VIEW} fetchIssues={fetchIssues} boardId={boardId}></ListItem>
          <ListItem issues={issues} status={ISSUE_COMPLETED} statusPretty={ISSUE_COMPLETED_VIEW} fetchIssues={fetchIssues} boardId={boardId}></ListItem>
        </div>
      </> }

      {!board &&
      <p>Sorry, no board could be found :(</p>
      }

    </NavPage>
  )
}