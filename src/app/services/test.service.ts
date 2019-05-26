import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class TestService {

    constructor(private http: HttpClient) {}
    api = 'http://api.slowosiec.clarin-pl.eu:80/plwordnet-api/';
    getSense(word) {
        return this.http.get(this.api + 'senses/search?lemma=' + word).pipe(
            // map(res => {console.log(res.content)
            map((res: any) => res.content.filter(({lexicon}) => lexicon.language === 'en')),
            map((res: any) => res.filter(({lemma}) => lemma.word.toLowerCase() === word.toLowerCase()).map(({id, lemma}) => ({
                senseID: id,
                word: lemma.word,
                synsetID: 0,
                content: []
            }))
        ));
    }
    getSynsetBySenseID(senseID) {
        return this.http.get(this.api + 'senses/' + senseID + '/synset').pipe(
            map((res: any) => res.id)
        );
    }
    getRelationsFromSynset(synsetID) {
        return this.http.get(this.api + 'synsets/' + synsetID + '/relations/from').pipe(
            map((res: any) => res.filter(({relation}) => relation.lexicon.language === 'en')),
            /// przepuszcza dalej relacje zwiazanych z jezykiem angielskim
            map((res: any) => res.map(({relation, synsetTo}) => ({
                relationName: relation.name,
                synsetID: synsetTo.id,
                synsetName: '',
                content: []
            })))
        );
    }
    getUnitStringSynset(synsetID) {
        return this.http.get(this.api + 'synsets/' + synsetID + '/unitString').pipe(
            map((res: any) => 
            {
            const words = res.value.replace(/^\(/g, '').replace(/\)$/g, '').replace(/\s\|\s$/g, '').split(/,\s|\s\|\s/);
            const output = [];
            words.forEach(element => {
                output.push({
                    word: element,
                    value: 0
                });
            });
            return output;
            // return res.value
            // //  .replace(/\s\d+\s\([a-z]*\)/g, '')
            // //  .replace(/^\(/g, '')
            // //  .replace(/\)/g, '')
            // //  .replace(/\s*\|/g, ',')
            // //  .replace(/,\s$/g, '')
            // .replace(/^\(/g, '')
            // .replace(/\)$/g, '')
            // .replace(/\([a-z]*\)/g, '')
            // .replace(/\s*\d+\s*/g, '')
            // .replace(/\|/g, ',')
            // // .replace(/\,/g, ', ') // nie wiem czemu przez to zle petle lapal
            // .replace(/\,\s*$/g, '')
            }
            )
        );
    }
}
