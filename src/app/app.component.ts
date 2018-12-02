import { Component, OnInit } from '@angular/core';
import { PlWordnetService } from './services/plwordnet.service';
import { Lemma } from './models/lemma.model';
import { getLocaleFirstDayOfWeek } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private plwordnetService: PlWordnetService) {}

  // result = {
  //   senseID: null,
  //   word: null
  // };

  // relations = [];
  // lew = getFirs
  senses;
  relations;

  getAllSensesToWord(word) {
    const relations = [];
    // const senses = [];
    this.plwordnetService.getSense(word)
    .subscribe(
      (res) => {
        // console.log(res.content)
        for (const y of res.content) {
          if ((y.lemma.word).toLowerCase() === word) {
            // zwraca wszystkie sense ktore zawieraja "word" np dla lew -> lew morskim, lew trocki itp. Sprawdza czy slowo jest takie samo
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
        console.log(relations)
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
                    name: y.relation.name,
                    from: y.synsetTo.id
                  });
                }
                for (const y of relations) {
                  if (y.from) {
                    this.plwordnetService.getUnitStringSynset(y.from)
                    .subscribe(
                      (unit) => {
                        y.from = unit.value;
                      },
                      (err) => {
                        console.log(err);
                      }
                    );
                  }
                }
                // console.log(relations)
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
    this.relations = this.getAllSensesToWord('lew');
    // if (this.senses) {
    //   console.log('zaczynamy');
    //   for (const y of this.senses) {
    //     this.relations.push(this.getFirstLevelRelationsToSense(y.senseID));
    //   }
    // }
  }
}
