export type ProblemType =
    | "Array"
    | "String"
    | "Hash Table"
    | "Dynamic Programming"
    | "Math"
    | "Sorting"
    | "Greedy"
    | "Depth-First Search"
    | "Binary Search"
    | "Tree"
    | "Breadth-First Search"
    | "Two Pointers"
    | "Stack"
    | "Backtracking"
    | "Linked List"
    | "Graph"
    | "Heap"
    | "Sliding Window"
    | "Recursion"
    | "Other";

export type Confidence = "red" | "yellow" | "green";
export type Difficulty = "easy" | "medium" | "hard";

export interface LeetCodeProblem {
    id: string;
    name: string;
    problemNumber?: number;
    difficulty: Difficulty;
    type: string;
    stuckOn?: string;
    confidence: Confidence;
    solvedDate: string;
    notes?: string;
    image?: string;
    hints?: string[];
}

export const PROBLEM_TYPES: ProblemType[] = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Binary Search",
    "Tree",
    "Breadth-First Search",
    "Two Pointers",
    "Stack",
    "Backtracking",
    "Linked List",
    "Graph",
    "Heap",
    "Sliding Window",
    "Recursion",
    "Other",
];
