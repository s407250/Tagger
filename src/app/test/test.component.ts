import { Component, OnInit, ViewChild } from '@angular/core';
import { TestService } from '../services/test.service';
import { PlWordnetService } from '../services/plwordnet.service';
import { NgForm } from '@angular/forms';
import { Relation } from '../models/relation.interface';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  @ViewChild('f') Articleform: NgForm;
  constructor(private testService: TestService, private plWordnetService: PlWordnetService) { }
  szukane = 0;
  znalezione = 0;
  procent = 0;
  drawTree = false; // po kliknieciu w komponencie graphic-tree bedzie sie tworzyla nowa tablica do wyswietlenia
  outputTable: Relation[] = [{
    word1: {
      name: '',
      value: 0
    },
    rel: '',
    word2: {
      name: '',
      value: 0
    },
  }];
  listOfFrequencies = [
    {name: 'Web 2.0', value: 999}, {name: 'IT applications', value: 999},
    {name: 'digital content', value: 999}, {name: 'Wiki', value: 999},
    {name: 'archaeological heritage management', value: 999}, {name: 'United Kingdom', value: 999},
    {name: 'academic archaeology', value: 999}, {name: 'Oxford Archaeology', value: 999},
    {name: 'movie', value: 999}, {name: 'games', value: 999},
    {name: 'archaeotainment', value: 999}, {name: 'popular culture', value: 999}, /// tagi do calego modulu



    // {name: 'archaeotainment', value: 999}, {name: 'movie', value: 999},
    // {name: 'Indiana Jones', value: 999}, {name: 'Lara Croft', value: 999},
    // {name: 'games', value: 999}, {name: 'toys', value: 999},
    // {name: 'colonial', value: 999}, {name: 'stereotype', value: 999},
    // {name: 'popular culture', value: 999}, {name: 'identity', value: 999},
    // {name: 'Egyptian', value: 999}, {name: 'Indians', value: 999},
    // {name: 'Africans', value: 999},                                /// tagi do unitu Archaeotainment

    // {name: 'archaeology', value: 17}, {name: 'game', value: 17},
    // {name: 'archaeologist', value: 16}, {name: 'movie', value: 14},
    // {name: 'indiana jones', value: 11}, {name: 'entertainment', value: 7},
    // {name: 'profession', value: 6}, {name: 'medium', value: 6},
    // {name: 'lara croft', value: 5}, {name: 'heritage', value: 5},
    // {name: 'pokotylo', value: 4}, {name: 'colonial', value: 4}, /// lista czestosci dla unitu Archaeotainment



    // {name: 'grey literature', value: 999}, {name: 'open archaeology', value: 999},
    // {name: 'Oxford Archaeology', value: 999}, {name: 'United Kingdom', value: 999}, /// tagi do unitu Oxford Archaeology database

    {name: 'data', value: 12}, {name: 'report', value: 6},
    {name: 'developer', value: 6}, {name: 'work', value: 6},
    {name: 'project', value: 5}, {name: 'funded', value: 4},
    {name: 'material', value: 4}, {name: 'oxford archaeology', value: 4}, /// lista czestosci dla unitu Oxford Archaeology database



  ];
  existInList(word) {
    if (this.listOfFrequencies.some((item) => item.name === word)) {
      return true;
    } else {
      return false;
    }
  }

  final = [];
  relationsNameTable = [];

  displayNumberOfOccurrences(word) {
    const wordsFindTable = word.split(', ');
    console.log(wordsFindTable);
    let result = 0;
    wordsFindTable.forEach(element => {
      if (this.listOfFrequencies.find(obj => obj.name === element)) {
        if (this.listOfFrequencies.find(obj => obj.name === element).value > result) {
          result = this.listOfFrequencies.find(obj => obj.name === element).value;
        }
      }
    });
    return result;
  }

  filteredWords1: any[];
  filterWords1(event, index) {
    this.filteredWords1 = [];
    for (let i = 0; i < this.final.length; i++) {
        const word = this.final[i].word;
        if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
          if (!this.filteredWords1.some((item) => item.name === word)) {
            this.filteredWords1.push({
              name: word,
              value: this.displayNumberOfOccurrences(word)
            });
          }
        }
        console.log(this.filteredWords1);
    }
    this.sort(this.filteredWords1);
  }

  filteredRel: any[];
  rel: string;
  filterRelations(event, index) {
    const helpTable = this.final.filter((table) => table.word === this.outputTable[index].word1.name);
    this.filteredRel = [];
    helpTable.forEach(element => {
      element.content.forEach(tmp => {
        const rel = tmp.relationName;
        if (rel.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
          if (!this.filteredRel.includes(rel)) {
            this.filteredRel.push(rel);
          }
        }
      });
    });
  }

  filteredWords2: any[];
  filterWords2(event, index) {
    this.filteredWords2 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1.name)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel);
    helpTable.forEach(element => {
      const word = element.synsetName;
      if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        if (!this.filteredWords2.some((item) => item.name === word)) {
          this.filteredWords2.push({
            name: word,
            value: this.displayNumberOfOccurrences(word)
          });
        }
      }
    });
    this.sort(this.filteredWords2);
  }

  filteredRel2: any[]
  filterRelations2(event, index) {
    this.filteredRel2 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1.name)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel)
      .filter(obj => obj.synsetName === this.outputTable[index].word2.name)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], []);
    helpTable.forEach(element => {
      const rel = element.relationName;
      if (rel.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        if (!this.filteredRel2.includes(rel)) {
          this.filteredRel2.push(rel);
        }
      }
    });
  }

  filteredWords3 = [];
  filterWords3(event, index) {
    this.filteredWords3 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1.name)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel)
      .filter(obj => obj.synsetName === this.outputTable[index].word2.name)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel2);
      helpTable.forEach(element => {
        const word = element.synsetName;
        if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
          if (!this.filteredWords3.some((item) => item.name === word)) {
            this.filteredWords3.push({
              name: word,
              value: this.displayNumberOfOccurrences(word)
            });
          }
        }
      });
      this.sort(this.filteredWords3);
  }


  addNewRelation(index) {
    this.outputTable[index]['rel2'] = '';
    this.outputTable[index]['word3'] = {
      name: '',
      value: 0
    };
  }
  search(value) {
    this.final = [];
    this.szukane = 0;
    this.znalezione = 0;
    this.procent = 0;
    this.outputTable = [{
      word1: {
        name: '',
        value: 0
      },
      rel: '',
      word2: {
        name: '',
        value: 0
      }
    }];
    this.oneBigFunction(value);
  }

  anotherInput() {
    this.outputTable.push({
      word1: {
        name: '',
        value: 0
      },
      rel: '',
      word2: {
        name: '',
        value: 0
      }
    });
    console.log(this.final)
  }

  deleteElement(index) {
    this.outputTable.splice(index, 1);
  }

  finish() {
    console.log(this.outputTable);
  }

  executeList() {
    this.final = [];
    this.szukane = 0;
    this.znalezione = 0;
    this.procent = 0;
    this.listOfFrequencies.forEach(element => {
      this.oneBigFunction(element.name);
    });
  }
  async oneBigFunction(word) {
    this.testService.getSense(word).subscribe(
      sensesTable => {
        sensesTable.forEach(element => {
          this.testService.getSynsetBySenseID(element.senseID).subscribe(synset => {
            element.synsetID = synset;
            this.testService.getRelationsFromSynset(element.synsetID).subscribe(
              relations => {
                element.content = relations;
                element.content.forEach(item => {
                  this.testService.getUnitStringSynset(item.synsetID).subscribe(
                    unitString => {
                      item.synsetName = unitString;
                      this.testService.getRelationsFromSynset(item.synsetID).subscribe(
                        relations2 => {
                          item.content = relations2;
                          item.content.forEach(item2 => {
                          this.szukane ++;
                            this.testService.getUnitStringSynset(item2.synsetID).subscribe(
                              unitString2 => {
                                this.znalezione ++;
                                this.procent = +((this.znalezione / this.szukane) * 100).toFixed(2);
                                item2.synsetName = unitString2;
                              }
                            );
                          });
                        }
                      );
                    }
                  );
                });
              }
            );
          });
        });
        this.final = [...this.final, ...sensesTable];
      }
    );
  }

  // fillRelations() {
  //   this.final.forEach(element => {
  //     element.content.forEach(x => {
  //       if (!this.relationsNameTable.includes(x.relationName)) {
  //         this.relationsNameTable.push(x.relationName);
  //       }
  //       x.content.forEach(y => {
  //         if (!this.relationsNameTable.includes(y.relationName)) {
  //           this.relationsNameTable.push(y.relationName);
  //         }
  //       });
  //     });
  //   });
  // }
  // fillWords() {
  //   this.final.forEach(element => {
  //     element.content.forEach(x => {
  //       if (!this.relationsNameTable.includes(x.relationName)) {
  //         this.relationsNameTable.push(x.relationName);
  //       }
  //       x.content.forEach(y => {
  //         if (!this.relationsNameTable.includes(y.relationName)) {
  //           this.relationsNameTable.push(y.relationName);
  //         }
  //       });
  //     });
  //   });
  // }

  isDefined (field) {
    return typeof field === 'string';
  }

  onSubmit(f) {

  }
  sort(table) {
    table.sort((a, b) => {
      if (a.value < b.value) return 1;
      else if (a.value > b.value) return -1;
      else return 0;
    });
  }

  ngOnInit() {
  }

}
