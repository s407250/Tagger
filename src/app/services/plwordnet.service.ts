import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class PlWordnetService {

    constructor(private http: HttpClient) {}
    api = 'http://api.slowosiec.clarin-pl.eu:80/plwordnet-api/';

    getSense(word) {
        return this.http.get(this.api + 'senses/search?lemma=' + word).pipe(
            map((res: any) => res)
        );
    }
    getSynsetBySenseID(senseID) {
        return this.http.get(this.api + 'senses/' + senseID + '/synset').pipe(
            map((res: any) => res.id)
        );
    }
    getSynsetBySense(senseID) {
        return this.http.get(this.api + 'senses/' + senseID + '/synset').pipe(
            map((res: any) => res)
        );
    }
    getRelationsFromSynset(synsetID) {
        return this.http.get(this.api + 'synsets/' + synsetID + '/relations/from').pipe(
            map((res: any) => res)
        );
    }
    getUnitStringSynset(synsetID) {
        return this.http.get(this.api + 'synsets/' + synsetID + '/unitString').pipe(
            map((res: any) => res)
        );
    }
}
