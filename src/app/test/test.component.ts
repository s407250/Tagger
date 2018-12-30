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
  //ready = -1;
  szukane = 0;
  znalezione = 0;
  procent = 0;

  listOfFrequencies = [
    { 
      name: 'lion',
      value: 16
    },
    {
      name: 'cat',
      value: 3
    },
    {
      name: 'big cat',
      value: 7
    },
    {
      name: 'celebrity',
      value: 6
    },
    {
      name: 'mane',
      value: 6
    },
    {
      name: 'pride',
      value: 10
    },
    {
      name: 'liger',
      value: 10
    }
  ]
  existInList(word) {
    if (this.listOfFrequencies.some((item) => item.name == word)) {
      return true;
    } else {
      return false;
    }
  }
  // outputTable = [{
  //   word1: '',
  //   rel: '',
  //   word2: '',
  // }];
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
  final = [];
  relationsNameTable = [];
  displayNumberOfOccurrences(word) {
    //1console.log(word)
    //let wordsFindTable = word.match(/(\w ?)+/giu)
    let wordsFindTable = word.split(', ');
    // s = re.split(r', ', string) rozdziela wyrazy wzgledem przecinka, przyda sie przy polskich slowach bo
    // aktualny sposob nie radzi sobie z polskimi znakami
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
          if (!this.filteredWords1.some((item) => item.name == word)){
            this.filteredWords1.push({
              name: word,
              value: this.displayNumberOfOccurrences(word)
            })
          }
          // if (!this.filteredWords1.includes(word)) {
          //   this.filteredWords1.push(word);
          // }
        }
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
    //console.log('filteredRel', helpTable);
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
        if (!this.filteredWords2.some((item) => item.name == word)){
          this.filteredWords2.push({
            name: word,
            value: this.displayNumberOfOccurrences(word)
          })
        }
        // if (!this.filteredWords2.includes(word)) {
        //   this.filteredWords2.push(word);
        // }
      }
    });
    this.sort(this.filteredWords2);
    //console.log('filteredWords2', this.filteredWords2);
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
    //console.log('filteredRel2', helpTable);
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
          if (!this.filteredWords3.some((item) => item.name == word)){
            this.filteredWords3.push({
              name: word,
              value: this.displayNumberOfOccurrences(word)
            })
          }
          // if (!this.filteredWords3.includes(word)) {
          //   this.filteredWords3.push(word);
          // }
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
    //this.ready = 0;
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
  }

  deleteElement(index) {
    this.outputTable.splice(index, 1);
    //console.log(this.outputTable, index);
  }

  finish() {
    console.log(this.outputTable);
  }

  executeList() {
    this.listOfFrequencies.forEach(element => {
      this.oneBigFunction(element.name);
    })
  }
  async oneBigFunction(word) {
    this.testService.getSense(word).subscribe(
      sensesTable => {
        //console.log(sensesTable)
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
                                this.procent = +((this.znalezione/this.szukane)*100).toFixed(2);
                                item2.synsetName = unitString2;
                                // this.fillRelations();
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
        //this.ready = 1;
        console.log(this.final);
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
    //this.testService.getUnitStringSynset(23).subscribe(res => this.final = res);
    //this.oneBigFunction('lew');
  }

}
