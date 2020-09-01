import React, {useState, useEffect} from "react";
import styles from "./index.module.css";
import NavPage from "../../layouts/navPage";
import { Board }  from "../../types/types";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from "next/link";
import Router from 'next/router'
import { deleteBoardById } from "../../api/board";

export default function DashboardPage() {

    const [boards, setBoards] = useState<Board[]>([]);
    const [createBoardDialogVisible, setcreateBoardDialogVisible] = useState<boolean>(false);
    const [updateBoardDialogVisible, setupdateBoardDialogVisible] = useState<boolean>(false);
    const [editBoardId, setEditBoardId] = useState<string>("");
    const [confirmDeleteDialogVisible, setconfirmDeleteDialogVisible] = useState<boolean>(false)
    const [deleteBoardId, setdeleteBoardId] = useState<string>("");
    const [titleFieldValue, settitleFieldValue] = useState<string>("");
    let userId;
        

    async function fetchBoardData(){
        userId = localStorage.getItem("tissuetracker-userId");

        if(userId == null){
            Router.push('/login');
        }

        const res = await fetch(`${process.env.API_URL}/board/all/${userId}`);
        res.json()
            .then(res => setBoards(res as Board[]))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchBoardData();
    }, [userId]);


    function handleCreateBoardClick(){
        setcreateBoardDialogVisible(true);
    }

    function handleDeleteBoardClick(boardId: string){
      setdeleteBoardId(boardId);
      setconfirmDeleteDialogVisible(true);
    }

    async function handleDeleteBoardConfirm(){
      const res = await deleteBoardById(deleteBoardId);
      res.json()
        .then(res => console.log(res))
        .catch(err => console.log(err));
      handleDialogClose();
      fetchBoardData();
    }

    function handleEditBoardClick(boardId: string, boardTitle: string){
        setupdateBoardDialogVisible(true);
        settitleFieldValue(boardTitle);
        setEditBoardId(boardId);
    }

    function handleDialogClose(){
        setcreateBoardDialogVisible(false);
        setupdateBoardDialogVisible(false);
        setconfirmDeleteDialogVisible(false);

        settitleFieldValue("");
        setEditBoardId("");
        setdeleteBoardId("");
    }

    function handleTitleFieldChange(e){
        settitleFieldValue(e.target.value);
    }

    async function createBoard() {
        const createBoardBody = {
            title: titleFieldValue,
            userId: localStorage.getItem("tissuetracker-userId")
        }

        const url = `${process.env.API_URL}/board/new`

        const res = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(createBoardBody)
        });
        res.json()
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        handleDialogClose();
        fetchBoardData();
    }

    async function updateBoard() {
        const updateBoardBody = {
            _id: editBoardId,
            newTitle: titleFieldValue,
        }

        const url = `${process.env.API_URL}/board/update/title`

        const res = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(updateBoardBody)
        });
        res.json()
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        handleDialogClose();
        fetchBoardData();
    }

  return(
    <NavPage>
        <div className={styles.bodyDiv}>
        {boards.length > 0 &&
        <h3>Here are your boards</h3>
        }
        {boards.length > 0 && boards.map((board, index) => (
            <Card className={styles.card} key={`${index}title`}>
                <CardContent>
                    <h4 className={styles.cardTitle} key={`${index}title`}>{board.title}</h4>
                </CardContent>

                <CardActions>
                    <Button onClick={() => handleDeleteBoardClick(board._id)} key={`${index}deletebutton`} color="secondary" size="small">Delete</Button>
                    <Button onClick={() => handleEditBoardClick(board._id, board.title)} key={`${index}button`}>Edit</Button>
                    <Link key={`${index}link`} href={{ pathname: 'view-board', query: { boardId: board._id }}}>      
                        <Button size="small" key={`${index}viewBoardButton`}>View</Button>
                    </Link>
                </CardActions>
            </Card>
        )) }

        {boards.length == 0 &&
            <p>You do not have any boards, click the + to make one now!</p>
        }
        </div>

        {/* Create New board Button */}
        <Card className={styles.card}>
            <CardActions className={styles.centeredContent}>
                <Button className={styles.centeredButton} size="large" onClick={handleCreateBoardClick}>+</Button>
            </CardActions>
        </Card>


        {/* Create New board Dialog */}
        <Dialog open={createBoardDialogVisible} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the information below to create a new issue board or click cancel.
          </DialogContentText>
          <TextField
            autoFocus
            value={titleFieldValue} 
            onChange={handleTitleFieldChange}
            margin="dense"
            id="title"
            label="Board Title"
            type="text"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createBoard} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>  

       {/* Confirm delete Dialog */}
       <Dialog open={confirmDeleteDialogVisible} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Delete board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board? You cannot undo this action.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteBoardConfirm} color="primary">
            Delete forever
          </Button>
        </DialogActions>
      </Dialog>  

{/* TODO: Abstract out a dialog and pass in all the necessary function to do anything, use this application wide??? */}
      {/* Update board Dialog */}
        <Dialog open={updateBoardDialogVisible} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update your board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the information below to update your board or click cancel.
          </DialogContentText>
          <TextField
            autoFocus
            value={titleFieldValue} 
            onChange={handleTitleFieldChange}
            margin="dense"
            id="title"
            label="Board Title"
            type="text"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateBoard} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>      
    </NavPage>
  );
}
