import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap, map, flatMap, switchMap, concatMap } from 'rxjs/operators';



@Injectable()
export class TestService {

    constructor(private http: HttpClient) {}
    api = 'http://api.slowosiec.clarin-pl.eu:80/plwordnet-api/';
    getSense(word) {
        return this.http.get(this.api + 'senses/search?lemma=' + word).pipe(
            map((res: any) => res.content.filter(({lemma}) => lemma.word.toLowerCase() === word).map(({id, lemma}) => ({
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
            map((res: any) => res.value)
        );
    }
}
