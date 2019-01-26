import { Component, OnInit, Input } from '@angular/core';
import { Relation } from '../models/relation.interface';

@Component({
  selector: 'app-graphic-tree',
  templateUrl: './graphic-tree.component.html',
  styleUrls: ['./graphic-tree.component.css']
})



export class GraphicTreeComponent implements OnInit {
  @Input() listOfFrequencies;
  @Input() allRelationsTable;
  constructor() { }
  numberOfPositiveRelations = 0;
  numberOfRelationsFinded = 0;
  numberOfExcludedLoops = 0;
  outputTable = [];

  displayNumberOfOccurrences(word, source?) {
    const wordsFindTable = word.split(', ');
    let result = 0;
    if (source) {
      wordsFindTable.forEach(element => {
        if (this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source)) {
          if (this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source).value > result) {
            result = this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source).value;
            // console.log(element + ': ' + result);
          }
        }
      });
      if (wordsFindTable.includes(source) && result === 0) {
        return -1;
      } else {
        return result;
      }
      // console.log(wordsFindTable.includes(source) + ' ' + source + ': ' + result);
    } else {
      wordsFindTable.forEach(element => {
        if (this.listOfFrequencies.find(obj => obj.name === element)) {
          if (this.listOfFrequencies.find(obj => obj.name === element).value > result) {
            result = this.listOfFrequencies.find(obj => obj.name === element).value;
          }
        }
      });
      return result;
    }
  }
  ngOnInit() {
    this.outputTable = this.allRelationsTable.reduce((prev, curr) => { // laczy relacje do tego samego slowa w jedna tablice
      const element = prev.find(item => item.word === curr.word);
      const index = prev.indexOf(element);
      // console.log({prev, curr, index, element});
      if (index !== -1) {
        prev[index].content = [...element.content, ...curr.content];
        return prev;
      } else {
        return [...prev, curr];
      }
    }, []);

    this.outputTable.forEach(element => {
      element['value'] = this.displayNumberOfOccurrences(element.word); // pierwsze slowo
      element.content.forEach(i => {
        if (this.displayNumberOfOccurrences(i.synsetName) > 0) {
          this.numberOfPositiveRelations ++;
          this.numberOfRelationsFinded ++;
        } else {
          this.numberOfPositiveRelations ++;
        } // zlicza ile jest relacji i ile slow ma value > 0
        i['value'] = this.displayNumberOfOccurrences(i.synsetName); // drugie slowo
        i.content.forEach(y => {
          if (this.displayNumberOfOccurrences(y.synsetName, element.word) === -1) {
            // jezeli jest -1 to nic nie rob
            this.numberOfExcludedLoops ++;
          } else {
            if (this.displayNumberOfOccurrences(y.synsetName, element.word) > 0) { // slowo znalezione w liscie czestosic
              this.numberOfPositiveRelations ++;
              this.numberOfRelationsFinded ++;
            } else {
              this.numberOfPositiveRelations ++; // slowo NIE znalezione w liscie czestosci
            }
          }
          y['value'] = this.displayNumberOfOccurrences(y.synsetName, element.word); // trzecie slowo
        });
      });
    });
    // console.log(this.outputTable);
  }

}
