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
  ready = -1;
  filteredWords3 = [];

  // outputTable = [{
  //   word1: '',
  //   rel: '',
  //   word2: '',
  // }];
  outputTable: Relation[] = [{
    word1: '',
    rel: '',
    word2: '',
  }];
  final = [];
  relationsNameTable = [];

  word1: string;
  filteredWords1: any[];
  filterWords1(event, index) {
    this.filteredWords1 = [];
    for (let i = 0; i < this.final.length; i++) {
        const word = this.final[i].word;
        if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
            this.filteredWords1.push(word);
        }
    }
  }

  filteredRel: any[];
  rel: string;
  filterRelations(event, index) {
    const helpTable = this.final.filter((table) => table.word === this.outputTable[index].word1);
    this.filteredRel = [];
    helpTable.forEach(element => {
      element.content.forEach(tmp => {
        const rel = tmp.relationName;
        if (rel.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
            this.filteredRel.push(rel);
        }
      });
    });
    console.log('filteredRel', helpTable);
  }

  word2: string;
  filteredWords2: any[];
  filterWords2(event, index) {
    this.filteredWords1 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel);
    this.filteredWords2 = [];
    helpTable.forEach(element => {
      const word = element.synsetName;
      if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredWords2.push(word);
      }
    });
    console.log('filteredWords2', helpTable);
  }

  filteredRel2: any[]
  filterRelations2(event, index) {
    this.filteredRel2 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel)
      .filter(obj => obj.synsetName === this.outputTable[index].word2)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], []);
    helpTable.forEach(element => {
      const rel = element.relationName;
      if (rel.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredRel2.push(rel);
      }
    });
    console.log('filteredRel2', helpTable);
  }
  filterWords3(event, index) {
    this.filteredWords3 = [];
    const helpTable = this.final
      .filter((table) => table.word === this.outputTable[index].word1)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel)
      .filter(obj => obj.synsetName === this.outputTable[index].word2)
      .map(({content}) => content)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .filter(obj => obj.relationName === this.outputTable[index].rel2);
      helpTable.forEach(element => {
        const word = element.synsetName;
        if (word.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
          this.filteredWords3.push(word);
        }
      });
  }


  addNewRelation(index) {
  
    this.outputTable[index]['rel2'] = '';
    this.outputTable[index]['word3'] = '';
  }
  search(value) {
    this.ready = 0;
    this.outputTable = [{
      word1: '',
      rel: '',
      word2: ''
    }];
    this.oneBigFunction(value);
  }

  anotherInput() {
    this.outputTable.push({
      word1: '',
      rel: '',
      word2: ''
    });
  }

  deleteElement(index) {
    this.outputTable.splice(index, 1);
    console.log(this.outputTable, index);
  }

  finish() {
    console.log(this.outputTable);
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
                            this.testService.getUnitStringSynset(item2.synsetID).subscribe(
                              unitString2 => {
                                item2.synsetName = unitString2;
                                this.fillRelations();
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
        this.final = sensesTable;
        this.ready = 1;
        console.log(this.final);
      }
    );
  }

  fillRelations() {
    this.final.forEach(element => {
      element.content.forEach(x => {
        if (!this.relationsNameTable.includes(x.relationName)) {
          this.relationsNameTable.push(x.relationName);
        }
        x.content.forEach(y => {
          if (!this.relationsNameTable.includes(y.relationName)) {
            this.relationsNameTable.push(y.relationName);
          }
        });
      });
    });
  }
  fillWords() {
    this.final.forEach(element => {
      element.content.forEach(x => {
        if (!this.relationsNameTable.includes(x.relationName)) {
          this.relationsNameTable.push(x.relationName);
        }
        x.content.forEach(y => {
          if (!this.relationsNameTable.includes(y.relationName)) {
            this.relationsNameTable.push(y.relationName);
          }
        });
      });
    });
  }

  isDefined (field) {
    return typeof field === 'string';
  }

  onSubmit(f) {

  }
  

  ngOnInit() {
    //this.testService.getUnitStringSynset(23).subscribe(res => this.final = res);
    //this.oneBigFunction('lew');
  }

}
