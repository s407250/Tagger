import { Lexicon } from './lexicon.model';

export class PartOfSpeech {

    id: number;
    name: string;
    lexicon: Lexicon;
    lmfType: string;
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.lexicon = json.lexicon;
        this.lmfType = json.lmfType;
    }
}
