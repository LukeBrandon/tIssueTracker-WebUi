export type Board = {
    _id: string;
    title: string;
    userId: string
}

export type Issue = {
    _id: string;
    title: string;
    desc: string;
    status: string;
    userId: string;
    boadId: string;
}
export const ISSUE_TODO: string = "todo";
export const ISSUE_IN_PROGRESS: string = "inprogress";
export const ISSUE_OUT_FOR_REVIEW: string = "review";
export const ISSUE_COMPLETED: string = "completed";

export const ISSUE_TODO_VIEW: string = "Todo";
export const ISSUE_IN_PROGRESS_VIEW: string = "In Progress";
export const ISSUE_OUT_FOR_REVIEW_VIEW: string = "Out for review";
export const ISSUE_COMPLETED_VIEW: string = "Completed";

export interface IssueStatus {
    status: "todo" | "inprogress" | "review" | "completed";
}