import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button }  from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ISSUE_TODO } from "../types/types";

export default function ListItem({issues, status, statusPretty, fetchIssues, boardId}){
    const [dialogOpen, setdialogOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");

    function handleClose(){
        setdialogOpen(false);
    }
    function handleClickOpen(){
        setdialogOpen(true);
    }

    async function fetchUserId(){
        const url = `http://localhost:6969/board/one/${boardId}`;
    
        const res = await fetch(url);
        res.json()
            .then(res => {console.log(res); setUserId(res.userId)} )
            .catch(err => console.log(err));
    }

    async function createIssue(){
        console.log(`User Id is ${userId}`);

        const createIssueBody = {
            title: "Created from dialogue",
            desc: "no",
            status: status,
            userId: userId,
            boardId: boardId
        }

        const res = await fetch(`http://localhost:6969/issue/new`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(createIssueBody)
        });
        res.json()
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        handleClose();
        fetchIssues();
    }

    async function deleteIssue(issueId:string, index: number){
        const url = `http://localhost:6969/issue/delete/${issueId}`;
    
        const res = await fetch(url, {
          method: 'delete'
        });
        res.json()
            .then(res => console.log(res))
            .catch(err => console.log(err));
    
        fetchIssues();
    }

    useEffect(() => {
        fetchUserId();
    }, []);

    return(<>
        <h5> {statusPretty}: </h5>
        {status == ISSUE_TODO &&
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Create Issue</Button>
        }
        {  issues.length > 0 && issues.map((issue, index) => (
            issue.status == status &&
            <>
            <p key={issue._id}>{issue.title}</p>
            <Button variant="contained" color="secondary" key={index} onClick={() => deleteIssue(issue._id, index)}>Delete</Button>
            </>
        ))}
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Issue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new issue, fill out the information below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Issue Title"
            type="email"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="desc"
            label="Issue Description"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createIssue} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
        </>);
}