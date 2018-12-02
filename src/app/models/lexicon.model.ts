export class Lexicon {

    id: number;
    name: string;
    lexiconIdentifier: string;
    language: string;
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.lexiconIdentifier = json.lexiconIdentifier;
        this.language = json.language;
    }
}