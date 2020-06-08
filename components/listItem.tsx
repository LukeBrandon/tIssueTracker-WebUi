import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "./index.module.scss";
import { Button }  from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { ISSUE_TODO, ISSUE_IN_PROGRESS, ISSUE_OUT_FOR_REVIEW, ISSUE_COMPLETED, Issue } from "../types/types";
import StatusDropdown from "./issueStatusDropDown";

export default function ListItem({issues, status, statusPretty, fetchIssues, boardId}){
    const [dialogOpen, setdialogOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [titleFieldValue, setTitleFieldValue] = useState<string>("");
    const [descFieldValue, setDescFieldValue] = useState<string>("");

    const [viewDialogIssueObj, setViewDialogIssueObj] = useState<Issue>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
    const [viewDialogTitle, setViewDialogTitle] = useState<string>("");
    const [viewDialogDesc, setViewDialogDesc] = useState<string>("");
    const [viewDialogStatus, setViewDialogStatus] = useState<string>("");

    function handleClose(){
        setdialogOpen(false);
        setTitleFieldValue("");
        setDescFieldValue("");
    }
    function handleClickOpen(){
        setdialogOpen(true);
    }

    function handleTitleFieldChange(e){
        setTitleFieldValue(e.target.value);
    }
    function handleDescFieldChange(e){
        setDescFieldValue(e.target.value);
    }

    function handleIssueViewOpen(issue){
        setViewDialogOpen(true);
        setViewDialogIssueObj(issue);
        setViewDialogTitle(issue.title);
        setViewDialogDesc(issue.desc);
        setViewDialogStatus(issue.status);
    }

    function handleIssueViewClose(){
        setViewDialogIssueObj(null);
        setViewDialogTitle("");
        setViewDialogDesc("");
        setViewDialogStatus("");
        setViewDialogOpen(false);
    }


    async function fetchUserId(){
        const url = `http://localhost:6969/board/one/${boardId}`;
    
        const res = await fetch(url);
        res.json()
            .then(res => {console.log(res); setUserId(res.userId)} )
            .catch(err => console.log(err));
    }

    async function createIssue(){

        const createIssueBody = {
            title: titleFieldValue,
            desc: descFieldValue,
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
        <h3> {statusPretty}: </h3>
        {status == ISSUE_TODO &&
            <Button variant="contained" color="primary" onClick={handleClickOpen}>Create Issue</Button>
        }
        {  issues.length > 0 && issues.map((issue, index) => (
            issue.status == status &&
            <>
            <Card>
                <h4 key={issue._id}>{issue.title}</h4>
                <p key={`${issue._id}desc`}>{issue.desc}</p>
                <CardActions>
                    <Button size="small" variant="contained" color="secondary" key={index} onClick={() => deleteIssue(issue._id, index)}>Delete</Button>
                    <Button size="small" color="primary" key={index} onClick={() => handleIssueViewOpen(issue)}>View</Button>

                    <StatusDropdown issue={issue} updateIssues={fetchIssues}/>
                </CardActions>
            </Card>
            </>
        ))}


        {/* View Issue Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleIssueViewClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit your issue</DialogTitle>
            <DialogContent>

                <DialogContentText>
                    <TextField
                        value={viewDialogTitle}
                        onChange={handleDescFieldChange}
                        margin="dense"
                        id="desc"
                        label="Issue Description"
                        type="email"
                        fullWidth
                    />
                    <TextField
                        value={viewDialogDesc} 
                        onChange={handleTitleFieldChange}
                        margin="dense"
                        id="title"
                        label="Issue Title"
                        type="email"
                        fullWidth
                    />
                    {/* <StatusDropdown issue={viewDialogIssueObj} updateIssues={null}/> */}
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleIssueViewClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>


        {/* Create New Issue Dialog */}
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Issue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new issue, fill out the information below.
          </DialogContentText>
          <TextField
            autoFocus
            value={titleFieldValue} 
            onChange={handleTitleFieldChange}
            margin="dense"
            id="title"
            label="Issue Title"
            type="email"
            fullWidth
          />
          <TextField
            value={descFieldValue}
            onChange={handleDescFieldChange}
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