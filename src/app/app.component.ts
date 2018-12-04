import { Component, OnInit } from '@angular/core';
import { PlWordnetService } from './services/plwordnet.service';
import { Lemma } from './models/lemma.model';
import { mergeMap, map, flatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private plwordnetService: PlWordnetService) {}

  senses;
  relations = [];
  // createSenses(senses, word) { // tworzy z ze slowa obiekt z id sensu i pusta tablica na relacje #1
  //   return senses
  //     .filter(({lemma}) => lemma.word.toLowerCase() === word)
  //     .map(({id, lemma}) => ({
  //       senseID: id,
  //       word: lemma.word,
  //       content: []
  //     }));
  // }

  // getContentForSenses (senses) { // uzupelnia tablice content relacjami #2
  //   return senses.map(({senseID, content, ...rest}) => ({
  //       senseID,
  //       content: this.test(senseID),
  //       ...rest
  //     })
  //   );
  // }

  // getSynsets (id) { // wyciaga relacje dla ID synsetu #3
  //    return this.plwordnetService.getRelationsFromSynset(id).pipe(
  //     switchMap(relationsFromSynset => relationsFromSynset.map(({relation, synsetTo}) => ({
  //         name: relation.name,
  //         fromID: synsetTo.id
  //         //fromName: this.getSynsetName(synsetTo.id)
  //       }))
  //     )
  //   ).subscribe(res => res);
  // }

  // getSynsetName ({id}) { // zamienia id synsetu na skrocony opis #4
  //     return this.plwordnetService.getUnitStringSynset(id).pipe(
  //       switchMap(({value}) => value)
  //     ).subscribe(res => res);
  // }

  // getAllSensesToWord2(word) { // main
  //   this.plwordnetService.getSense(word).pipe(
  //     map((res: any) => this.createSenses(res.content, word)),
  //     map(senses => this.getContentForSenses(senses))
  //   ).subscribe(res => this.relations = res);
  // }

  // test(senseID) {
  //   return this.plwordnetService.getSynsetBySenseID(senseID).pipe(
  //     map(id => this.getSynsets(id.id))).subscribe(res => res);
  // }
  // getFirstLevelRelationsToSense2(senseID) {
  //   const relations = [];
  //   this.plwordnetService.getSynsetBySenseID(senseID).subscribe(
  //         (response) => {
  //           this.plwordnetService.getRelationsFromSynset(response.id)
  //           .subscribe(
  //             (relationsFromSynset) => {
  //               for (const y of relationsFromSynset) {
  //                   relations.push({
  //                   name: y.relation.name,
  //                   fromID: y.synsetTo.id,
  //                   fromName: '',
  //                   content: []
  //                 });
  //               }
  //               for (const y of relations) {
  //                 if (y.fromID) {
  //                   this.plwordnetService.getUnitStringSynset(y.fromID)
  //                   .subscribe(
  //                     (unit) => {
  //                         y.fromName = unit.value;
  //                     },
  //                     (err) => {
  //                       console.log(err);
  //                     }
  //                   );
  //                 }
  //               }
  //               for (const y of relations) {
  //                   this.plwordnetService.getRelationsFromSynset(y.fromID)
  //                     .subscribe((res) => {
  //                       for (const i of res) {
  //                         y.content.push({
  //                           name: i.relation.name,
  //                           fromID: i.synsetTo.id,
  //                           fromName: ''
  //                         });
  //                       }
  //                     });
  //               }
  //               for (const y of relations) {
  //                 console.log(y);
  //                 if (y.content.length) {
  //                   for (const index of y.content) {
  //                     this.plwordnetService.getUnitStringSynset(index.fromID)
  //                       .subscribe(
  //                         (unit) => {
  //                           index.fromName = unit.value;
  //                         },
  //                         (err) => {
  //                           console.log(err);
  //                         }
  //                       );
  //                   }
  //                 } else {
  //                   console.log('pusto jest');
  //                 }
  //               }
  //             },
  //             (err) => {
  //               console.log(err);
  //             }
  //           );
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //         );
  //   return relations;
  // }
  getAllSensesToWord(word) {
    const relations = [];
    this.plwordnetService.getSense(word)
    .subscribe(
      (res: any) => {
        // console.log(res.content)
        for (const y of res.content) {
          if ((y.lemma.word).toLowerCase() === word) {
            // zwraca wszystkie sense ktore zawieraja "word" np dla lew -> lew morski, lew trocki itp. Sprawdza czy slowo jest takie samo
            relations.push({
              senseID: y.id,
              word: y.lemma.word,
              content: []
            });
          }
        }
        for (const y of relations) {
          y.content = (this.getFirstLevelRelationsToSense(y.senseID));
        }
        console.log(relations);
      },
      (err) => {
        console.log(err);
      });
      return relations;
  }
  getFirstLevelRelationsToSense(sense) {
    const relations = [];
    this.plwordnetService.getSynsetBySense(sense)
          .subscribe(
          (response) => {
            this.plwordnetService.getRelationsFromSynset(response.id)
            .subscribe(
              (relationsFromSynset) => {
                for (const y of relationsFromSynset) {
                    relations.push({
                    relationName: y.relation.name,
                    synsetID: y.synsetTo.id,
                    name: ''
                  });
                }
                for (const y of relations) {
                  if (y.synsetID) {
                    this.plwordnetService.getUnitStringSynset(y.synsetID)
                    .subscribe(
                      (unit) => {
                          y.name = unit.value;
                      },
                      (err) => {
                        console.log(err);
                      }
                    );
                  }
                }
              },
              (err) => {
                console.log(err);
              }
            );
          },
          (err) => {
            console.log(err);
          }
          );
    return relations;
  }
  ngOnInit() {
    // this.relations = this.getAllSensesToWord('lew');
  }

  logOnClick() {
     console.log(this.relations);
  }
}
