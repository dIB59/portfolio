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

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
    green: "Confident",
    yellow: "Needs Review",
    red: "Struggled",
};

export const CONFIDENCE_DOT_CLASSES: Record<Confidence, string> = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500",
};

export const CONFIDENCE_BORDER_CLASSES: Record<Confidence, string> = {
    green: "border-emerald-500/40",
    yellow: "border-amber-500/40",
    red: "border-rose-500/40",
};

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
