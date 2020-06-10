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

export default function DashboardPage() {

    const [boards, setBoards] = useState<Board[]>([]);
    const [createBoardDialogVisible, setcreateBoardDialogVisible] = useState<boolean>(false);
    const [updateBoardDialogVisible, setupdateBoardDialogVisible] = useState<boolean>(false);
    const [editBoardId, setEditBoardId] = useState<string>("");

    const [titleFieldValue, settitleFieldValue] = useState<string>("");
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


    function handleCreateBoardClick(){
        setcreateBoardDialogVisible(true);
    }

    function handleEditBoardClick(boardId: string, boardTitle: string){
        setupdateBoardDialogVisible(true);
        settitleFieldValue(boardTitle);
        setEditBoardId(boardId);
    }

    function handleDialogClose(){
        setcreateBoardDialogVisible(false);
        setupdateBoardDialogVisible(false);

        settitleFieldValue("");
        setEditBoardId("");
    }

    function handleTitleFieldChange(e){
        settitleFieldValue(e.target.value);
    }

    async function createBoard() {
        const createBoardBody = {
            title: titleFieldValue,
            userId: userId
        }

        const url = `http://localhost:6969/board/new`

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

        const url = `http://localhost:6969/board/update/title`

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
        <h3>Here are your boards, userId: {userId}:</h3>
        }
        {boards.length > 0 && boards.map((board, index) => (
            <Card className={styles.card} key={`${index}title`}>
                <CardContent>
                    <h4 className={styles.cardTitle} key={`${index}title`}>{board.title}</h4>
                </CardContent>

                <CardActions>
                    <Button onClick={() => handleEditBoardClick(board._id, board.title)} key={`${index}button`}>Edit</Button>
                    <Link key={`${index}link`} href={{ pathname: 'view-board', query: { boardId: board._id }}}>      
                        <Button size="small" key={`${index}viewBoardButton`}>View this board</Button>
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
