export class Lemma {
    id: number;
    word: string;

    constructor(json) {
        this.id = json.id;
        this.word = json.word;
    }
}
