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
  @ViewChild('fileImportInput') fileImportInput: any;

  constructor(private testService: TestService, private plWordnetService: PlWordnetService) { }
  szukane = 0;
  znalezione = 0;
  procent = 0;

  searchesTags = 0;
  FoundedTags = 0;

  csvRecords;
  percentOfWords = 0.05;
  index;

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
  listOfTags = [
    // {name: 'Web 2.0', value: 999}, {name: 'IT applications', value: 999},
    // {name: 'digital content', value: 999}, {name: 'Wiki', value: 999},
    // {name: 'archaeological heritage management', value: 999}, {name: 'United Kingdom', value: 999},
    // {name: 'academic archaeology', value: 999}, {name: 'Oxford Archaeology', value: 999},
    // {name: 'movie', value: 999}, {name: 'games', value: 999},
    // {name: 'archaeotainment', value: 999}, {name: 'popular culture', value: 999}, /// tagi do calego modulu 1

    // {name: 'cultural biography', value: 999}, {name: 'cultural biography of landscape', value: 999},
    // {name: 'landscape', value: 999}, {name: 'object', value: 999},
    // {name: 'historic landscape characterisation', value: 999}, /// tagi do calego modulu 2

    // {name: 'archaeotainment', value: 999}, {name: 'movie', value: 999},
    // {name: 'Indiana Jones', value: 999}, {name: 'Lara Croft', value: 999},
    // {name: 'games', value: 999}, {name: 'toys', value: 999},
    // {name: 'colonial', value: 999}, {name: 'stereotype', value: 999},
    // {name: 'popular culture', value: 999}, {name: 'identity', value: 999},
    // {name: 'Egyptian', value: 999}, {name: 'Indians', value: 999},
    // {name: 'Africans', value: 999},                                /// tagi do unitu Archaeotainment (modul 1)

    // {name: 'grey literature', value: 999}, {name: 'open archaeology', value: 999},
    // {name: 'Oxford Archaeology', value: 999}, {name: 'United Kingdom', value: 999}, /// tagi do unitu Oxford Archaeology database(modul 1)

    // {name: 'United Kingdom', value: 999}, {name: 'historic landscape characterisation', value: 999},
    // {name: 'case study', value: 999},
    // {name: 'English Heritage', value: 999}, {name: 'landscape archaeology', value: 999},/// tagi do unitu How Historic Landscape Characterisation is used in the UK(modul 2)

    // {name: 'Igartza', value: 999}, {name: 'Aranzadi Society of Sciences', value: 999},
    // {name: 'cultural biography of landscape', value: 999}, {name: 'cultural landscape', value: 999},
    // {name: 'restoration', value: 999}, {name: 'Spain', value: 999},
    // {name: 'urban planning', value: 999}, {name: 'Middle Age', value: 999},
    // {name: 'Basque Country', value: 999}, {name: 'heritage valorisation', value: 999},
    // {name: 'identity', value: 999}, {name: 'case study', value: 999},/// tagi do unitu Igartza - Cultural biography of historical urban landscape (modul 2)


    // {name: 'lion', value: 999},{name: 'king of beasts', value: 999}, {name: 'hair', value: 999}, {name: 'Panthera leo', value: 999} // TESTOWE
  ];

  helpList = [];
  listOfFrequencies = [];
  // [...this.listOfTags]; // dlaczego zwykle przypisanie nie dziala?
  // [
    // {name: 'archaeology', value: 17}, {name: 'game', value: 17},
    // {name: 'archaeologist', value: 16}, {name: 'movie', value: 14},
    // {name: 'indiana jones', value: 11}, {name: 'entertainment', value: 7},
    // {name: 'profession', value: 6}, {name: 'medium', value: 6},
    // {name: 'lara croft', value: 5}, {name: 'heritage', value: 5},
    // {name: 'pokotylo', value: 4}, {name: 'colonial', value: 4}, /// lista czestosci dla unitu Archaeotainment (modul 1)

    // {name: 'data', value: 12}, {name: 'report', value: 6},
    // {name: 'developer', value: 6}, {name: 'work', value: 6},
    // {name: 'project', value: 5}, {name: 'funded', value: 4},
    // {name: 'material', value: 4}, {name: 'oxford archaeology', value: 4}, /// lista czestosci dla unitu Oxford Archaeology database (modul 1)

    // {name: 'landscape', value: 28}, {name: 'hlc', value: 19},
    // {name: 'use', value: 13}, {name: 'project', value: 11},
    // {name: 'process', value: 10}, {name: 'characterisation', value: 10},
    // {name: 'map', value: 9}, {name: 'character', value: 8},
    // {name: 'england', value: 8}, {name: 'fairclough', value: 7},
    // {name: 'data', value: 7}, {name: 'apply', value: 6},
    // {name: 'approach', value: 6}, {name: 'plan', value: 5},/// lista czestosci dla unitu How Historic Landscape Characterisation is used in the UK(modul 2)

    // {name: 'igartza', value: 11}, {name: 'build', value: 7},
    // {name: 'landscape', value: 7}, {name: 'plan', value: 6},
    // {name: 'value', value: 6}, {name: 'heritage', value: 5},
    // {name: 'preserve', value: 4}, {name: 'become', value: 4},
    // {name: 'make', value: 4}, {name: 'ensemble', value: 4},/// lista czestosci dla unitu Igartza - Cultural biography of historical urban landscape (modul 2)
  // ];
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
        // console.log(this.filteredWords1);
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
  filterWords3(event, index) {/// poprawic aby w filtrowaniu tez nie pokazywalo petli
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
    console.log(this.final);
  }

  deleteElement(index) {
    this.outputTable.splice(index, 1);
  }

  finish() {
    console.log(this.outputTable);
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
  executeList() {
    this.listOfTags = this.removeDuplicates(this.listOfTags, 'name');
    this.final = [];
    this.szukane = 0;
    this.znalezione = 0;
    this.procent = 0;
    // const numberOfWords = this.listOfTags.length + this.index;
    console.log('dlugosc listy tagow: ' + this.listOfTags.length);
    console.log('dlugosc listy czestosci: ' + this.helpList.length);
    console.log('dlugosc calej tablicy: ' + this.listOfFrequencies.length);
    console.log('biore ' + this.listOfTags.length + ' wyrazow z calej tablicy');
    // console.log('procent z list czestosci: ' + this.percentOfWords + ' czyli ' + this.index + ' wyrazow');
    // console.log('biore ' + numberOfWords + ' wyrazow z calej tablicy');
    // this.listOfFrequencies.forEach(element => {
    //   this.oneBigFunction(element.name);
    // });
    // for (let i = 0; i < numberOfWords; i++) {
    //   this.oneBigFunction(this.listOfFrequencies[i].name);
    // }
    for (let i = 0; i < this.listOfTags.length; i++) {
      this.oneBigFunction(this.listOfFrequencies[i].name);
    }
  }

  async oneBigFunction(word) {
    this.testService.getSense(word).subscribe(
      sensesTable => {
        if (sensesTable.length === 0) {
          this.searchesTags ++;
        } else {
          this.FoundedTags ++;
          this.searchesTags ++;
        }
        sensesTable.forEach(element => {
          this.testService.getSynsetBySenseID(element.senseID).subscribe(synset => {
            element.synsetID = synset;
            this.testService.getUnitStringSynset(element.synsetID).subscribe(unitString => {
              element.word = unitString;
              this.testService.getRelationsFromSynset(element.synsetID).subscribe(
                relations => {
                  element.content = relations;
                  element.content.forEach(item => {
                    this.testService.getUnitStringSynset(item.synsetID).subscribe(
                      unitString1 => {
                        item.synsetName = unitString1;
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

  /// DO PLIKU CSV

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.helpList = [];
    this.listOfFrequencies = [...this.listOfTags];

    if (this.isCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        const csvData = reader.result;
        const csvRecordsArray = csvData.split(/\r\n|\n/);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
        const tags = this.getTagsfromCSV(csvRecordsArray);
        this.index = Math.round(this.csvRecords.length * this.percentOfWords);

        this.helpList.push(...this.csvRecords);
        this.listOfTags.push(...tags);
        this.listOfFrequencies.push(...tags);
        this.listOfFrequencies.push(...this.csvRecords);
      };

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    const dataArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const data = csvRecordsArray[i].split(';');
      try {
        dataArr.push({
          name: data[0].trim(),
          value: data[1].trim()
        });
      }
      catch {
        console.log('skip')
      }
    }
    return dataArr;
  }

  getTagsfromCSV(csvRecordsArray: any) {
    const dataArr = [];
    const data = csvRecordsArray[0].split(';');
    for (let i = 0; i < data.length; i++) {
      dataArr.push({
        name: data[i].trim(),
        value: 'tag'
      });
    }
    return dataArr;
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

}
