import { Issue } from "../types/types";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ISSUE_TODO, ISSUE_IN_PROGRESS, ISSUE_OUT_FOR_REVIEW, ISSUE_COMPLETED } from "../types/types";
import { ChangeEvent } from "react";

export default function StatusDropdown({issue, updateIssues}){

    async function handleStatusChange(event: ChangeEvent<{value: unknown}>, id: string){
        const changeIssueStatusBody = {
            _id: id,
            newStatus: event.target.value
        }

        const res = await fetch(`http://localhost:6969/issue/update/status`, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(changeIssueStatusBody)
        });
        res.json()
            .then(res => console.log(res))
            .catch(err => console.log(err));
        
        if(updateIssues != null)
            updateIssues();
    }

    return(
        <Select
        labelId="statusPicker"
        id="statusPicker"
        value={issue.status}
        onChange={(e) => handleStatusChange(e, issue._id)}
        >
            <MenuItem value={ISSUE_TODO}>Todo</MenuItem>
            <MenuItem value={ISSUE_IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={ISSUE_OUT_FOR_REVIEW}>Out for Review</MenuItem>
            <MenuItem value={ISSUE_COMPLETED}>Completed</MenuItem>
        </Select>
    );

}