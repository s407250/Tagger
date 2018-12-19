export interface Relation {

    word1: {
        name: string,
        value: number
    };
    rel: string;
    word2: {
        name: string,
        value: number
    };
    rel2?: string;
    word3?: {
        name: string,
        value: number
    };
}
